import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Clock } from "lucide-react";

const newsData = [
  {
    id: 1,
    destination: "Manali",
    status: "High Traffic",
    icon: TrendingUp,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    message:
      "Heavy tourist influx due to weekend. Consider alternative routes via Kullu.",
    timestamp: "2 hours ago",
    crowdLevel: 85,
  },
  {
    id: 2,
    destination: "Rishikesh",
    status: "Moderate Crowds",
    icon: AlertTriangle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    message:
      "Ganga Aarti experiencing moderate crowds. Best viewing from Ram Jhula side.",
    timestamp: "4 hours ago",
    crowdLevel: 60,
  },
  {
    id: 3,
    destination: "Spiti Valley",
    status: "Low Traffic",
    icon: TrendingDown,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    message: "Perfect time to visit! Clear roads and minimal tourist presence.",
    timestamp: "6 hours ago",
    crowdLevel: 20,
  },
  {
    id: 4,
    destination: "Goa Beaches",
    status: "Peak Season",
    icon: TrendingUp,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    message:
      "Christmas season peak. Book accommodations in advance. Calangute very crowded.",
    timestamp: "1 hour ago",
    crowdLevel: 95,
  },
  {
    id: 5,
    destination: "Coorg",
    status: "Ideal Weather",
    icon: TrendingDown,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    message:
      "Post-monsoon clarity perfect for coffee plantation tours. Light tourist traffic.",
    timestamp: "3 hours ago",
    crowdLevel: 35,
  },
];

export function TravelNews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getStatusBadge = (crowdLevel: number) => {
    if (crowdLevel >= 80)
      return { variant: "destructive" as const, text: "Very Crowded" };
    if (crowdLevel >= 60)
      return { variant: "secondary" as const, text: "Moderate" };
    return { variant: "default" as const, text: "Less Crowded" };
  };

  return (
    <motion.section
      ref={ref}
      className={`py-20 px-8 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-orange-50 to-red-50"
      }`}
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Live Updates
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl mb-4"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
          >
            Daily Travel Intelligence
          </h2>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2"
            style={{ fontFamily: "Crimson Text, Georgia, serif" }}
          >
            Real-time crowd levels and travel conditions across India's popular
            destinations
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last updated: {currentTime.toLocaleTimeString()}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((news, index) => {
            const IconComponent = news.icon;
            const statusBadge = getStatusBadge(news.crowdLevel);

            return (
              <motion.div
                key={news.id}
                initial={{ y: 50, opacity: 0 }}
                animate={
                  isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }
                }
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className={`h-full transition-all duration-300 hover:shadow-lg ${news.bgColor}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-5 h-5 ${news.color}`} />
                        <CardTitle
                          className="text-lg"
                          style={{
                            fontFamily: "Playfair Display, Georgia, serif",
                          }}
                        >
                          {news.destination}
                        </CardTitle>
                      </div>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.text}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p
                      className="text-sm text-muted-foreground mb-4"
                      style={{ fontFamily: "Crimson Text, Georgia, serif" }}
                    >
                      {news.message}
                    </p>

                    {/* Crowd Level Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Crowd Level</span>
                        <span>{news.crowdLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${
                            news.crowdLevel >= 80
                              ? "bg-red-500"
                              : news.crowdLevel >= 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={
                            isInView
                              ? { width: `${news.crowdLevel}%` }
                              : { width: 0 }
                          }
                          transition={{ duration: 1, delay: 0.2 * index }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {news.timestamp}
                      </span>
                      <span className={`font-medium ${news.color}`}>
                        {news.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Tips */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
              theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-sm border border-border`}
          >
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "Crimson Text, Georgia, serif" }}
            >
              💡 Pro Tip: Green destinations offer the best experience with
              minimal crowds!
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
