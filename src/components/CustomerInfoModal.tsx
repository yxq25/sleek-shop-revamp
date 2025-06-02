
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerInfo, StoreConfig } from '@/types/store';

interface CustomerInfoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (customerInfo: CustomerInfo) => void;
  storeConfig: StoreConfig;
}

export const CustomerInfoModal = ({ open, onClose, onSubmit, storeConfig }: CustomerInfoModalProps) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: '',
    preferredTime: '',
    comments: ''
  });

  const handleSubmit = () => {
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.paymentMethod) {
      alert('Por favor complete los campos obligatorios');
      return;
    }
    onSubmit(customerInfo);
    onClose();
    setCustomerInfo({
      fullName: '',
      phone: '',
      address: '',
      paymentMethod: '',
      preferredTime: '',
      comments: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-gray-900">
            Información de Entrega
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Nombre completo *
            </Label>
            <Input
              id="fullName"
              value={customerInfo.fullName}
              onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Teléfono de contacto *
            </Label>
            <Input
              id="phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Dirección completa para entrega *
            </Label>
            <Textarea
              id="address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              className="border-gray-200 focus:border-gray-400 min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Método de pago elegido *
            </Label>
            <Select value={customerInfo.paymentMethod} onValueChange={(value) => setCustomerInfo({...customerInfo, paymentMethod: value})}>
              <SelectTrigger className="border-gray-200 focus:border-gray-400">
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                {storeConfig.paymentMethods.map((method, index) => (
                  <SelectItem key={index} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredTime" className="text-sm font-medium text-gray-700">
              Horario preferido para entrega
            </Label>
            <Input
              id="preferredTime"
              value={customerInfo.preferredTime}
              onChange={(e) => setCustomerInfo({...customerInfo, preferredTime: e.target.value})}
              placeholder="Ej: Mañana, tarde, fin de semana"
              className="border-gray-200 focus:border-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium text-gray-700">
              Comentarios adicionales
            </Label>
            <Textarea
              id="comments"
              value={customerInfo.comments}
              onChange={(e) => setCustomerInfo({...customerInfo, comments: e.target.value})}
              placeholder="Cualquier información adicional..."
              className="border-gray-200 focus:border-gray-400 min-h-[60px]"
            />
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
          >
            Enviar Pedido
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
