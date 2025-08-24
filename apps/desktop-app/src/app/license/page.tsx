import { AppLayout } from '@/components/layout/AppLayout';
import { Shield, Key, AlertTriangle, CheckCircle } from 'lucide-react';

export default function LicensePage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">License Management</h1>

        <div className="space-y-6">
          {/* License Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">License Status</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mr-4" />
                <div>
                  <h3 className="font-medium text-yellow-900">No License Activated</h3>
                  <p className="text-yellow-700 mt-1">
                    Enter your license key to unlock all features
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* License Entry */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <Key className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Enter License Key</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Key
                </label>
                <input
                  type="text"
                  placeholder="Enter your license key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter the email used for purchase"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Activate License
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Feature Access</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-900">Materials Management</span>
                  <span className="ml-auto text-sm text-gray-500">Always Available</span>
                </div>
                
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-gray-300 rounded-full mr-3" />
                  <span className="text-gray-500">Quote Generation</span>
                  <span className="ml-auto text-sm text-red-500">License Required</span>
                </div>
                
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-gray-300 rounded-full mr-3" />
                  <span className="text-gray-500">Job Management</span>
                  <span className="ml-auto text-sm text-red-500">License Required</span>
                </div>
                
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-gray-300 rounded-full mr-3" />
                  <span className="text-gray-500">Cutting Optimization</span>
                  <span className="ml-auto text-sm text-red-500">License Required</span>
                </div>
                
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-gray-300 rounded-full mr-3" />
                  <span className="text-gray-500">PDF Export</span>
                  <span className="ml-auto text-sm text-red-500">License Required</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase License */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Don't have a license yet?
              </h3>
              <p className="text-blue-700 mb-4">
                Purchase an annual license to unlock all features and get priority support.
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Purchase License - $99/year
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}