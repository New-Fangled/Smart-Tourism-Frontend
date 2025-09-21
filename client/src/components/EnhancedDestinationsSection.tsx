import { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

// Type definitions for component props
interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "outline";
}

interface ButtonProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  onClick?: () => void;
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface DialogProps {
  children: ReactNode;
}

interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: ReactNode;
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

interface TabsProps {
  children: (
    activeTab: string,
    setActiveTab: (tab: string) => void
  ) => ReactNode;
  defaultValue: string;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: ReactNode;
  className?: string;
  value: string;
  activeTab: string;
  onClick: (value: string) => void;
}

interface TabsContentProps {
  children: ReactNode;
  value: string;
  activeTab: string;
  className?: string;
}

interface IconProps {
  className?: string;
  [key: string]: any;
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

// Mocked Shadcn/ui components for a single-file app
const Badge = ({
  children,
  className = "",
  variant = "default",
}: BadgeProps) => (
  <div
    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  className = "",
  size = "md",
  variant = "default",
  onClick,
}: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    onClick={onClick}
    style={{ padding: size === "sm" ? "0.25rem 0.75rem" : "0.5rem 1rem" }}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: CardContentProps) => (
  <div className={className}>{children}</div>
);

const Dialog = ({ children }: DialogProps) => <div>{children}</div>;
const DialogTrigger = ({ children, asChild }: DialogTriggerProps) =>
  asChild ? children : <button>{children}</button>;
const DialogContent = ({ children, className = "" }: DialogContentProps) => (
  <div
    className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex justify-center items-center p-4 ${className}`}
  >
    <div className="relative z-50 w-full max-w-lg overflow-y-auto rounded-lg border bg-background p-6 shadow-lg sm:rounded-lg">
      {children}
    </div>
  </div>
);
const DialogHeader = ({ children }: DialogHeaderProps) => <div>{children}</div>;
const DialogTitle = ({ children, className = "" }: DialogTitleProps) => (
  <h2
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
  >
    {children}
  </h2>
);

const Tabs = ({ children, defaultValue, className = "" }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return <div className={className}>{children(activeTab, setActiveTab)}</div>;
};

const TabsList = ({ children, className = "" }: TabsListProps) => (
  <div
    className={`inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
  >
    {children}
  </div>
);
const TabsTrigger = ({
  children,
  className = "",
  value,
  activeTab,
  onClick,
}: TabsTriggerProps) => (
  <button
    onClick={() => onClick(value)}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className} ${
      activeTab === value ? "bg-background text-foreground shadow-sm" : ""
    }`}
  >
    {children}
  </button>
);
const TabsContent = ({
  children,
  value,
  activeTab,
  className = "",
}: TabsContentProps) => {
  if (activeTab !== value) return null;
  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
};

// Lucide React Icons
const MapPinIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const StarIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const WifiIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 20h.01" />
    <path d="M2 8.82a15 15 0 0 1 20 0" />
    <path d="M5 12.55a11 11 0 0 1 14 0" />
    <path d="M8.5 16.38a6 6 0 0 1 7 0" />
  </svg>
);
const CoffeeIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 2a6 6 0 0 0-6 6v3.5a1.5 1.5 0 0 1-3 0V8a8 8 0 0 1 16 0v3.5a1.5 1.5 0 0 1-3 0V8a6 6 0 0 0-6-6z" />
    <path d="M6 14h12c-.5 2.5-2.5 4-5 4H11c-2.5 0-4.5-1.5-5-4z" />
    <line x1="12" x2="12" y1="20" y2="22" />
  </svg>
);
const MountainIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 3 12 7l4-4" />
    <path d="m14 10 3 3 3-3" />
    <path d="M8 21v-5l-4-4 4-4 4 4 4-4 4 4-4 4v5" />
    <path d="M12 12v5" />
  </svg>
);
const CalendarIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

// Custom components
const ImageWithFallback = ({
  src,
  alt,
  className = "",
}: ImageWithFallbackProps) => {
  const [imageSrc, setImageSrc] = useState(src);
  const fallbackSrc =
    "https://placehold.co/1080x720/e2e8f0/64748b?text=Image+Not+Found";

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return (
    <img src={imageSrc} alt={alt} className={className} onError={handleError} />
  );
};

interface Destination {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  category: "families" | "youngsters" | "seniors" | "college" | "all";
  crowdLevel: number; // 0-100
  difficulty: "easy" | "moderate" | "challenging";
  facilities: string[];
  activities: string[];
  cafes: string[];
  attractions: string[];
  dayUse: boolean;
  overnight: boolean;
  price: {
    dayUse?: number;
    overnight?: number;
  };
  bestFor: string[];
  description: string;
}

const destinations: Destination[] = [
  {
    id: "1",
    name: "Turtuk Village",
    location: "Ladakh, Jammu & Kashmir",
    image:
      "https://images.unsplash.com/photo-1560278545-7395c72f4740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWRha2glMjB2aWxsYWdlJTIwbW91bnRhaW5zJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1ODI5NzUwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    category: "all",
    crowdLevel: 25,
    difficulty: "moderate",
    facilities: ["Local Homestays", "Basic Medical", "Local Guides"],
    activities: [
      "Village Walk",
      "Apricot Farming",
      "Cultural Exchange",
      "Photography",
    ],
    cafes: ["Turtuk Organic Cafe", "Baltistan Tea House"],
    attractions: ["Turtuk Monastery", "Balti Museum", "Ancient Fortress Ruins"],
    dayUse: true,
    overnight: true,
    price: { dayUse: 500, overnight: 2500 },
    bestFor: ["Cultural enthusiasts", "Off-beat travelers", "Photographers"],
    description:
      "Last village on the Indo-Pak border, offering authentic Balti culture",
  },
  {
    id: "2",
    name: "Malana Village",
    location: "Himachal Pradesh",
    image:
      "https://images.unsplash.com/photo-1734699865526-efcc499ff560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW1hY2hhbCUyMHByYWRlc2glMjB2YWxsZXklMjBzY2VuaWN8ZW58MXx8fHwxNzU4Mjk3NDk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.5,
    category: "youngsters",
    crowdLevel: 45,
    difficulty: "challenging",
    facilities: ["Limited WiFi", "Basic Accommodation", "Trekking Gear Rental"],
    activities: ["Trekking", "Ancient Customs Study", "Hemp Culture Tour"],
    cafes: ["Malana Cafe", "Local Dhaba"],
    attractions: [
      "Ancient Parliament",
      "Jamadagni Temple",
      "Traditional Architecture",
    ],
    dayUse: true,
    overnight: true,
    price: { dayUse: 800, overnight: 1800 },
    bestFor: ["Adventure seekers", "Anthropology enthusiasts", "Backpackers"],
    description: "Ancient village with unique democracy and mysterious customs",
  },
  {
    id: "3",
    name: "Chopta Meadows",
    location: "Uttarakhand",
    image:
      "https://images.unsplash.com/photo-1667662815327-cb80c77bfffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1dHRhcmFraGFuZCUyMG1vdW50YWluJTIwdmlsbGFnZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NTgyOTc1MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    category: "families",
    crowdLevel: 35,
    difficulty: "easy",
    facilities: ["Family Resorts", "Medical Facility", "Guided Tours", "WiFi"],
    activities: ["Nature Walks", "Bird Watching", "Picnicking", "Camping"],
    cafes: ["Mountain View Cafe", "Devriya Tal Dhaba"],
    attractions: ["Tungnath Temple", "Chandrashila Peak", "Devriya Tal Lake"],
    dayUse: true,
    overnight: true,
    price: { dayUse: 300, overnight: 3500 },
    bestFor: ["Families with kids", "Nature lovers", "First-time trekkers"],
    description: "Mini Switzerland of India with lush green meadows",
  },
  {
    id: "4",
    name: "Ziro Valley",
    location: "Arunachal Pradesh",
    image:
      "https://images.unsplash.com/photo-1736914319111-d54ada582633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnVuYWNoYWwlMjBwcmFkZXNoJTIwdHJpYmFsJTIwdmlsbGFnZXxlbnwxfHx8fDE3NTgyOTc1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    category: "college",
    crowdLevel: 20,
    difficulty: "easy",
    facilities: ["Backpacker Hostels", "Music Venues", "Organic Food"],
    activities: ["Music Festival", "Tribal Culture Tour", "Rice Field Walks"],
    cafes: ["Ziro Cafe", "Apatani Organic Kitchen"],
    attractions: ["Apatani Villages", "Talley Valley", "Kile Pakho"],
    dayUse: true,
    overnight: true,
    price: { dayUse: 400, overnight: 1200 },
    bestFor: ["Music lovers", "Budget travelers", "Cultural explorers"],
    description:
      "UNESCO Heritage site famous for music festival and tribal culture",
  },
  {
    id: "5",
    name: "Khajjiar",
    location: "Himachal Pradesh",
    image:
      "https://images.unsplash.com/photo-1663053552790-b0791c1fa3be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtb3VudGFpbiUyMGNpdGllcyUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzU4Mjk3NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.4,
    category: "seniors",
    crowdLevel: 40,
    difficulty: "easy",
    facilities: [
      "Accessible Paths",
      "Comfortable Hotels",
      "Medical Services",
      "Car Parking",
    ],
    activities: ["Horse Riding", "Boating", "Temple Visits", "Scenic Drives"],
    cafes: ["Swiss Cafe", "Deodar Heights Restaurant"],
    attractions: [
      "Khajji Nag Temple",
      "Kalatop Wildlife Sanctuary",
      "Daikund Peak",
    ],
    dayUse: true,
    overnight: true,
    price: { dayUse: 600, overnight: 4000 },
    bestFor: ["Senior travelers", "Accessibility needs", "Comfort seekers"],
    description: "Mini Switzerland with accessible tourist facilities",
  },
];

export default function App() {
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredDestinations = destinations;

  const getCrowdStatusColor = (level: number) => {
    if (level < 30)
      return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
    if (level < 60)
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
    return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
  };

  const getCrowdStatus = (level: number) => {
    if (level < 30) return "Low Crowd - Offline Booking Available";
    if (level < 60) return "Moderate Crowd";
    return "High Crowd - Online Booking Recommended";
  };

  return (
    <div className="bg-background text-foreground font-sans">
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Discover Hidden Gems of India
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
              style={{ fontFamily: "Crimson Text, Georgia, serif" }}
            >
              Explore unpopular destinations with stunning mountain landscapes
              and unique cultural experiences
            </p>
            <motion.div
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span>← Scroll horizontally to explore →</span>
            </motion.div>
          </motion.div>

          {/* Destinations Horizontal Scroll with Dynamic Movement */}
          <div
            className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-none w-80 snap-center"
                style={{
                  transform: `translateY(${scrollY * (0.02 + index * 0.01)}px)`,
                }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border-2 border-transparent hover:border-orange-300/50 bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-900 dark:to-orange-950/20">
                  <div className="relative h-64 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full"
                    >
                      <ImageWithFallback
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Floating Elements with Dynamic Movement */}
                    <motion.div
                      className="absolute top-4 left-4"
                      animate={{
                        y: [0, -5, 0],
                        rotate: [0, 2, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Badge
                        className={getCrowdStatusColor(destination.crowdLevel)}
                        variant="default"
                      >
                        {destination.crowdLevel < 30
                          ? "🟢"
                          : destination.crowdLevel < 60
                          ? "🟡"
                          : "🔴"}
                        {destination.crowdLevel}% Capacity
                      </Badge>
                    </motion.div>

                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{
                        y: [0, 5, 0],
                        rotate: [0, -2, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-black/70 text-white backdrop-blur-sm"
                      >
                        ⭐ {destination.rating}
                      </Badge>
                    </motion.div>

                    {/* Gradient Overlay with Movement */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </div>

                  <CardContent className="p-6 relative">
                    {/* Floating Decoration Elements */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-15"
                      animate={{
                        y: [0, -10, 0],
                        x: [0, 5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                    />
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">
                        {destination.name}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {destination.location}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {destination.bestFor.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">From </span>
                        <span className="font-semibold">
                          ₹{destination.price.dayUse}
                        </span>
                        <span className="text-muted-foreground">/day</span>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setSelectedDestination(destination);
                              setIsDialogOpen(true);
                            }}
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500"
                          >
                            Explore
                          </Button>
                        </DialogTrigger>

                        {isDialogOpen && selectedDestination && (
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <>
                              <DialogHeader>
                                <DialogTitle className="text-2xl flex items-center gap-2">
                                  {selectedDestination.name}
                                  <Badge
                                    className={getCrowdStatusColor(
                                      selectedDestination.crowdLevel
                                    )}
                                    variant="default"
                                  >
                                    {getCrowdStatus(
                                      selectedDestination.crowdLevel
                                    )}
                                  </Badge>
                                </DialogTitle>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div className="relative h-64 rounded-lg overflow-hidden">
                                  <ImageWithFallback
                                    src={selectedDestination.image}
                                    alt={selectedDestination.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      About
                                    </h4>
                                    <p className="text-muted-foreground mb-4">
                                      {selectedDestination.description}
                                    </p>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <MapPinIcon className="w-4 h-4" />
                                        <span className="text-sm">
                                          {selectedDestination.location}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <StarIcon className="w-4 h-4" />
                                        <span className="text-sm">
                                          {selectedDestination.rating}/5 Rating
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MountainIcon className="w-4 h-4" />
                                        <span className="text-sm capitalize">
                                          {selectedDestination.difficulty}{" "}
                                          Difficulty
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Pricing
                                    </h4>
                                    <div className="p-4 border border-border rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">
                                          Starting From
                                        </span>
                                        <span className="text-2xl font-bold text-orange-600">
                                          ₹{selectedDestination.price.dayUse}
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        Includes guided tours and local
                                        experiences
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <Tabs
                                  defaultValue="activities"
                                  className="w-full"
                                >
                                  {(
                                    activeTab: string,
                                    setActiveTab: (tab: string) => void
                                  ) => (
                                    <>
                                      <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger
                                          value="activities"
                                          activeTab={activeTab}
                                          onClick={setActiveTab}
                                          className=""
                                        >
                                          Activities
                                        </TabsTrigger>
                                        <TabsTrigger
                                          value="cafes"
                                          activeTab={activeTab}
                                          onClick={setActiveTab}
                                          className=""
                                        >
                                          Cafes
                                        </TabsTrigger>
                                        <TabsTrigger
                                          value="attractions"
                                          activeTab={activeTab}
                                          onClick={setActiveTab}
                                          className=""
                                        >
                                          Attractions
                                        </TabsTrigger>
                                        <TabsTrigger
                                          value="facilities"
                                          activeTab={activeTab}
                                          onClick={setActiveTab}
                                          className=""
                                        >
                                          Facilities
                                        </TabsTrigger>
                                      </TabsList>

                                      <TabsContent
                                        value="activities"
                                        activeTab={activeTab}
                                        className="space-y-2"
                                      >
                                        <div className="grid grid-cols-2 gap-2">
                                          {selectedDestination.activities.map(
                                            (activity) => (
                                              <Badge
                                                key={activity}
                                                variant="outline"
                                                className="justify-center"
                                              >
                                                {activity}
                                              </Badge>
                                            )
                                          )}
                                        </div>
                                      </TabsContent>

                                      <TabsContent
                                        value="cafes"
                                        activeTab={activeTab}
                                        className="space-y-2"
                                      >
                                        <div className="space-y-2">
                                          {selectedDestination.cafes.map(
                                            (cafe) => (
                                              <div
                                                key={cafe}
                                                className="flex items-center gap-2 p-2 border border-border rounded"
                                              >
                                                <CoffeeIcon className="w-4 h-4" />
                                                <span>{cafe}</span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </TabsContent>

                                      <TabsContent
                                        value="attractions"
                                        activeTab={activeTab}
                                        className="space-y-2"
                                      >
                                        <div className="space-y-2">
                                          {selectedDestination.attractions.map(
                                            (attraction) => (
                                              <div
                                                key={attraction}
                                                className="flex items-center gap-2 p-2 border border-border rounded"
                                              >
                                                <MapPinIcon className="w-4 h-4" />
                                                <span>{attraction}</span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </TabsContent>

                                      <TabsContent
                                        value="facilities"
                                        activeTab={activeTab}
                                        className="space-y-2"
                                      >
                                        <div className="grid grid-cols-1 gap-2">
                                          {selectedDestination.facilities.map(
                                            (facility) => (
                                              <div
                                                key={facility}
                                                className="flex items-center gap-2 p-2 border border-border rounded"
                                              >
                                                <WifiIcon className="w-4 h-4" />
                                                <span>{facility}</span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </TabsContent>
                                    </>
                                  )}
                                </Tabs>

                                <div className="flex gap-4 pt-4">
                                  <Button
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500"
                                    variant="default"
                                    onClick={() => {}}
                                  >
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    {selectedDestination.crowdLevel < 50
                                      ? "Book Offline"
                                      : "Book Online"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {}}
                                  >
                                    Add to Wishlist
                                  </Button>
                                </div>
                              </div>
                            </>
                          </DialogContent>
                        )}
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
