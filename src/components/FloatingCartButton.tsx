
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { CartItem } from '@/types/store';

interface FloatingCartButtonProps {
  cart: CartItem[];
  onClick: () => void;
}

export const FloatingCartButton = ({ cart, onClick }: FloatingCartButtonProps) => {
  const scrollToCart = () => {
    const cartElement = document.getElementById('cart-section');
    if (cartElement) {
      cartElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onClick();
  };

  return (
    <Button
      onClick={scrollToCart}
      className="fixed top-20 right-4 z-50 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black shadow-2xl h-14 w-14 rounded-full p-0 transition-all duration-300 hover:scale-110 border-2 border-yellow-300"
      size="icon"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-3 -right-3 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse bg-red-500"
          >
            {cart.length}
          </Badge>
        )}
      </div>
    </Button>
  );
};
