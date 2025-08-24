'use client';

import { useState, useEffect } from 'react';
import { getMaterialsService, getSettingsService, type Material, type AppSettings } from '@/lib/data';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  data?: any;
}

export default function DataTest() {
  const [isClient, setIsClient] = useState(false);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateTestResult = (name: string, result: Omit<TestResult, 'name'>) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, ...result } : test
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    
    const testList: TestResult[] = [
      { name: 'Settings: Load defaults', status: 'pending' },
      { name: 'Settings: Update workshop name', status: 'pending' },
      { name: 'Settings: Get specific setting', status: 'pending' },
      { name: 'Materials: Create new material', status: 'pending' },
      { name: 'Materials: Get all materials', status: 'pending' },
      { name: 'Materials: Update material cost', status: 'pending' },
      { name: 'Materials: Search by name', status: 'pending' },
      { name: 'Materials: Filter by category', status: 'pending' },
      { name: 'Materials: Delete material', status: 'pending' },
    ];
    
    setTests(testList);

    const materialsService = getMaterialsService();
    const settingsService = getSettingsService();

    try {
      // Test Settings
      updateTestResult('Settings: Load defaults', { status: 'pending' });
      const defaultSettings = await settingsService.getSettings();
      updateTestResult('Settings: Load defaults', { 
        status: 'success', 
        message: `Loaded: ${defaultSettings.workshopName}`,
        data: defaultSettings
      });

      updateTestResult('Settings: Update workshop name', { status: 'pending' });
      const updatedSettings = await settingsService.updateSettings({ 
        workshopName: 'Test Workshop' 
      });
      updateTestResult('Settings: Update workshop name', { 
        status: 'success', 
        message: `Updated to: ${updatedSettings.workshopName}`,
        data: updatedSettings
      });

      updateTestResult('Settings: Get specific setting', { status: 'pending' });
      const currency = await settingsService.getSetting('currency');
      updateTestResult('Settings: Get specific setting', { 
        status: 'success', 
        message: `Currency: ${currency}`,
        data: currency
      });

      // Test Materials
      updateTestResult('Materials: Create new material', { status: 'pending' });
      const newMaterial = await materialsService.create({
        category: 'steel',
        name: 'Test Steel Rod',
        description: 'A test steel rod material',
        specifications: {
          thickness: 10,
          width: 50,
          weight: 2.5
        },
        costPerMeter: 15.50
      });
      updateTestResult('Materials: Create new material', { 
        status: 'success', 
        message: `Created: ${newMaterial.name} (ID: ${newMaterial.id})`,
        data: newMaterial
      });

      updateTestResult('Materials: Get all materials', { status: 'pending' });
      const allMaterials = await materialsService.getAll();
      updateTestResult('Materials: Get all materials', { 
        status: 'success', 
        message: `Found ${allMaterials.length} materials`,
        data: allMaterials
      });

      updateTestResult('Materials: Update material cost', { status: 'pending' });
      const updatedMaterial = await materialsService.updateCost(newMaterial.id, 18.75);
      updateTestResult('Materials: Update material cost', { 
        status: 'success', 
        message: `Updated cost to: $${updatedMaterial?.costPerMeter}`,
        data: updatedMaterial
      });

      updateTestResult('Materials: Search by name', { status: 'pending' });
      const searchResults = await materialsService.searchByName('Test');
      updateTestResult('Materials: Search by name', { 
        status: 'success', 
        message: `Found ${searchResults.length} materials matching 'Test'`,
        data: searchResults
      });

      updateTestResult('Materials: Filter by category', { status: 'pending' });
      const steelMaterials = await materialsService.getByCategory('steel');
      updateTestResult('Materials: Filter by category', { 
        status: 'success', 
        message: `Found ${steelMaterials.length} steel materials`,
        data: steelMaterials
      });

      updateTestResult('Materials: Delete material', { status: 'pending' });
      const deleteResult = await materialsService.delete(newMaterial.id);
      updateTestResult('Materials: Delete material', { 
        status: deleteResult ? 'success' : 'error', 
        message: deleteResult ? 'Material deleted successfully' : 'Failed to delete material'
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Test failed:', error);
      
      // Update any pending tests to error
      setTests(prev => prev.map(test => 
        test.status === 'pending' ? { ...test, status: 'error' as const, message: errorMessage } : test
      ));
    } finally {
      setIsRunning(false);
    }
  };

  const clearData = async () => {
    try {
      const materialsService = getMaterialsService();
      const settingsService = getSettingsService();
      
      await materialsService.deleteAll();
      await settingsService.resetSettings();
      settingsService.clearCache();
      
      alert('All test data cleared successfully');
    } catch (error) {
      console.error('Failed to clear data:', error);
      alert('Failed to clear test data');
    }
  };

  if (!isClient) {
    return <div className="p-4">Loading data tests...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Data Layer Tests</h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>
        
        <button
          onClick={clearData}
          disabled={isRunning}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
        >
          Clear Test Data
        </button>
      </div>

      <div className="space-y-3">
        {tests.map((test) => (
          <div
            key={test.name}
            className={`p-4 border rounded-lg ${
              test.status === 'success' ? 'border-green-300 bg-green-50' :
              test.status === 'error' ? 'border-red-300 bg-red-50' :
              'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{test.name}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                test.status === 'success' ? 'bg-green-100 text-green-800' :
                test.status === 'error' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {test.status}
              </span>
            </div>
            
            {test.message && (
              <div className="mt-2 text-sm text-gray-600">
                {test.message}
              </div>
            )}
            
            {test.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600">
                  View Data
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(test.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Click "Run All Tests" to start testing the data layer
        </div>
      )}
    </div>
  );
}