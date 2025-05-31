
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface HeaderProps {
  storeName: string;
  storeDescription: string;
  onAdminToggle: () => void;
  isAdminMode: boolean;
}

export const Header = ({ storeName, storeDescription, onAdminToggle, isAdminMode }: HeaderProps) => {
  return (
    <div className="relative">
      {/* Solo mostrar botón de admin si NO está en modo admin */}
      {!isAdminMode && (
        <Button
          onClick={onAdminToggle}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl"
          size="sm"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Administrador
        </Button>
      )}
      
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-6 mb-6">
            <Logo size="lg" />
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {storeName}
              </h1>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto text-center">
            {storeDescription}
          </p>
        </div>
      </div>
    </div>
  );
};
