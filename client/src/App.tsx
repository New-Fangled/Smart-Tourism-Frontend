import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import EnhancedDestinationsSection from './components/EnhancedDestinationsSection';
import { TravelNews } from './components/TravelNews';
import { ParallaxSection } from './components/ParallaxSection';

export default function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-background text-foreground" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
        {/* Navigation */}
        <Navbar />
        
        {/* Theme toggle button */}
        <ThemeToggle />
        
        {/* Hero Section with Indian mountain background and enhanced effects */}
        <HeroSection />
        
        {/* Enhanced Destinations Section with advanced filtering */}
        <EnhancedDestinationsSection />
        
        {/* Travel News and Crowd Updates */}
        <TravelNews />
        
        {/* Footer Section */}
        <ParallaxSection speed={0.1}>
          <section className="bg-gradient-to-b from-background to-orange-950/10 dark:to-orange-950/20 py-20 border-t border-border">
            <div className="mx-auto max-w-4xl px-8 text-center">
              <h2 className="mb-6 text-4xl text-foreground" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                Start Your Indian Adventure
              </h2>
              <p className="mb-8 text-lg text-muted-foreground" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
                Discover the incredible diversity of India with our expert guides and authentic local experiences.
              </p>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <div className="rounded-xl bg-card/90 backdrop-blur-sm border border-border p-8 max-w-md shadow-xl">
                  <div className="mb-4">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🏔️</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
                    Ready to explore incredible India?
                  </p>
                  <p className="text-foreground font-medium" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                    Contact us to plan your authentic Indian journey
                  </p>
                  <button className="mt-4 w-full px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition-all duration-300">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </section>
        </ParallaxSection>
      </div>
    </ThemeProvider>
  );
}