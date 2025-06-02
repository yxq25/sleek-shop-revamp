
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
    <Card className="google-card google-hover animate-gentle-fade-in google-font group">
      <CardContent className="p-0">
        {/* Imagen del producto */}
        <div className="aspect-square bg-gray-50 rounded-t-lg overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🧸</span>
                </div>
                <span className="text-sm">Sin imagen</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Badges estilo Google */}
          <div className="flex flex-wrap gap-2">
            <Badge className="google-badge-blue text-xs">{product.age}</Badge>
            <Badge className="google-badge text-xs">{product.collection}</Badge>
          </div>

          {/* Nombre del producto */}
          <div>
            <h3 className="font-medium text-gray-900 text-lg leading-tight line-clamp-2 mb-2">
              {product.name}
            </h3>
            
            {/* Precio estilo Google */}
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-normal text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          {/* Habilidades */}
          {product.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.skills.slice(0, 2).map((skill, index) => (
                <Badge key={index} className="google-badge text-xs">
                  {skill}
                </Badge>
              ))}
              {product.skills.length > 2 && (
                <Badge className="google-badge text-xs">
                  +{product.skills.length - 2} más
                </Badge>
              )}
            </div>
          )}

          {/* Controles de cantidad */}
          {!isOutOfStock && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-gray-700">Cantidad:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-l-lg"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-12 text-center text-sm font-medium border-l border-r border-gray-300 h-8 flex items-center justify-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.stock || 0)}
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-r-lg"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Botón de agregar al carrito estilo Google */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full ${isOutOfStock ? 'btn-google-secondary opacity-50' : 'btn-google-primary'}`}
          >
            {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
