import { StorageAdapter, StorageInfo } from './types';

export class LocalStorageAdapter implements StorageAdapter {
  private readonly PREFIX = 'workshop-quotation-';
  private readonly FOLDER_KEY = `${this.PREFIX}folder-selected`;
  
  constructor() {
    // Ensure localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      throw new Error('localStorage is not available');
    }
  }

  async selectFolder(): Promise<boolean> {
    // For localStorage, we simulate folder selection
    // This is mainly for development and fallback scenarios
    try {
      const folderName = prompt('Enter a folder name for your workshop data:', 'WorkshopData');
      if (folderName) {
        localStorage.setItem(this.FOLDER_KEY, folderName);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to set folder name:', error);
      return false;
    }
  }

  hasFolder(): boolean {
    return localStorage.getItem(this.FOLDER_KEY) !== null;
  }

  getFolderPath(): string | null {
    const folderName = localStorage.getItem(this.FOLDER_KEY);
    return folderName ? `localStorage:///${folderName}` : null;
  }

  async writeFile(filename: string, data: any): Promise<void> {
    try {
      const key = this.getFileKey(filename);
      const jsonData = JSON.stringify(data, null, 2);
      
      // Check localStorage quota
      const currentSize = this.getStorageSize();
      const dataSize = new Blob([jsonData]).size;
      
      if (currentSize + dataSize > 5 * 1024 * 1024) { // 5MB rough limit
        throw new Error('localStorage quota exceeded');
      }

      localStorage.setItem(key, jsonData);
      
      // Update file list
      this.updateFileList(filename, 'add');
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        throw new Error(`localStorage quota exceeded when writing ${filename}`);
      }
      throw new Error(`Failed to write file ${filename}: ${error.message}`);
    }
  }

  async readFile<T = any>(filename: string): Promise<T | null> {
    try {
      const key = this.getFileKey(filename);
      const data = localStorage.getItem(key);
      
      if (!data) {
        return null;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      throw new Error(`Failed to read file ${filename}: ${error.message}`);
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const key = this.getFileKey(filename);
      localStorage.removeItem(key);
      
      // Update file list
      this.updateFileList(filename, 'remove');
    } catch (error) {
      throw new Error(`Failed to delete file ${filename}: ${error.message}`);
    }
  }

  async listFiles(): Promise<string[]> {
    try {
      const fileListKey = `${this.PREFIX}files`;
      const fileList = localStorage.getItem(fileListKey);
      
      if (!fileList) {
        // Build file list from existing keys
        const files: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`${this.PREFIX}file-`) && key.endsWith('.json')) {
            const filename = key.replace(`${this.PREFIX}file-`, '');
            files.push(filename);
          }
        }
        
        // Store the rebuilt list
        if (files.length > 0) {
          localStorage.setItem(fileListKey, JSON.stringify(files));
        }
        
        return files.sort();
      }

      return JSON.parse(fileList).sort();
    } catch (error) {
      console.error('Failed to list files:', error);
      return [];
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    const key = this.getFileKey(filename);
    return localStorage.getItem(key) !== null;
  }

  async getStorageInfo(): Promise<StorageInfo> {
    const size = this.getStorageSize();
    const folderName = localStorage.getItem(this.FOLDER_KEY);
    
    return {
      type: 'localstorage',
      location: folderName ? `localStorage:///${folderName}` : 'No folder selected',
      available: this.hasFolder(),
      canWrite: true,
      estimatedSize: size,
    };
  }

  // Private helper methods
  private getFileKey(filename: string): string {
    return `${this.PREFIX}file-${filename}`;
  }

  private updateFileList(filename: string, action: 'add' | 'remove'): void {
    try {
      const fileListKey = `${this.PREFIX}files`;
      let files: string[] = [];
      
      const existingList = localStorage.getItem(fileListKey);
      if (existingList) {
        files = JSON.parse(existingList);
      }

      if (action === 'add') {
        if (!files.includes(filename)) {
          files.push(filename);
        }
      } else {
        files = files.filter(f => f !== filename);
      }

      localStorage.setItem(fileListKey, JSON.stringify(files));
    } catch (error) {
      console.warn('Failed to update file list:', error);
    }
  }

  private getStorageSize(): number {
    let total = 0;
    for (let key in localStorage) {
      if (key.startsWith(this.PREFIX)) {
        total += localStorage[key].length;
      }
    }
    return total;
  }

  // Static method to check if localStorage is available
  static isSupported(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Utility method to clear all workshop data
  clearAllData(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Export data for backup
  exportData(): Record<string, any> {
    const data: Record<string, any> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.PREFIX}file-`)) {
        const filename = key.replace(`${this.PREFIX}file-`, '');
        try {
          data[filename] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch (error) {
          console.warn(`Failed to export ${filename}:`, error);
        }
      }
    }

    return data;
  }

  // Import data from backup
  importData(data: Record<string, any>): void {
    Object.entries(data).forEach(([filename, fileData]) => {
      try {
        this.writeFile(filename, fileData);
      } catch (error) {
        console.error(`Failed to import ${filename}:`, error);
      }
    });
  }
}