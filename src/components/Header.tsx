
import { Button } from '@/components/ui/button';
import { UserCog, Menu, Search } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface HeaderProps {
  storeName: string;
  storeDescription: string;
  onAdminToggle: () => void;
  isAdminMode: boolean;
}

export const Header = ({ storeName, storeDescription, onAdminToggle, isAdminMode }: HeaderProps) => {
  return (
    <div className="google-font">
      {/* Admin button - solo visible cuando NO está en modo admin */}
      {!isAdminMode && (
        <Button
          onClick={onAdminToggle}
          className="fixed bottom-4 right-4 z-50 btn-google-secondary shadow-lg"
          size="sm"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Admin
        </Button>
      )}
      
      {/* Google-style header */}
      <div className="google-header">
        <div className="google-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo y nombre */}
            <div className="flex items-center space-x-4">
              <Logo size="sm" />
              <div className="hidden md:block">
                <h1 className="text-xl font-medium text-gray-900">{storeName}</h1>
              </div>
            </div>
            
            {/* Navegación central */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#productos" className="text-gray-700 hover:text-google-blue transition-colors">
                Productos
              </a>
              <a href="#colecciones" className="text-gray-700 hover:text-google-blue transition-colors">
                Colecciones
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-google-blue transition-colors">
                Contacto
              </a>
            </div>

            {/* Iconos de acción */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero section inspirado en Google */}
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="google-section text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo grande centrado */}
            <div className="mb-8">
              <Logo size="xl" className="mx-auto animate-gentle-scale" />
            </div>
            
            {/* Título principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-6 text-balance">
              {storeName}
            </h1>
            
            {/* Descripción */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto text-balance">
              {storeDescription}
            </p>
            
            {/* CTA buttons estilo Google */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="btn-google-primary">
                Ver Productos
              </Button>
              <Button className="btn-google-secondary">
                Explorar Colecciones
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
