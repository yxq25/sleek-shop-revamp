
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

    let message = `🎯 *¡NUEVA ORDEN DE COMPRA!* 🎯\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `🏪 *Tienda:* ${storeConfig.name}\n`;
    message += `💡 *"Desarrollando mentes brillantes, un juguete a la vez"*\n\n`;
    message += `📦 *PRODUCTOS SELECCIONADOS:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. 🧸 ${item.name}\n`;
      message += `   💰 $${item.price.toFixed(2)}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💎 *TOTAL A PAGAR: $${total.toFixed(2)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `📞 *INFORMACIÓN DE CONTACTO:*\n`;
    message += `📧 Email: ${storeConfig.email}\n`;
    message += `📍 Dirección: ${storeConfig.address}\n\n`;
    
    message += `💳 *MÉTODOS DE PAGO DISPONIBLES:*\n`;
    storeConfig.paymentMethods.forEach((method, index) => {
      message += `${index + 1}. ✅ ${method}\n`;
    });
    
    message += `\n🚚 *ZONAS DE DELIVERY DISPONIBLES:*\n`;
    storeConfig.deliveryZones.forEach((zone, index) => {
      message += `${index + 1}. 📍 ${zone}\n`;
    });
    
    message += `\n━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📝 *POR FAVOR, COMPLETA ESTA INFORMACIÓN:*\n\n`;
    message += `👤 *Nombre completo:*\n`;
    message += `📱 *Teléfono de contacto:*\n`;
    message += `🏠 *Dirección completa para entrega:*\n`;
    message += `💳 *Método de pago elegido:*\n`;
    message += `⏰ *Horario preferido para entrega:*\n`;
    message += `📝 *Comentarios adicionales:*\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `¡Gracias por confiar en nosotros! 🌟\n`;
    message += `Responderemos tu pedido a la brevedad 🚀`;

    const whatsappUrl = `https://wa.me/${storeConfig.whatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card id="cart-section" className="w-full max-w-sm bg-white/95 backdrop-blur-sm shadow-xl border-2 border-yellow-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-yellow-600" />
            <span className="text-gray-800">Mi Carrito</span>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            {cart.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-64 overflow-y-auto space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🛒</div>
              <p className="text-gray-500">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400">¡Agrega algunos juguetes increíbles!</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-yellow-700 font-bold">${item.price.toFixed(2)}</p>
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
        
        <div className="border-t border-yellow-200 pt-4">
          <div className="text-center mb-4">
            <p className="text-lg font-bold text-gray-800">Total: ${total.toFixed(2)}</p>
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
