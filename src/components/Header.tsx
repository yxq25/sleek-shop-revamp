
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';

interface HeaderProps {
  storeName: string;
  storeDescription: string;
  onAdminToggle: () => void;
  isAdminMode: boolean;
}

export const Header = ({ storeName, storeDescription, onAdminToggle, isAdminMode }: HeaderProps) => {
  return (
    <div className="relative">
      <Button
        onClick={onAdminToggle}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="sm"
      >
        <UserCog className="w-4 h-4 mr-2" />
        {isAdminMode ? 'Salir Admin' : 'Administrador'}
      </Button>
      
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {storeName}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            {storeDescription}
          </p>
        </div>
      </div>
    </div>
  );
};
