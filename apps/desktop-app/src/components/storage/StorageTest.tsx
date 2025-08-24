'use client';

import React, { useState, useEffect } from 'react';
import { storageManager, StorageInfo } from '@/lib/storage';

export function StorageTest() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    try {
      // Force re-initialization to ensure adapter is up to date
      await storageManager.ensureInitialized();
      const info = await storageManager.getStorageInfo();
      console.log('Storage info loaded:', info);
      setStorageInfo(info);
      
      if (info.available) {
        const fileList = await storageManager.listFiles();
        console.log('Files loaded:', fileList);
        setFiles(fileList);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error('Error loading storage info:', error);
      setTestResult(`Error loading storage info: ${error.message}`);
    }
  };

  const handleSelectFolder = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      console.log('Selecting folder...');
      const success = await storageManager.selectFolder();
      console.log('Selection result:', success);
      
      if (success) {
        setTestResult('✅ Folder selected successfully!');
        
        // Debug: check if adapter has folder
        const hasFolder = storageManager.hasFolderSync();
        const folderPath = storageManager.getFolderPathSync();
        console.log('After selection - hasFolder:', hasFolder, 'folderPath:', folderPath);
        
        // Refresh storage info
        await loadStorageInfo();
      } else {
        setTestResult('❌ Failed to select folder');
      }
    } catch (error) {
      console.error('Selection error:', error);
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestWrite = async () => {
    if (!storageManager.hasFolderSync()) {
      setTestResult('❌ No folder selected');
      return;
    }

    setIsLoading(true);
    setTestResult('');

    try {
      const testData = {
        id: 'test-1',
        name: 'Test Material',
        category: 'steel',
        costPerMeter: 10.50,
        createdAt: new Date().toISOString(),
      };

      await storageManager.writeFile('test-material.json', testData);
      setTestResult('✅ Test file written successfully!');
      
      // Refresh file list
      const fileList = await storageManager.listFiles();
      setFiles(fileList);
    } catch (error) {
      setTestResult(`❌ Write test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRead = async () => {
    if (!storageManager.hasFolderSync()) {
      setTestResult('❌ No folder selected');
      return;
    }

    setIsLoading(true);
    setTestResult('');

    try {
      const data = await storageManager.readFile('test-material.json');
      if (data) {
        setTestResult(`✅ Read test successful! Data: ${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResult('⚠️ Test file not found');
      }
    } catch (error) {
      setTestResult(`❌ Read test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTest = async () => {
    if (!storageManager.hasFolderSync()) {
      setTestResult('❌ No folder selected');
      return;
    }

    setIsLoading(true);
    setTestResult('');

    try {
      await storageManager.deleteFile('test-material.json');
      setTestResult('✅ Test file deleted successfully!');
      
      // Refresh file list
      const fileList = await storageManager.listFiles();
      setFiles(fileList);
    } catch (error) {
      setTestResult(`❌ Delete test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">File System Access API Test</h2>
        
        {/* Storage Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Storage Information</h3>
          {storageInfo ? (
            <div className="space-y-2 text-sm">
              <div><strong>Type:</strong> {storageInfo.type}</div>
              <div><strong>Location:</strong> {storageInfo.location}</div>
              <div><strong>Available:</strong> {storageInfo.available ? '✅ Yes' : '❌ No'}</div>
              <div><strong>Can Write:</strong> {storageInfo.canWrite ? '✅ Yes' : '❌ No'}</div>
              {storageInfo.estimatedSize && (
                <div><strong>Size:</strong> {Math.round(storageInfo.estimatedSize / 1024)} KB</div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">Loading storage info...</div>
          )}
        </div>

        {/* Browser Support Check */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Browser Support</h3>
          {!isClient ? (
            <div className="text-gray-500 text-sm">Loading browser support information...</div>
          ) : (
            <>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>File System Access API:</strong>{' '}
                  {'showDirectoryPicker' in window ? (
                    <span className="text-green-600">✅ Supported</span>
                  ) : (
                    <span className="text-red-600">❌ Not Supported</span>
                  )}
                </div>
                <div>
                  <strong>LocalStorage:</strong>{' '}
                  {typeof Storage !== 'undefined' ? (
                    <span className="text-green-600">✅ Supported</span>
                  ) : (
                    <span className="text-red-600">❌ Not Supported</span>
                  )}
                </div>
              </div>
              
              {!('showDirectoryPicker' in window) && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <strong>Note:</strong> File System Access API requires Chrome 86+ or Edge 86+. 
                  The app will use localStorage fallback in other browsers.
                </div>
              )}
            </>
          )}
        </div>

        {/* Test Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleSelectFolder}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Selecting...' : 'Select Folder'}
            </button>
            
            <button
              onClick={handleTestWrite}
              disabled={isLoading || !storageManager.hasFolderSync()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Writing...' : 'Test Write'}
            </button>
            
            <button
              onClick={handleTestRead}
              disabled={isLoading || !storageManager.hasFolderSync()}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              {isLoading ? 'Reading...' : 'Test Read'}
            </button>
            
            <button
              onClick={handleClearTest}
              disabled={isLoading || !storageManager.hasFolderSync()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? 'Deleting...' : 'Clear Test'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Test Result:</h4>
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Files in Storage:</h4>
            <ul className="space-y-1">
              {files.map(file => (
                <li key={file} className="text-sm font-mono bg-white px-2 py-1 rounded">
                  {file}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}