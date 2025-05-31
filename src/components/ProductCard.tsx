
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Clock, Brain, Package } from 'lucide-react';
import { Product } from '@/types/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg hover:-translate-y-1">
      <div className="aspect-square bg-gradient-to-br from-purple-50 to-blue-50 rounded-t-lg flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl">🧸</div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-purple-700">
            {product.collection}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{product.age}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Brain className="w-4 h-4 mt-1 flex-shrink-0" />
            <div>
              <div className="flex flex-wrap gap-1">
                {product.skills.slice(0, 2).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {product.skills.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.skills.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-4 line-clamp-3">
          {product.description}
        </p>
        
        <div className="mt-4">
          <span className="text-2xl font-bold text-purple-600">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
};
