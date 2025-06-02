
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Brain } from 'lucide-react';
import { Product } from '@/types/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="group card-hover bg-white border-0 shadow-lg overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl">🧸</div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 border-0 shadow-md">
            {product.collection}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{product.age}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Brain className="w-4 h-4 mt-1 flex-shrink-0 text-yellow-600" />
            <div>
              <div className="flex flex-wrap gap-1">
                {product.skills.slice(0, 2).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                    {skill}
                  </Badge>
                ))}
                {product.skills.length > 2 && (
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                    +{product.skills.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-4 line-clamp-3 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={() => onAddToCart(product)}
          className="w-full btn-primary"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
};
