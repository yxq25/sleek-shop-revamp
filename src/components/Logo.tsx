
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img
        src="/lovable-uploads/1a005592-bd22-49c2-b8c5-d1751bc70531.png"
        alt="¿Por qué? Logo"
        className={cn(
          'object-contain drop-shadow-lg transition-transform hover:scale-105',
          sizeClasses[size]
        )}
      />
    </div>
  );
};
