/**
 * Utilidad para gestionar el caché de PDFs usando Cache API
 * Permite almacenar PDFs para acceso offline
 */

const PDF_CACHE_NAME = 'pdf-cache-v1';
const MAX_CACHE_SIZE = 50; // Máximo número de PDFs en caché

/**
 * Verifica si un PDF está en caché
 */
export const isPDFCached = async (url: string): Promise<boolean> => {
  try {
    if (!('caches' in window)) {
      return false;
    }

    const cache = await caches.open(PDF_CACHE_NAME);
    const response = await cache.match(url);
    return !!response;
  } catch (error) {
    console.error('Error al verificar caché de PDF:', error);
    return false;
  }
};

/**
 * Cachea un PDF desde una URL
 */
export const cachePDF = async (url: string): Promise<boolean> => {
  try {
    if (!('caches' in window)) {
      console.warn('Cache API no disponible');
      return false;
    }

    // Verificar si ya está en caché
    const alreadyCached = await isPDFCached(url);
    if (alreadyCached) {
      console.log('📄 PDF ya está en caché:', url);
      return true;
    }

    // Obtener el PDF
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al obtener PDF: ${response.status}`);
    }

    // Abrir caché y guardar
    const cache = await caches.open(PDF_CACHE_NAME);
    await cache.put(url, response);

    console.log('✓ PDF cacheado exitosamente:', url);

    // Limpiar caché si excede el límite
    await cleanupCache();

    return true;
  } catch (error) {
    console.error('Error al cachear PDF:', error);
    return false;
  }
};

/**
 * Obtiene un PDF desde el caché
 */
export const getCachedPDF = async (url: string): Promise<Response | null> => {
  try {
    if (!('caches' in window)) {
      return null;
    }

    const cache = await caches.open(PDF_CACHE_NAME);
    const response = await cache.match(url);
    
    if (response) {
      console.log('📄 PDF obtenido desde caché:', url);
    }
    
    return response || null;
  } catch (error) {
    console.error('Error al obtener PDF desde caché:', error);
    return null;
  }
};

/**
 * Elimina un PDF del caché
 */
export const removePDFFromCache = async (url: string): Promise<boolean> => {
  try {
    if (!('caches' in window)) {
      return false;
    }

    const cache = await caches.open(PDF_CACHE_NAME);
    const deleted = await cache.delete(url);
    
    if (deleted) {
      console.log('🗑️ PDF eliminado del caché:', url);
    }
    
    return deleted;
  } catch (error) {
    console.error('Error al eliminar PDF del caché:', error);
    return false;
  }
};

/**
 * Obtiene la lista de PDFs en caché
 */
export const getCachedPDFList = async (): Promise<string[]> => {
  try {
    if (!('caches' in window)) {
      return [];
    }

    const cache = await caches.open(PDF_CACHE_NAME);
    const requests = await cache.keys();
    
    return requests.map(request => request.url);
  } catch (error) {
    console.error('Error al obtener lista de PDFs en caché:', error);
    return [];
  }
};

/**
 * Limpia el caché si excede el límite máximo
 * Elimina los PDFs más antiguos (FIFO)
 */
const cleanupCache = async (): Promise<void> => {
  try {
    if (!('caches' in window)) {
      return;
    }

    const cache = await caches.open(PDF_CACHE_NAME);
    const requests = await cache.keys();

    if (requests.length > MAX_CACHE_SIZE) {
      const toDelete = requests.length - MAX_CACHE_SIZE;
      console.log(`🧹 Limpiando caché: eliminando ${toDelete} PDFs antiguos`);

      // Eliminar los primeros (más antiguos)
      for (let i = 0; i < toDelete; i++) {
        await cache.delete(requests[i]);
      }
    }
  } catch (error) {
    console.error('Error al limpiar caché:', error);
  }
};

/**
 * Limpia todo el caché de PDFs
 */
export const clearPDFCache = async (): Promise<boolean> => {
  try {
    if (!('caches' in window)) {
      return false;
    }

    const deleted = await caches.delete(PDF_CACHE_NAME);
    
    if (deleted) {
      console.log('🗑️ Caché de PDFs limpiado completamente');
    }
    
    return deleted;
  } catch (error) {
    console.error('Error al limpiar caché de PDFs:', error);
    return false;
  }
};

/**
 * Obtiene el tamaño estimado del caché de PDFs
 */
export const getCacheSize = async (): Promise<number> => {
  try {
    if (!('caches' in window)) {
      return 0;
    }

    const cache = await caches.open(PDF_CACHE_NAME);
    const requests = await cache.keys();
    
    return requests.length;
  } catch (error) {
    console.error('Error al obtener tamaño del caché:', error);
    return 0;
  }
};
