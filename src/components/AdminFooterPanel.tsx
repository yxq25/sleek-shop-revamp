
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserCog, LogOut } from 'lucide-react';

interface AdminFooterPanelProps {
  isAdminMode: boolean;
  onAdminToggle: () => void;
}

export const AdminFooterPanel = ({ isAdminMode, onAdminToggle }: AdminFooterPanelProps) => {
  if (!isAdminMode) return null;

  return (
    <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-yellow-300">
      <div className="p-4">
        <Button
          onClick={onAdminToggle}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Salir del Modo Administrador
        </Button>
      </div>
    </Card>
  );
};
