// Storage system exports

export { StorageManager, storageManager } from './StorageManager';
export { FileSystemAdapter } from './FileSystemAdapter';
export { LocalStorageAdapter } from './LocalStorageAdapter';
export type { 
  StorageAdapter, 
  StorageInfo, 
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
  DirectoryPickerOptions 
} from './types';

// Re-export storageManager as storage for convenience
import { storageManager } from './StorageManager';
export { storageManager as storage };