
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

  if (cart.length === 0) return null;

  return (
    <Button
      onClick={scrollToCart}
      className="fixed top-20 right-4 z-40 btn-google-yellow shadow-lg h-12 w-12 rounded-full p-0 transition-all duration-300 hover:scale-105 google-font"
      size="icon"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-red-500 text-white"
        >
          {cart.length}
        </Badge>
      </div>
    </Button>
  );
};
