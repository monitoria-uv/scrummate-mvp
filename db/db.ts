import { chatSchema } from '@/components/schemas/chat';
import type { Chat } from '@/types/chat';
import { messageSchema } from '@/components/schemas/message';
import type { Message } from '@/types/message';
/**
 * Provides asynchronous functions for interacting with the local IndexedDB database 'ScrumMateDB' to manage chats and messages.
 *
 * @module db
 */

/**
 * Opens the IndexedDB database 'ScrumMateDB', creating it and its object stores ('chats', 'messages') if they do not exist.
 *
 * @async
 * @function openDB
 * @returns {Promise<IDBDatabase>} - A promise that resolves with the opened IDBDatabase instance.
 * @throws {Error} - If the database fails to open or if event.target is null during the process.
 */
export async function openDB() {
  return new Promise((resolve, reject) => {
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
/**
 * Provides asynchronous functions for interacting with the local IndexedDB database 'ScrumMateDB' to manage chats and messages.
 *
 * @module db
 */

/**
 * Opens the IndexedDB database 'ScrumMateDB', creating it and its object stores ('chats', 'messages') if they do not exist.
 *
 * @async
 * @function openDB
 * @returns {Promise<IDBDatabase>} - A promise that resolves with the opened IDBDatabase instance.
 * @throws {Error} - If the database fails to open or if event.target is null during the process.
 */
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
/**
 * Updates an existing chat in the 'chats' object store.
 *
 * @async
 * @function updateChat
 * @param {string} id - The ID of the chat to update.
 * @param {Chat} chat - The updated chat object.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the chat was updated successfully.
 * @throws {Promise<ZodError>} - If the provided chat object does not conform to the `chatSchema`.
 * @throws {Error} - If there is an error updating the chat in the database.
 */
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
/**
 * Deletes a chat from the 'chats' object store based on its ID.
 *
 * @async
 * @function deleteChat
 * @param {string} id - The ID of the chat to delete.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the chat was deleted successfully.
 * @throws {Error} - If there is an error deleting the chat from the database.
 */
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
/**
 * Adds a new message to the 'messages' object store in the database.
 *
 * @async
 * @function addMessage
 * @param {Message} message - The message object to add. The 'id' property will be automatically generated.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the message was added successfully.
 * @throws {Promise<ZodError>} - If the provided message object does not conform to the `messageSchema`.
 * @throws {Error} - If there is an error adding the message to the database.
 */
export async function addMessage(message: Message): Promise<boolean> {
  try {
    const validatedMessage = messageSchema.parse(message);
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = (db as IDBDatabase).transaction('messages', 'readwrite');
      const store = tx.objectStore('messages');
      const request = store.add({ ...message, id: Date.now(), validatedMessage });

      request.onsuccess = () => {
        res(true);
      };

      request.onerror = () => {
        rej(request.error);
      };
    });
  } catch (error: any) {
    console.error('Error de validación', error.errors);
    return Promise.reject(error.errors);
  }
}
/**
 * Retrieves all messages from the 'messages' object store that belong to a specific chat ID, sorted by timestamp.
 *
 * @async
 * @function getMessagesByChatId
 * @param {string} chatId - The ID of the chat to retrieve messages for.
 * @returns {Promise<Message[]>} - A promise that resolves to an array of `Message` objects for the given chat ID, sorted by their timestamp in ascending order.
 * @throws {Error} - If there is an error opening the database or retrieving messages.
 */
export async function getMessagesByChatId(chatId: string): Promise<Message[]> {
  try {
    const db = await openDB();

    return new Promise((res, rej) => {
      const tx = (db as IDBDatabase).transaction('messages', 'readonly');
      const store = tx.objectStore('messages');
      const index = store.index('chat_id');
      const request = index.getAll(chatId);

      request.onsuccess = () => {
        const messages = request.result as Message[];
        const sorted = messages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
        res(sorted);
      };

      request.onerror = () => {
        console.error('🔹 Error al obtener mensajes por chat_id:', request.error);
        rej(request.error);
      };
    });
  } catch (error: any) {
    console.error('Error de validación', error.errors);
    return Promise.reject(error.errors);
  }
}

/**
 * Updates an existing message in the 'messages' object store.
 *
 * @async
 * @function updateMessage
 * @param {string} id - The ID of the message to update.
 * @param {Message} message - The updated message object.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the message was updated successfully.
 * @throws {Promise<ZodError>} - If the provided message object does not conform to the `chatSchema`.
 * @throws {Error} - If there is an error updating the message in the database.
 */
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
/**
 * Deletes a message from the 'messages' object store based on its ID.
 *
 * @async
 * @function deleteMessage
 * @param {string} id - The ID of the message to delete.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the message was deleted successfully.
 * @throws {Error} - If there is an error deleting the message from the database.
 */
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

/**
 * Retrieves all chats from the 'chats' object store.
 *
 * @async
 * @function getAllChats
 * @returns {Promise<Chat[]>} - A promise that resolves to an array of all `Chat` objects in the database.
 * @throws {Error} - If there is an error opening the database or retrieving chats.
 */
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
/**
 * Retrieves all messages from the 'messages' object store.
 *
 * @async
 * @function getAllMessages
 * @returns {Promise<Message[]>} - A promise that resolves to an array of all `Message` objects in the database.
 * @throws {Error} - If there is an error opening the database or retrieving messages.
 */
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
