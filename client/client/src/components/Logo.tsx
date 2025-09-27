import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function Logo({ className = "", size = 'md', animated = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl', 
    lg: 'text-4xl'
  };

  const LogoContent = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Mountain Icon */}
      <div className="relative">
        <svg
          viewBox="0 0 32 32"
          className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'} text-orange-500`}
          fill="currentColor"
        >
          {/* Back mountain */}
          <path d="M2 24L8 12L14 20L18 14L26 24H2Z" className="text-orange-600" fill="currentColor" />
          {/* Front mountain */}
          <path d="M6 28L12 16L18 24L22 18L30 28H6Z" className="text-orange-500" fill="currentColor" />
          {/* Peak snow caps */}
          <path d="M8 12L10 10L12 12L10 14Z" className="text-white" fill="currentColor" />
          <path d="M18 14L20 12L22 14L20 16Z" className="text-white" fill="currentColor" />
        </svg>
        {/* Sun/compass accent */}
        <div className={`absolute -top-1 -right-1 ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-yellow-400 rounded-full`} />
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span 
          className={`${sizeClasses[size]} font-bold tracking-wider bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent`}
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          TraviGo
        </span>
        {size !== 'sm' && (
          <span 
            className="text-xs text-muted-foreground tracking-widest -mt-1"
            style={{ fontFamily: 'Crimson Text, Georgia, serif' }}
          >
            EXPLORE INDIA
          </span>
        )}
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <LogoContent />
      </motion.div>
    );
  }

  return <LogoContent />;
}