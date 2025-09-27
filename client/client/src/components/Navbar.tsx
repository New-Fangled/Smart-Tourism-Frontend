import { Link } from "react-router-dom";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Home, Calendar, LogIn, MapPin, Search } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';
import { Logo } from './Logo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const navItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: MapPin, label: 'Destinations', href: '#destinations' },
    { icon: Calendar, label: 'Bookings', href: '#bookings' },
    { icon: Search, label: 'Search', href: '#search' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="md" animated />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-1 text-foreground hover:text-orange-600 transition-colors duration-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <item.icon className="w-4 h-4" />
                <span style={{ fontFamily: 'Georgia, serif' }}>{item.label}</span>
              </motion.a>
            ))}
            <Link to="/login" className="text-foreground hover:text-orange-600 transition-colors duration-200" style={{ marginRight: "1rem" }}>Login</Link>
            <Link to="/register" className="text-foreground hover:text-orange-600 transition-colors duration-200" style={{ marginRight: "1rem" }}>Register</Link>
            <Link to="/booking" className="text-foreground hover:text-orange-600 transition-colors duration-200">Book Now</Link>
            
            <motion.button
              className={`px-6 py-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500' 
                  : 'bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600'
              } text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl`}
              style={{ fontFamily: 'Georgia, serif' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Plan Trip
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <nav>
                <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
                <Link to="/register">Register</Link>
              </nav>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-foreground hover:text-orange-600 hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span style={{ fontFamily: 'Georgia, serif' }}>{item.label}</span>
                </a>
              ))}
              <Link to="/login" className="block px-3 py-2 text-foreground hover:text-orange-600 hover:bg-accent rounded-md transition-colors" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block px-3 py-2 text-foreground hover:text-orange-600 hover:bg-accent rounded-md transition-colors" onClick={() => setIsOpen(false)}>Register</Link>
              
              <motion.button
                className={`w-full mt-4 px-6 py-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600' 
                    : 'bg-gradient-to-r from-orange-600 to-red-700'
                } text-white font-medium`}
                style={{ fontFamily: 'Georgia, serif' }}
                whileTap={{ scale: 0.95 }}
              >
                Plan Trip
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}