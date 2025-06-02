
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
    xl: 'h-24 w-24'
  };

  const frameSizes = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-5'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('logo-frame animate-glow', frameSizes[size])}>
        <img
          src="/lovable-uploads/1a005592-bd22-49c2-b8c5-d1751bc70531.png"
          alt="¿Por qué? Logo"
          className={cn(
            'object-contain transition-transform duration-300',
            sizeClasses[size]
          )}
        />
      </div>
    </div>
  );
};
