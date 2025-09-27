import { motion, useInView } from "framer-motion";
import { useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Users, MapPin } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: "Spiti Valley",
    state: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1671609856557-13a95d395fa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGl0aSUyMHZhbGxleSUyMGhpbWFjaGFsJTIwcHJhZGVzaHxlbnwxfHx8fDE3NTc2Nzc2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    crowdLevel: "Low",
    bestTime: "May-Oct",
    activities: ["Monastery Visits", "High Altitude Trekking", "Photography", "Local Cuisine"],
    cafes: ["Spiti Organic Kitchen", "Sol Cafe", "Rangrik Tant"],
    description: "Cold desert mountain valley with ancient monasteries"
  },
  {
    id: 2,
    name: "Coorg Hills",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1684920332869-49b11a6e8eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29yZyUyMGthcm5hdGFrYSUyMGhpbGxzfGVufDF8fHx8MTc1NzY3NzY4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    crowdLevel: "Medium",
    bestTime: "Oct-Mar",
    activities: ["Coffee Plantation Tours", "Waterfalls", "Wildlife Safari", "River Rafting"],
    cafes: ["Coffee Barn Cafe", "Coorg Cuisine", "Beans N Brews"],
    description: "Scotland of India with coffee plantations and mist-covered hills"
  },
  {
    id: 3,
    name: "Munnar Tea Gardens",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1742286087579-fcaa5ed24c35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdW5uYXIlMjBrZXJhbGElMjB0ZWElMjBnYXJkZW5zfGVufDF8fHx8MTc1NzY3NzY4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    crowdLevel: "High",
    bestTime: "Sep-Mar",
    activities: ["Tea Factory Visits", "Boating", "Trekking", "Spice Gardens"],
    cafes: ["Tea County", "Rapsy Restaurant", "Saravana Bhavan"],
    description: "Rolling hills carpeted with emerald tea plantations"
  },
  {
    id: 4,
    name: "Zanskar Valley",
    state: "Ladakh",
    image: "https://images.unsplash.com/photo-1756535193517-c2e679acc6d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6YW5za2FyJTIwbGFkYWtoJTIwbW91bnRhaW5zfGVufDF8fHx8MTc1NzY3NzY5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    crowdLevel: "Very Low",
    bestTime: "Jun-Sep",
    activities: ["Chadar Trek", "Buddhist Monasteries", "River Rafting", "Stargazing"],
    cafes: ["German Bakery", "Penguin Garden Restaurant", "Zangsti Cafe"],
    description: "Remote Himalayan valley with pristine landscapes"
  },
  {
    id: 5,
    name: "Araku Valley",
    state: "Andhra Pradesh",
    image: "https://images.unsplash.com/photo-1683363028862-f4e26cbb1706?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmFrdSUyMHZhbGxleSUyMGFuZGhyYSUyMHByYWRlc2h8ZW58MXx8fHwxNzU3Njc3Njk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    crowdLevel: "Low",
    bestTime: "Oct-Feb",
    activities: ["Tribal Museum", "Coffee Plantations", "Waterfalls", "Toy Train"],
    cafes: ["Araku Coffee House", "Valley View Restaurant", "Tribal Organic Cafe"],
    description: "Hidden gem in Eastern Ghats with tribal culture"
  }
];

interface DestinationModalProps {
  destination: typeof destinations[0] | null;
  isOpen: boolean;
  onClose: () => void;
}

function DestinationModal({ destination, isOpen, onClose }: DestinationModalProps) {
  const { theme } = useTheme();
  
  if (!isOpen || !destination) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img 
            src={destination.image} 
            alt={destination.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              {destination.name}
            </h2>
            <Badge variant={destination.crowdLevel === 'Low' || destination.crowdLevel === 'Very Low' ? 'default' : 'secondary'}>
              {destination.crowdLevel} Crowd
            </Badge>
          </div>
          
          <p className="text-muted-foreground mb-4" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
            {destination.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                <MapPin className="w-4 h-4 mr-2" />
                Amazing Activities
              </h3>
              <ul className="space-y-1">
                {destination.activities.map((activity, index) => (
                  <li key={index} className="text-sm text-muted-foreground">• {activity}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                ☕ Must-Visit Cafes
              </h3>
              <ul className="space-y-1">
                {destination.cafes.map((cafe, index) => (
                  <li key={index} className="text-sm text-muted-foreground">• {cafe}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Best: {destination.bestTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-sm">{destination.crowdLevel} crowd level</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DestinationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme } = useTheme();
  const [selectedDestination, setSelectedDestination] = useState<typeof destinations[0] | null>(null);

  return (
    <>
      <motion.section
        ref={ref}
        className="py-20 px-8 bg-background"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl lg:text-5xl mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Hidden Gems of India
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
              Discover India's best-kept secrets away from the crowds. Unexplored destinations waiting for your footsteps.
            </p>
          </motion.div>

          {/* Horizontal Scrolling Destinations */}
          <motion.div
            className="overflow-x-auto pb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex gap-6 min-w-max">
              {destinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  className="flex-shrink-0 w-80"
                  initial={{ y: 50, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -10 }}
                >
                  <Card 
                    className="cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-xl"
                    onClick={() => setSelectedDestination(destination)}
                  >
                    <div className="relative">
                      <img 
                        src={destination.image} 
                        alt={destination.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                          {destination.name}
                        </h3>
                        <p className="text-sm opacity-90" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
                          {destination.state}
                        </p>
                      </div>
                      <Badge 
                        className={`absolute top-4 right-4 ${
                          destination.crowdLevel === 'Low' || destination.crowdLevel === 'Very Low' 
                            ? 'bg-green-500' 
                            : destination.crowdLevel === 'Medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                        }`}
                      >
                        {destination.crowdLevel}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-3" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
                        {destination.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {destination.bestTime}
                        </span>
                        <span className="text-orange-600 font-medium">Click to explore →</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <DestinationModal 
        destination={selectedDestination}
        isOpen={!!selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />
    </>
  );
}