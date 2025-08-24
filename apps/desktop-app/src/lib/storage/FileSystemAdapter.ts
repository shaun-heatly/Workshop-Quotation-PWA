import { StorageAdapter, StorageInfo, FileSystemDirectoryHandle } from './types';

export class FileSystemAdapter implements StorageAdapter {
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  private folderPath: string | null = null;

  constructor() {
    // Try to restore previous directory handle from localStorage
    this.restoreDirectoryHandle();
  }

  async selectFolder(): Promise<boolean> {
    try {
      if (!('showDirectoryPicker' in window)) {
        throw new Error('File System Access API not supported');
      }

      this.directoryHandle = await window.showDirectoryPicker!({
        mode: 'readwrite',
        startIn: 'documents'
      });

      this.folderPath = this.directoryHandle.name;
      
      // Store reference for future sessions (Chrome specific)
      try {
        await this.storeDirectoryHandle();
      } catch (error) {
        console.warn('Could not store directory handle:', error);
      }

      return true;
    } catch (error) {
      console.error('Failed to select folder:', error);
      this.directoryHandle = null;
      this.folderPath = null;
      return false;
    }
  }

  hasFolder(): boolean {
    return this.directoryHandle !== null;
  }

  getFolderPath(): string | null {
    return this.folderPath;
  }

  async writeFile(filename: string, data: any): Promise<void> {
    if (!this.directoryHandle) {
      throw new Error('No directory selected');
    }

    try {
      const fileHandle = await this.directoryHandle.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      
      const jsonData = JSON.stringify(data, null, 2);
      await writable.write(jsonData);
      await writable.close();
    } catch (error) {
      throw new Error(`Failed to write file ${filename}: ${error.message}`);
    }
  }

  async readFile<T = any>(filename: string): Promise<T | null> {
    if (!this.directoryHandle) {
      throw new Error('No directory selected');
    }

    try {
      const fileHandle = await this.directoryHandle.getFileHandle(filename);
      const file = await fileHandle.getFile();
      const text = await file.text();
      
      if (!text.trim()) {
        return null;
      }

      return JSON.parse(text) as T;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return null;
      }
      throw new Error(`Failed to read file ${filename}: ${error.message}`);
    }
  }

  async deleteFile(filename: string): Promise<void> {
    if (!this.directoryHandle) {
      throw new Error('No directory selected');
    }

    try {
      await this.directoryHandle.removeEntry(filename);
    } catch (error) {
      if (error.name !== 'NotFoundError') {
        throw new Error(`Failed to delete file ${filename}: ${error.message}`);
      }
    }
  }

  async listFiles(): Promise<string[]> {
    if (!this.directoryHandle) {
      return [];
    }

    try {
      const files: string[] = [];
      for await (const [name, handle] of this.directoryHandle.entries()) {
        if (handle.kind === 'file' && name.endsWith('.json')) {
          files.push(name);
        }
      }
      return files.sort();
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    if (!this.directoryHandle) {
      return false;
    }

    try {
      await this.directoryHandle.getFileHandle(filename);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getStorageInfo(): Promise<StorageInfo> {
    return {
      type: 'filesystem',
      location: this.folderPath || 'No folder selected',
      available: this.hasFolder(),
      canWrite: this.hasFolder(),
    };
  }

  // Private methods for directory handle persistence
  private async storeDirectoryHandle(): Promise<void> {
    if (!this.directoryHandle) return;

    return new Promise((resolve) => {
      try {
        // Store in IndexedDB for Chrome's origin private file system
        const request = indexedDB.open('workshop-quotation-storage', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('directories')) {
            db.createObjectStore('directories');
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Check if the object store exists before using it
          if (!db.objectStoreNames.contains('directories')) {
            console.warn('Object store "directories" not found');
            db.close();
            resolve();
            return;
          }

          const transaction = db.transaction(['directories'], 'readwrite');
          const store = transaction.objectStore('directories');
          
          const putRequest = store.put(this.directoryHandle, 'main-directory');
          
          putRequest.onsuccess = () => {
            db.close();
            resolve();
          };
          
          putRequest.onerror = (error) => {
            console.warn('Failed to store directory handle:', error);
            db.close();
            resolve();
          };
        };

        request.onerror = (error) => {
          console.warn('Could not open IndexedDB:', error);
          resolve();
        };
      } catch (error) {
        console.warn('Could not store directory handle:', error);
        resolve();
      }
    });
  }

  private async restoreDirectoryHandle(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('workshop-quotation-storage', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('directories')) {
            db.createObjectStore('directories');
          }
        };
        
        request.onsuccess = async (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          if (!db.objectStoreNames.contains('directories')) {
            db.close();
            resolve();
            return;
          }

          const transaction = db.transaction(['directories'], 'readonly');
          const store = transaction.objectStore('directories');
          const getRequest = store.get('main-directory');

          getRequest.onsuccess = async () => {
            if (getRequest.result) {
              try {
                // Verify the handle is still valid
                await getRequest.result.queryPermission({ mode: 'readwrite' });
                this.directoryHandle = getRequest.result;
                this.folderPath = this.directoryHandle.name;
              } catch (error) {
                // Handle is invalid, clear it
                console.warn('Stored directory handle is invalid:', error);
                this.clearStoredHandle();
              }
            }
            db.close();
            resolve();
          };

          getRequest.onerror = () => {
            db.close();
            resolve();
          };
        };

        request.onerror = (error) => {
          console.warn('Could not restore directory handle:', error);
          resolve();
        };
      } catch (error) {
        console.warn('Could not restore directory handle:', error);
        resolve();
      }
    });
  }

  private clearStoredHandle(): void {
    try {
      const request = indexedDB.open('workshop-quotation-storage', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('directories')) {
          db.createObjectStore('directories');
        }
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (db.objectStoreNames.contains('directories')) {
          const transaction = db.transaction(['directories'], 'readwrite');
          const store = transaction.objectStore('directories');
          store.delete('main-directory');
        }
        
        db.close();
      };

      request.onerror = (error) => {
        console.warn('Could not clear stored handle:', error);
      };
    } catch (error) {
      console.warn('Could not clear stored handle:', error);
    }
  }

  // Static method to check if File System Access API is supported
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
  }
}