import api from './authService';
import type { Book, BookFormData, BookUpdateData } from '../types/book.types';
import type { Instrument } from '../types/auth.types';
import { saveItems, getAllItems, getItem, saveItem, deleteItem, STORES } from '../utils/indexedDB';

export const bookService = {
  async getBooks(search?: string, instrument?: Instrument): Promise<Book[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (instrument) params.append('instrument', instrument);
      
      const response = await api.get<{ books: Book[] }>(
        `/api/books${params.toString() ? `?${params.toString()}` : ''}`
      );
      
      // Guardar en IndexedDB para acceso offline
      await saveItems(STORES.BOOKS, response.data.books);
      
      return response.data.books;
    } catch (error: any) {
      // Si falla la petición, intentar obtener desde IndexedDB
      console.warn('Error al cargar libros desde API, intentando desde caché:', error);
      const cachedBooks = await getAllItems<Book>(STORES.BOOKS);
      
      if (cachedBooks.length > 0) {
        console.log('📚 Libros obtenidos desde caché offline');
        
        // Aplicar filtros localmente si es necesario
        let filteredBooks = cachedBooks;
        
        if (search) {
          const searchLower = search.toLowerCase();
          filteredBooks = filteredBooks.filter(book => 
            book.name.toLowerCase().includes(searchLower) ||
            book.description?.toLowerCase().includes(searchLower)
          );
        }
        
        if (instrument) {
          filteredBooks = filteredBooks.filter(book => book.instrument === instrument);
        }
        
        return filteredBooks;
      }
      
      throw new Error(error.message || 'Error al cargar los libros');
    }
  },

  async getBook(id: string): Promise<Book> {
    try {
      const response = await api.get<{ book: Book }>(`/api/books/${id}`);
      
      // Guardar en IndexedDB
      await saveItem(STORES.BOOKS, response.data.book);
      
      return response.data.book;
    } catch (error: any) {
      // Intentar obtener desde IndexedDB
      console.warn('Error al cargar libro desde API, intentando desde caché:', error);
      const cachedBook = await getItem<Book>(STORES.BOOKS, id);
      
      if (cachedBook) {
        console.log('📚 Libro obtenido desde caché offline');
        return cachedBook;
      }
      
      throw new Error(error.message || 'Error al cargar el libro');
    }
  },

  async uploadBook(data: BookFormData): Promise<Book> {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('instrument', data.instrument);
      formData.append('description', data.description);
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await api.post<{ book: Book }>(
        `/api/books`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Guardar en IndexedDB
      await saveItem(STORES.BOOKS, response.data.book);
      
      return response.data.book;
    } catch (error: any) {
      console.error('Error al subir libro:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error al subir el libro';
      throw new Error(errorMessage);
    }
  },

  async updateBook(id: string, data: BookUpdateData): Promise<Book> {
    try {
      const response = await api.put<{ book: Book }>(
        `/api/books/${id}`,
        data
      );
      
      // Actualizar en IndexedDB
      await saveItem(STORES.BOOKS, response.data.book);
      
      return response.data.book;
    } catch (error: any) {
      console.error('Error al actualizar libro:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error al actualizar el libro';
      throw new Error(errorMessage);
    }
  },

  async deleteBook(id: string): Promise<void> {
    try {
      await api.delete(`/api/books/${id}`);
      
      // Eliminar de IndexedDB
      await deleteItem(STORES.BOOKS, id);
    } catch (error: any) {
      console.error('Error al eliminar libro:', error);
      
      // Extraer el mensaje de error del servidor
      const errorMessage = error.response?.data?.error || error.message || 'Error al eliminar el libro';
      throw new Error(errorMessage);
    }
  },
};
