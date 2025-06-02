
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';
import { Product } from '@/types/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const availableStock = product.stock || 0;
    
    if (quantity > availableStock) {
      alert('Su compra excede la cantidad de unidades disponibles');
      return;
    }
    
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    const maxQuantity = product.stock || 0;
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const isOutOfStock = (product.stock || 0) === 0;

  return (
    <Card className="group bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-300 text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <span className="text-sm">Sin imagen</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-gray-900 text-lg leading-tight">
              {product.name}
            </h3>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                {product.age}
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                {product.collection}
              </Badge>
            </div>
            
            {product.skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.skills.slice(0, 2).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {skill}
                  </Badge>
                ))}
                {product.skills.length > 2 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    +{product.skills.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-3">
            {product.description}
          </p>

          {!isOutOfStock && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-gray-700">Cantidad:</span>
              <div className="flex items-center border border-gray-200 rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0 hover:bg-gray-50"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.stock || 0)}
                  className="h-8 w-8 p-0 hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
