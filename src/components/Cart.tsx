
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X, MessageSquare } from 'lucide-react';
import { CartItem, StoreConfig } from '@/types/store';

interface CartProps {
  cart: CartItem[];
  total: number;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
  storeConfig: StoreConfig;
}

export const Cart = ({ cart, total, onRemoveItem, onCheckout, storeConfig }: CartProps) => {
  const checkout = () => {
    if (cart.length === 0) return;

    let message = `🛒 *NUEVA ORDEN DE COMPRA*\n\n`;
    message += `*Tienda:* ${storeConfig.name}\n\n`;
    message += `*PRODUCTOS:*\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - $${item.price.toFixed(2)}\n`;
    });
    
    message += `\n*TOTAL: $${total.toFixed(2)}*\n\n`;
    message += `*INFORMACIÓN DE CONTACTO:*\n`;
    message += `📧 Email: ${storeConfig.email}\n`;
    message += `📍 Dirección: ${storeConfig.address}\n\n`;
    message += `*MÉTODOS DE PAGO DISPONIBLES:*\n`;
    storeConfig.paymentMethods.forEach(method => {
      message += `• ${method}\n`;
    });
    message += `\n*ZONAS DE DELIVERY:*\n`;
    storeConfig.deliveryZones.forEach(zone => {
      message += `• ${zone}\n`;
    });
    message += `\n*Por favor indique:*\n`;
    message += `• Método de pago preferido\n`;
    message += `• Dirección de entrega\n`;
    message += `• Horario de preferencia\n`;
    message += `• Cualquier comentario adicional`;

    const whatsappUrl = `https://wa.me/${storeConfig.whatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="w-full max-w-sm bg-white/95 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {cart.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-64 overflow-y-auto space-y-2">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Carrito vacío</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-purple-600 font-bold">${item.price.toFixed(2)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        
        <div className="border-t pt-4">
          <div className="text-center mb-4">
            <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
          </div>
          <Button
            onClick={checkout}
            disabled={cart.length === 0}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Comprar por WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
