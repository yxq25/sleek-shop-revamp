
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, StoreConfig, CustomerInfo } from '@/types/store';
import { CustomerInfoModal } from '@/components/CustomerInfoModal';

interface CartProps {
  cart: CartItem[];
  total: number;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  storeConfig: StoreConfig;
}

export const Cart = ({ cart, total, onUpdateQuantity, onRemoveItem, storeConfig }: CartProps) => {
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const handleCheckout = (customerInfo: CustomerInfo) => {
    let message = `🎯 *¡NUEVA ORDEN DE COMPRA!* 🎯\n\n`;
    message += `🏪 *${storeConfig.name}*\n\n`;
    message += `📦 *PRODUCTOS:*\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio unitario: $${item.price.toFixed(2)}\n`;
      message += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `💰 *TOTAL: $${total.toFixed(2)}*\n\n`;
    message += `👤 *INFORMACIÓN DEL CLIENTE:*\n`;
    message += `Nombre: ${customerInfo.fullName}\n`;
    message += `Teléfono: ${customerInfo.phone}\n`;
    message += `Dirección: ${customerInfo.address}\n`;
    message += `Método de pago: ${customerInfo.paymentMethod}\n`;
    
    if (customerInfo.preferredTime) {
      message += `Horario preferido: ${customerInfo.preferredTime}\n`;
    }
    if (customerInfo.comments) {
      message += `Comentarios: ${customerInfo.comments}\n`;
    }

    const whatsappUrl = `https://wa.me/${storeConfig.whatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Card id="cart-section" className="w-full max-w-sm bg-white shadow-sm border border-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg font-medium text-gray-900">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Carrito
            </div>
            <div className="text-sm font-normal text-gray-500">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} artículos
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-64 overflow-y-auto space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400">Agrega productos para comenzar</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(index)}
                      className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">Total: ${total.toFixed(2)}</p>
            </div>
            <Button
              onClick={() => setShowCustomerModal(true)}
              disabled={cart.length === 0}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium"
            >
              Realizar Pedido
            </Button>
          </div>
        </CardContent>
      </Card>

      <CustomerInfoModal
        open={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSubmit={handleCheckout}
        storeConfig={storeConfig}
      />
    </>
  );
};
