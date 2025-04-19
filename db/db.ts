import { chatSchema } from '@/components/schema/chat';
import type { Chat } from '@/types/chat';
import { messageSchema } from '@/components/schema/message';
import type { Message } from '@/types/message';

export async function openDB() {
  return new Promise((resolve, reject) => {
    console.log('🔹 Abriendo IndexedDB...');
    const request = indexedDB.open('ScrumMateDB', 2);

    function getRequestResult(event: Event): IDBDatabase | null {
      const target = event.target as IDBOpenDBRequest | null;
      if (!target) return null;
      return target.result;
    }

    request.onupgradeneeded = (event) => {
      console.log('🔹 Creando base de datos...');
      const db = getRequestResult(event);
      if (!db) {
        reject(new Error('Failed to open database: event.target is null'));
        return;
      }
      if (!db.objectStoreNames.contains('chats')) {
        db.createObjectStore('chats', { keyPath: 'id' });
        console.log('🔹 Almaces de chats creados exitosamente');
      }
      if (!db.objectStoreNames.contains('messages')) {
        const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('chat_id', 'chat_id', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      const db = getRequestResult(event);
      if (!db) {
        reject(new Error('Failed to open database: event.target is null'));
        return;
      }
      console.log('🔹 Base de datos abierta exitosamente');
      resolve(db);
    };

    request.onerror = (event) => {
      const target = event.target as IDBOpenDBRequest | null;
      if (!target) {
        reject(new Error('Failed to open database: event.target is null'));
        return;
      }
      console.error('🔹 Error al abrir la base de datos:', target.error);
      reject(target.error);
    };
  });
}

export async function addChat(chat: Chat): Promise<boolean> {
  try {
    const validatedChat = chatSchema.parse(chat);
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = (db as IDBDatabase).transaction('chats', 'readwrite');
      const store = tx.objectStore('chats');
      const request = store.add({ ...chat, id: Date.now(), validatedChat });

      request.onsuccess = () => {
        console.log('🔹 Chat agregada exitosamente');
        res(true);
      };

      request.onerror = () => {
        console.error('🔹 Error al agregar chat:', request.error);
        rej(request.error);
      };
    });
  } catch (error: any) {
    console.error('Error de validación', error.errors);
    return Promise.reject(error.errors);
  }
}

export async function updateChat(id: string, chat: Chat): Promise<boolean> {
  try {
    const validatedChat = chatSchema.parse(chat);
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = (db as IDBDatabase).transaction('chats', 'readwrite');
      const store = tx.objectStore('chats');
      const request = store.put({ ...chat, id });
      request.onsuccess = () => {
        console.log('🔹 Chat modificado exitosamente');
        res(true);
      };

      request.onerror = () => {
        console.error('🔹 Error al modificar chat:', request.error);
        rej(request.error);
      };
    });
  } catch (error: any) {
    console.error('Error de validación', error.errors);
    return Promise.reject(error.errors);
  }
}

export async function deleteChat(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = (db as IDBDatabase).transaction('chats', 'readwrite');
      const store = tx.objectStore('chats');
      const request = store.delete(id);
      request.onsuccess = () => {
        console.log('🔹 Chat eliminado exitosamente');
        res(true);
      };

      request.onerror = () => {
        console.error('🔹 Error al elimnado chat:', request.error);
        rej(request.error);
      };
    });
  } catch (error: any) {
    console.error('Error de validación', error.errors);
    return Promise.reject(error.errors);
  }
}

export async function addMessage(message: Message): Promise<boolean> {
  try {
    const validatedMessage = messageSchema.parse(message);
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = (db as IDBDatabase).transaction('messages', 'readwrite');
      const store = tx.objectStore('messages');
      const request = store.add({ ...message, id: Date.now(), validatedMessage });

      request.onsuccess = () => {
        console.log('🔹 Mensaje agregado exitosamente');
        res(true);
      };

      request.onerror = () => {
        console.error('🔹 Error al agregar mensaje:', request.error);
        rej(request.error);
      };
    });
  } catch (error: any) {
    console.error('Error de validación', error.errors);
    return Promise.reject(error.errors);
  }
}

export async function getMessagesByChatId(chatId: string): Promise<Message[]> {
  try {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = (db as IDBDatabase).transaction('messages', 'readonly');
      const store = tx.objectStore('messages');
      const request = store.getAll();
      request.onsuccess = () => {
        console.log('🔹 Mensajes obtenidos exitosamente');
        const result = request.result as Message[];
        console.log(result);
        const filtered = result.filter((msg) => msg.chat_id === chatId);
        const sorted = filtered.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
        res(sorted);
      };

      request.onerror = () => {
        console.error('🔹 Error al obtener mensajes:', request.error);
        rej(request.error);
      };
    });
  } catch (error: any) {
    console.error('Error de validación', error.errors);
    return Promise.reject(error.errors);
  }
}

export async function updateMessage(id: string, message: Message): Promise<boolean> {
  try {
    const validatedMessage = chatSchema.parse(message);
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = (db as IDBDatabase).transaction('messages', 'readwrite');
      const store = tx.objectStore('messages');
      const request = store.put({ ...message, id });
      request.onsuccess = () => {
        console.log('🔹 Mensaje modificado exitosamente');
        res(true);
      };

      request.onerror = () => {
        console.error('🔹 Error al modificar mensaje:', request.error);
        rej(request.error);
      };
    });
  } catch (error: any) {
    console.error('Error de validación', error.errors);
    return Promise.reject(error.errors);
  }
}

export async function deleteMessage(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = (db as IDBDatabase).transaction('messages', 'readwrite');
      const store = tx.objectStore('messages');
      const request = store.delete(id);
      request.onsuccess = () => {
        console.log('🔹 Mensaje eliminado exitosamente');
        res(true);
      };

      request.onerror = () => {
        console.error('🔹 Error al elimnar mensaje:', request.error);
        rej(request.error);
      };
    });
  } catch (error: any) {
    console.error('Error de validación', error.errors);
    return Promise.reject(error.errors);
  }
}

// 🔹 Obtener todos los chats
export async function getAllChats(): Promise<Chat[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = (db as IDBDatabase).transaction('chats', 'readonly');
    const store = tx.objectStore('chats');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as Chat[]);
    request.onerror = () => reject(request.error);
  });
}

// 🔹 Obtener todos los mensajes
export async function getAllMessages(): Promise<Message[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = (db as IDBDatabase).transaction('messages', 'readonly');
    const store = tx.objectStore('messages');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as Message[]);
    request.onerror = () => reject(request.error);
  });
}
