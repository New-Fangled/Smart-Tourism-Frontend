import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { AdvancedSearchBar } from './AdvancedSearchBar';

const mountainImages = [
  "https://images.unsplash.com/photo-1629184950099-3eb7993b5f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoaW1hbGF5YXMlMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTc2Nzc2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1630694676528-bdbcfdbf655f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWRha2glMjBtb3VudGFpbnMlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU3Njc4NDgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1713951579234-3bfee80f3d9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXNobWlyJTIwbW91bnRhaW5zJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzY3ODQ4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1709624249023-727c2b65162d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1dHRhcmFraGFuZCUyMHBlYWtzJTIwaGltYWxheWF8ZW58MXx8fHwxNzU3Njc4NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1706696435436-200ba23cda35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW1hY2hhbCUyMHByYWRlc2glMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3Njc4NzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1660566532762-17535b1028a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWtraW0lMjBtb3VudGFpbiUyMHBlYWtzfGVufDF8fHx8MTc1NzY3ODc0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

export function HeroSection() {
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const { theme } = useTheme();
  
  const dynamicTexts = [
    "Discover India's Hidden Gems...",
    "Explore Mystical Himalayas...",
    "Journey Through Ancient Valleys...",
    "Experience Sacred Mountains...",
    "Uncover Secret Destinations...",
  ];

  // Dynamic text effect
  useEffect(() => {
    let index = 0;
    const currentText = dynamicTexts[currentTextIndex];
    
    const timer = setInterval(() => {
      if (index <= currentText.length) {
        setDisplayText(currentText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        // Wait 2 seconds before starting next text
        setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
        }, 2000);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [currentTextIndex]);

  // Dynamic background images changing every 2 seconds
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % mountainImages.length);
    }, 2000);

    return () => clearInterval(imageTimer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Dynamic Background Mountain Images */}
      <div className="absolute inset-0 z-0">
        {mountainImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          >
            <div 
              className="h-[120%] w-full bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${image})` 
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white pt-24">
        {/* Zooming TraviGo Title */}
        <motion.h1
          initial={{ scale: 3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 2.5, 
            ease: "easeOut",
            delay: 0.5 
          }}
          className="mb-8 text-8xl font-bold tracking-wider text-white"
          style={{ 
            fontFamily: 'Playfair Display, Georgia, serif'
          }}
        >
          TraviGo
        </motion.h1>

        {/* Dynamic Typewriter Effect Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-2xl font-light tracking-wide mb-16"
          style={{ fontFamily: 'Crimson Text, Georgia, serif' }}
        >
          <span className="inline-block min-h-[2rem]">
            {displayText}
            <span className="animate-pulse">|</span>
          </span>
        </motion.div>

        {/* Advanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="w-full max-w-5xl px-4"
        >
          <AdvancedSearchBar 
            onSearch={(filters) => {
              console.log('Search filters:', filters);
              // Handle search logic here
            }}
          />
        </motion.div>

        {/* CTA Buttons with proper spacing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <motion.button
            className={`px-8 py-4 rounded-full ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500'
                : 'bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600'
            } text-white font-semibold shadow-2xl transform transition-all duration-300`}
            style={{ fontFamily: 'Crimson Text, Georgia, serif' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Destinations
          </motion.button>
          
          <motion.button
            className={`px-8 py-4 rounded-full border-2 ${
              theme === 'dark'
                ? 'border-orange-400 text-orange-100 hover:bg-orange-400/20'
                : 'border-white text-white hover:bg-white/20'
            } font-semibold backdrop-blur-sm transition-all duration-300`}
            style={{ fontFamily: 'Crimson Text, Georgia, serif' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Travel Guide
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
          className="absolute bottom-8 flex flex-col items-center"
        >
          <p className="mb-4 text-sm uppercase tracking-widest" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
            Scroll to Explore India
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`h-6 w-4 rounded-full border-2 ${
              theme === 'dark' ? 'border-orange-200' : 'border-white'
            }`}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`mx-auto mt-1 h-2 w-1 rounded-full ${
                theme === 'dark' ? 'bg-orange-200' : 'bg-white'
              }`}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}