import { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion, useInView } from "framer-motion";
import { CalendarIcon, SearchIcon, MapPinIcon, UsersIcon, ClockIcon, StarIcon } from 'lucide-react';
// Simple date formatting function
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

interface SearchFilters {
  destination: string;
  startDate?: Date;
  endDate?: Date;
  stayType: 'day-use' | 'overnight' | 'both';
  category: 'all' | 'families' | 'youngsters' | 'seniors' | 'college';
  adults: number;
  rooms: number;
}

interface AdvancedSearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

export function AdvancedSearchBar({ onSearch, className = "" }: AdvancedSearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    destination: '',
    stayType: 'both',
    category: 'all',
    adults: 2,
    rooms: 1
  });

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const categories = [
    { value: 'all', label: 'All Travelers', icon: '🌟', description: 'Perfect for everyone' },
    { value: 'families', label: 'Families', icon: '👨‍👩‍👧‍👦', description: 'Kid-friendly places with facilities' },
    { value: 'youngsters', label: 'Adventure Seekers', icon: '🏔️', description: 'Thrilling activities & remote locations' },
    { value: 'seniors', label: 'Senior Travelers', icon: '🏛️', description: 'Accessible places with comfortable amenities' },
    { value: 'college', label: 'College Groups', icon: '🎒', description: 'Budget-friendly with group activities' }
  ];

  const stayTypes = [
    { value: 'day-use', label: 'Day Use', description: 'Quick visits and day trips' },
    { value: 'overnight', label: 'Overnight Stay', description: 'Extended stays with accommodation' },
    { value: 'both', label: 'Both Options', description: 'Flexible stay duration' }
  ];

  const handleSearch = () => {
    onSearch(filters);
  };

  const updateFilters = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-6xl mx-auto p-6 bg-card/95 backdrop-blur-sm border border-border rounded-2xl shadow-2xl ${className}`}
    >
      <div className="space-y-6">
        {/* Main Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              Destination
            </label>
            <Input
              placeholder="Where to? (e.g., Ladakh, Manali)"
              value={filters.destination}
              onChange={(e) => updateFilters('destination', e.target.value)}
              className="h-12"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Check-in</label>
            <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? formatDate(filters.startDate) : "Select date"}
                </Button>
              </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={(date) => {
                    if (date && date >= new Date()) {
                      updateFilters('startDate', date);
                      setShowStartCalendar(false);
                    }
                  }}
                />
                </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Check-out</label>
            <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? formatDate(filters.endDate) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={(date) => {
                    if (
                      date &&
                      (!filters.startDate || date >= filters.startDate) &&
                      date >= new Date()
                    ) {
                      updateFilters('endDate', date);
                      setShowEndCalendar(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests & Rooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              Guests & Rooms
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal"
                >
                  {filters.adults} adults, {filters.rooms} room{filters.rooms > 1 ? 's' : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Adults</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFilters('adults', Math.max(1, filters.adults - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{filters.adults}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFilters('adults', filters.adults + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rooms</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFilters('rooms', Math.max(1, filters.rooms - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{filters.rooms}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFilters('rooms', filters.rooms + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Advanced Filters */}
        <Tabs defaultValue="stay-type" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stay-type" className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              Stay Type
            </TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-2">
              <StarIcon className="w-4 h-4" />
              Travel Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stay-type" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stayTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border border-border rounded-lg cursor-pointer transition-all duration-200 ${
                    filters.stayType === type.value
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                      : 'hover:border-orange-300'
                  }`}
                  onClick={() => updateFilters('stayType', type.value)}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-muted-foreground">{type.description}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="category" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.value}
                  className={`p-4 border border-border rounded-lg cursor-pointer transition-all duration-200 ${
                    filters.category === cat.value
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                      : 'hover:border-orange-300'
                  }`}
                  onClick={() => updateFilters('category', cat.value)}
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="font-medium text-sm">{cat.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{cat.description}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Special Offers Badge */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              🟢 Low Crowd Alert - Offline booking available
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              💰 Early Bird - Save up to 25%
            </Badge>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-semibold rounded-lg shadow-lg"
          >
            <SearchIcon className="w-4 h-4 mr-2" />
            Search Destinations
          </Button>
        </div>
      </div>
    </motion.div>
  );
}