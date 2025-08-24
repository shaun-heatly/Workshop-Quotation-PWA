import { AppLayout } from '@/components/layout/AppLayout';
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';

export default function HelpPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Help & Support</h1>

        <div className="space-y-6">
          {/* Quick Help */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Quick Help</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-medium text-gray-900 mb-2">Getting Started</h3>
                  <p className="text-sm text-gray-600">
                    Learn the basics of setting up your workshop data and creating your first quote
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-medium text-gray-900 mb-2">Materials Management</h3>
                  <p className="text-sm text-gray-600">
                    How to add, edit, and organize your material database with pricing
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-medium text-gray-900 mb-2">Quote Builder</h3>
                  <p className="text-sm text-gray-600">
                    Step-by-step guide to creating professional quotes with cutting lists
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <h3 className="font-medium text-gray-900 mb-2">Cutting Optimization</h3>
                  <p className="text-sm text-gray-600">
                    Understanding the cutting optimizer and how to minimize material waste
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="p-6 space-y-4">
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 group-open:text-blue-600">
                  How do I backup my data?
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  Your data is stored in the folder you select. Simply copy this folder to your backup location 
                  (OneDrive, Google Drive, etc.) to keep your data safe.
                </p>
              </details>
              
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 group-open:text-blue-600">
                  Can I use this on multiple computers?
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  Yes! Your license allows installation on multiple devices. Store your data folder in a 
                  cloud service to sync between computers.
                </p>
              </details>
              
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 group-open:text-blue-600">
                  What browsers are supported?
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  For best performance, use Chrome or Edge (full file system access). Firefox and Safari 
                  are supported with localStorage fallback.
                </p>
              </details>
              
              <details className="group">
                <summary className="cursor-pointer font-medium text-gray-900 group-open:text-blue-600">
                  How does the cutting optimizer work?
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  The optimizer uses a longest-first algorithm to arrange cuts on stock lengths, 
                  accounting for blade kerf and minimizing waste.
                </p>
              </details>
            </div>
          </div>

          {/* Support Options */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Need More Help?</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <Mail className="h-8 w-8 text-blue-600 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email Support</h3>
                    <p className="text-sm text-gray-600">support@workshopmanager.com</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <Book className="h-8 w-8 text-green-600 mr-4" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Documentation</h3>
                    <p className="text-sm text-gray-600">Complete user guide</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Workshop Quotation Manager</h3>
              <p className="text-sm text-gray-600">Version 1.0.0</p>
              <p className="text-sm text-gray-600 mt-2">
                Built with Next.js, TypeScript, and Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}