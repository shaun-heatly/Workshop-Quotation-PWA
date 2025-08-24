import { StorageAdapter, StorageInfo } from './types';
import { FileSystemAdapter } from './FileSystemAdapter';
import { LocalStorageAdapter } from './LocalStorageAdapter';

export class StorageManager {
  private adapter: StorageAdapter | null = null;
  private preferredType: 'filesystem' | 'localstorage' | null = null;
  private initialized = false;

  constructor() {
    // Don't initialize during SSR - defer until client side
    if (typeof window !== 'undefined') {
      this.initializeAdapter();
    }
  }

  // Public API
  async selectFolder(): Promise<boolean> {
    await this.ensureInitialized();
    
    if (!this.adapter) {
      throw new Error('No storage adapter available');
    }

    return this.adapter.selectFolder();
  }

  async hasFolder(): Promise<boolean> {
    await this.ensureInitialized();
    return this.adapter?.hasFolder() ?? false;
  }

  // Synchronous version for components
  hasFolderSync(): boolean {
    return this.adapter?.hasFolder() ?? false;
  }

  async getFolderPath(): Promise<string | null> {
    await this.ensureInitialized();
    return this.adapter?.getFolderPath() ?? null;
  }

  // Synchronous version for components
  getFolderPathSync(): string | null {
    return this.adapter?.getFolderPath() ?? null;
  }

  async writeFile(filename: string, data: any): Promise<void> {
    await this.ensureInitialized();
    if (!this.adapter) {
      throw new Error('No storage adapter initialized');
    }
    return this.adapter.writeFile(filename, data);
  }

  async readFile<T = any>(filename: string): Promise<T | null> {
    await this.ensureInitialized();
    if (!this.adapter) {
      throw new Error('No storage adapter initialized');
    }
    return this.adapter.readFile<T>(filename);
  }

  async deleteFile(filename: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.adapter) {
      throw new Error('No storage adapter initialized');
    }
    return this.adapter.deleteFile(filename);
  }

  async listFiles(): Promise<string[]> {
    await this.ensureInitialized();
    if (!this.adapter) {
      return [];
    }
    return this.adapter.listFiles();
  }

  async fileExists(filename: string): Promise<boolean> {
    await this.ensureInitialized();
    if (!this.adapter) {
      return false;
    }
    return this.adapter.fileExists(filename);
  }

  async getStorageInfo(): Promise<StorageInfo> {
    await this.ensureInitialized();
    if (!this.adapter) {
      return {
        type: 'localstorage',
        location: 'No storage initialized',
        available: false,
        canWrite: false,
      };
    }
    
    
    return this.adapter.getStorageInfo();
  }

  // Adapter management
  getAdapterType(): 'filesystem' | 'localstorage' | null {
    if (!this.adapter) return null;
    return this.adapter instanceof FileSystemAdapter ? 'filesystem' : 'localstorage';
  }

  async switchAdapter(type: 'filesystem' | 'localstorage'): Promise<boolean> {
    try {
      const newAdapter = this.createAdapter(type);
      if (newAdapter) {
        this.adapter = newAdapter;
        this.preferredType = type;
        this.savePreference(type);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to switch to ${type} adapter:`, error);
      return false;
    }
  }

  // Migration between adapters
  async migrateData(fromType: 'filesystem' | 'localstorage', toType: 'filesystem' | 'localstorage'): Promise<boolean> {
    try {
      const fromAdapter = this.createAdapter(fromType);
      const toAdapter = this.createAdapter(toType);

      if (!fromAdapter || !toAdapter) {
        throw new Error('Could not create adapters for migration');
      }

      // Get all files from source
      const files = await fromAdapter.listFiles();
      
      for (const filename of files) {
        const data = await fromAdapter.readFile(filename);
        if (data) {
          await toAdapter.writeFile(filename, data);
        }
      }

      // Switch to new adapter
      this.adapter = toAdapter;
      this.preferredType = toType;
      this.savePreference(toType);

      return true;
    } catch (error) {
      console.error('Migration failed:', error);
      return false;
    }
  }

  // Backup and restore
  async exportAllData(): Promise<Record<string, any>> {
    if (!this.adapter) {
      throw new Error('No storage adapter initialized');
    }

    const files = await this.listFiles();
    const data: Record<string, any> = {};

    for (const filename of files) {
      const fileData = await this.readFile(filename);
      if (fileData) {
        data[filename] = fileData;
      }
    }

    return data;
  }

  async importAllData(data: Record<string, any>): Promise<void> {
    if (!this.adapter) {
      throw new Error('No storage adapter initialized');
    }

    for (const [filename, fileData] of Object.entries(data)) {
      await this.writeFile(filename, fileData);
    }
  }

  // Initialization methods
  async ensureInitialized(): Promise<void> {
    if (!this.initialized && typeof window !== 'undefined' && !this.adapter) {
      await this.initializeAdapter();
    }
  }

  private async initializeAdapter(): Promise<void> {
    // Check for saved preference
    const savedPreference = this.getSavedPreference();
    
    if (savedPreference) {
      const adapter = this.createAdapter(savedPreference);
      if (adapter) {
        this.adapter = adapter;
        this.preferredType = savedPreference;
        return;
      }
    }

    // Auto-detect best available adapter
    if (FileSystemAdapter.isSupported()) {
      this.adapter = new FileSystemAdapter();
      this.preferredType = 'filesystem';
    } else if (LocalStorageAdapter.isSupported()) {
      this.adapter = new LocalStorageAdapter();
      this.preferredType = 'localstorage';
    } else {
      throw new Error('No storage adapter is supported');
    }

    this.savePreference(this.preferredType);
    this.initialized = true;
  }

  private createAdapter(type: 'filesystem' | 'localstorage'): StorageAdapter | null {
    try {
      switch (type) {
        case 'filesystem':
          if (FileSystemAdapter.isSupported()) {
            return new FileSystemAdapter();
          }
          break;
        case 'localstorage':
          if (LocalStorageAdapter.isSupported()) {
            return new LocalStorageAdapter();
          }
          break;
      }
      return null;
    } catch (error) {
      console.error(`Failed to create ${type} adapter:`, error);
      return null;
    }
  }

  private savePreference(type: 'filesystem' | 'localstorage'): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('workshop-storage-preference', type);
      }
    } catch (error) {
      console.warn('Could not save storage preference:', error);
    }
  }

  private getSavedPreference(): 'filesystem' | 'localstorage' | null {
    try {
      if (typeof window === 'undefined') return null;
      const preference = localStorage.getItem('workshop-storage-preference');
      if (preference === 'filesystem' || preference === 'localstorage') {
        return preference;
      }
    } catch (error) {
      console.warn('Could not get saved storage preference:', error);
    }
    return null;
  }

  // Static utility methods
  static getAvailableAdapters(): Array<{ type: 'filesystem' | 'localstorage', supported: boolean, name: string }> {
    return [
      {
        type: 'filesystem',
        supported: FileSystemAdapter.isSupported(),
        name: 'File System Access (Chrome/Edge)',
      },
      {
        type: 'localstorage',
        supported: LocalStorageAdapter.isSupported(),
        name: 'Local Storage (All browsers)',
      },
    ];
  }

  static getBestAdapter(): 'filesystem' | 'localstorage' | null {
    if (FileSystemAdapter.isSupported()) {
      return 'filesystem';
    }
    if (LocalStorageAdapter.isSupported()) {
      return 'localstorage';
    }
    return null;
  }
}

// Singleton instance for global use
export const storageManager = new StorageManager();