
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

export const LoginModal = ({ open, onClose, onLogin }: LoginModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const success = onLogin(password);
    if (success) {
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Acceso de Administrador
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleLogin}>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
