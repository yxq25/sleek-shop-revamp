
import { useState } from 'react';
import { CartItem } from '@/types/store';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    getTotal,
    clearCart
  };
};
