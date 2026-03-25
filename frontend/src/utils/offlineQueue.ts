/**
 * Sistema de cola de sincronización offline
 * Encola operaciones de escritura cuando no hay conexión y las sincroniza al reconectar
 */

export interface QueuedOperation {
  id: string;
  type: 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'offline_queue';
const MAX_RETRIES = 3;

/**
 * Obtiene todas las operaciones en cola
 */
export const getQueue = (): QueuedOperation[] => {
  try {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error al leer la cola offline:', error);
    return [];
  }
};

/**
 * Guarda la cola en localStorage
 */
const saveQueue = (queue: QueuedOperation[]): void => {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error al guardar la cola offline:', error);
  }
};

/**
 * Agrega una operación a la cola
 */
export const enqueueOperation = (
  type: QueuedOperation['type'],
  url: string,
  data?: any
): void => {
  const queue = getQueue();
  const operation: QueuedOperation = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    url,
    data,
    timestamp: Date.now(),
    retries: 0,
  };
  
  queue.push(operation);
  saveQueue(queue);
  
  console.log(`📥 Operación encolada: ${type} ${url}`);
};

/**
 * Elimina una operación de la cola
 */
export const dequeueOperation = (id: string): void => {
  const queue = getQueue();
  const filteredQueue = queue.filter(op => op.id !== id);
  saveQueue(filteredQueue);
};

/**
 * Incrementa el contador de reintentos de una operación
 */
const incrementRetries = (id: string): void => {
  const queue = getQueue();
  const operation = queue.find(op => op.id === id);
  
  if (operation) {
    operation.retries += 1;
    
    if (operation.retries >= MAX_RETRIES) {
      // Eliminar operación si excede el máximo de reintentos
      console.error(`❌ Operación ${id} eliminada después de ${MAX_RETRIES} reintentos`);
      dequeueOperation(id);
    } else {
      saveQueue(queue);
    }
  }
};

/**
 * Procesa todas las operaciones en cola
 * Retorna el número de operaciones procesadas exitosamente
 */
export const processQueue = async (
  axiosInstance: any
): Promise<{ success: number; failed: number }> => {
  const queue = getQueue();
  
  if (queue.length === 0) {
    return { success: 0, failed: 0 };
  }
  
  console.log(`🔄 Procesando ${queue.length} operaciones en cola...`);
  
  let successCount = 0;
  let failedCount = 0;
  
  for (const operation of queue) {
    try {
      // Ejecutar la operación según su tipo
      switch (operation.type) {
        case 'POST':
          await axiosInstance.post(operation.url, operation.data);
          break;
        case 'PUT':
          await axiosInstance.put(operation.url, operation.data);
          break;
        case 'DELETE':
          await axiosInstance.delete(operation.url);
          break;
      }
      
      // Si tiene éxito, eliminar de la cola
      dequeueOperation(operation.id);
      successCount++;
      console.log(`✓ Operación sincronizada: ${operation.type} ${operation.url}`);
      
    } catch (error) {
      console.error(`✗ Error al sincronizar operación ${operation.id}:`, error);
      incrementRetries(operation.id);
      failedCount++;
    }
  }
  
  console.log(`✅ Sincronización completada: ${successCount} exitosas, ${failedCount} fallidas`);
  
  return { success: successCount, failed: failedCount };
};

/**
 * Limpia toda la cola (usar con precaución)
 */
export const clearQueue = (): void => {
  localStorage.removeItem(QUEUE_KEY);
  console.log('🗑️ Cola offline limpiada');
};

/**
 * Obtiene el número de operaciones pendientes
 */
export const getQueueSize = (): number => {
  return getQueue().length;
};

/**
 * Verifica si hay operaciones pendientes
 */
export const hasQueuedOperations = (): boolean => {
  return getQueueSize() > 0;
};
