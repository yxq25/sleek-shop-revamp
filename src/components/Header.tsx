
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
          className="fixed bottom-4 right-4 z-50 btn-secondary shadow-xl"
          size="sm"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Administrador
        </Button>
      )}
      
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Logo centrado con marco circular */}
            <Logo size="xl" />
            
            {/* Título centrado */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent leading-tight">
                {storeName}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
                {storeDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
