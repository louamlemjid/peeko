import Link from 'next/link';
import { Edit, Plus } from 'lucide-react';


const DashboardServicePage = async() => {
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 w-full max-w-2xl">
        
        <div className="grid grid-cols-2 gap-6">
          <Link href="/dashboard/service/editService" className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md shadow-md p-6 flex items-center space-x-4 transition-all duration-200">
            <div className="p-3 bg-blue-200 text-black rounded">
              <Edit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Modifier un service</h3>
              <p className="text-sm text-gray-600">Modifier un service existant.</p>
            </div>
          </Link>
          <Link href="/dashboard/service/createService" className="bg-green-100 hover:bg-green-200 text-green-700 rounded-md shadow-md p-6 flex items-center space-x-4 transition-all duration-200">
            <div className="p-3 bg-green-200 text-green-700 rounded">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Créer un nouveau service</h3>
              <p className="text-sm text-gray-600">Ajouter un nouveau service.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardServicePage;