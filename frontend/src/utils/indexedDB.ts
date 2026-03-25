/**
 * Utilidad para gestionar IndexedDB
 * Permite almacenar datos de usuario (libros, ejercicios, sesiones) para acceso offline
 */

const DB_NAME = 'MusicPracticeDB';
const DB_VERSION = 1;

// Nombres de los object stores
export const STORES = {
  BOOKS: 'books',
  EXERCISES: 'exercises',
  SESSIONS: 'sessions',
} as const;

/**
 * Inicializa la base de datos IndexedDB
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB no está disponible en este navegador'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Error al abrir IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Crear object stores si no existen
      if (!db.objectStoreNames.contains(STORES.BOOKS)) {
        const bookStore = db.createObjectStore(STORES.BOOKS, { keyPath: 'id' });
        bookStore.createIndex('userId', 'userId', { unique: false });
        bookStore.createIndex('instrument', 'instrument', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.EXERCISES)) {
        const exerciseStore = db.createObjectStore(STORES.EXERCISES, { keyPath: 'id' });
        exerciseStore.createIndex('userId', 'userId', { unique: false });
        exerciseStore.createIndex('bookId', 'bookId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
        const sessionStore = db.createObjectStore(STORES.SESSIONS, { keyPath: 'id' });
        sessionStore.createIndex('userId', 'userId', { unique: false });
        sessionStore.createIndex('date', 'date', { unique: false });
      }

      console.log('✓ IndexedDB inicializada correctamente');
    };
  });
};

/**
 * Guarda un elemento en un store
 */
export const saveItem = async <T extends { id: string | number }>(
  storeName: string,
  item: T
): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    store.put(item);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve(true);
      };
      transaction.onerror = () => {
        reject(new Error('Error al guardar en IndexedDB'));
      };
    });
  } catch (error) {
    console.error(`Error al guardar en ${storeName}:`, error);
    return false;
  }
};

/**
 * Guarda múltiples elementos en un store
 */
export const saveItems = async <T extends { id: string | number }>(
  storeName: string,
  items: T[]
): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    items.forEach(item => {
      store.put(item);
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`✓ ${items.length} elementos guardados en ${storeName}`);
        resolve(true);
      };
      transaction.onerror = () => {
        reject(new Error('Error al guardar múltiples elementos'));
      };
    });
  } catch (error) {
    console.error(`Error al guardar múltiples elementos en ${storeName}:`, error);
    return false;
  }
};

/**
 * Obtiene un elemento por ID
 */
export const getItem = async <T>(
  storeName: string,
  id: string | number
): Promise<T | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        reject(new Error('Error al obtener elemento'));
      };
    });
  } catch (error) {
    console.error(`Error al obtener elemento de ${storeName}:`, error);
    return null;
  }
};

/**
 * Obtiene todos los elementos de un store
 */
export const getAllItems = async <T>(storeName: string): Promise<T[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => {
        reject(new Error('Error al obtener elementos'));
      };
    });
  } catch (error) {
    console.error(`Error al obtener elementos de ${storeName}:`, error);
    return [];
  }
};

/**
 * Obtiene elementos por índice
 */
export const getItemsByIndex = async <T>(
  storeName: string,
  indexName: string,
  value: any
): Promise<T[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => {
        reject(new Error('Error al obtener elementos por índice'));
      };
    });
  } catch (error) {
    console.error(`Error al obtener elementos por índice de ${storeName}:`, error);
    return [];
  }
};

/**
 * Elimina un elemento por ID
 */
export const deleteItem = async (
  storeName: string,
  id: string | number
): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    store.delete(id);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve(true);
      };
      transaction.onerror = () => {
        reject(new Error('Error al eliminar elemento'));
      };
    });
  } catch (error) {
    console.error(`Error al eliminar elemento de ${storeName}:`, error);
    return false;
  }
};

/**
 * Limpia todos los elementos de un store
 */
export const clearStore = async (storeName: string): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    store.clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`🗑️ Store ${storeName} limpiado`);
        resolve(true);
      };
      transaction.onerror = () => {
        reject(new Error('Error al limpiar store'));
      };
    });
  } catch (error) {
    console.error(`Error al limpiar ${storeName}:`, error);
    return false;
  }
};

/**
 * Limpia toda la base de datos
 */
export const clearAllData = async (): Promise<boolean> => {
  try {
    await clearStore(STORES.BOOKS);
    await clearStore(STORES.EXERCISES);
    await clearStore(STORES.SESSIONS);
    console.log('🗑️ Todos los datos offline limpiados');
    return true;
  } catch (error) {
    console.error('Error al limpiar todos los datos:', error);
    return false;
  }
};

/**
 * Obtiene el número de elementos en un store
 */
export const getStoreCount = async (storeName: string): Promise<number> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.count();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(new Error('Error al contar elementos'));
      };
    });
  } catch (error) {
    console.error(`Error al contar elementos de ${storeName}:`, error);
    return 0;
  }
};
