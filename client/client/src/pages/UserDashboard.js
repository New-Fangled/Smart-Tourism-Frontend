import React, { useEffect, useState } from "react";
import { getUserProfile } from "../api/auth";
import { getAllBookings } from "../api/fastapi";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import BookingForm from "./BookingForm";
import MyPermits from "../components/MyPermits";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings", "permits", or "newBooking"

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Run both API calls concurrently
        await Promise.allSettled([
          fetchUserData(),
          fetchUserBookings()
        ]);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getUserProfile();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Don't redirect if auth fails, just set user as null
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await getAllBookings();
      setUserBookings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setUserBookings([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const refreshBookings = async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        fetchUserData(),
        fetchUserBookings()
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-orange-700 dark:text-orange-400" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Welcome, {user?.username || 'User'}!
            </h1>
            <p className="text-lg text-muted-foreground mt-2" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
              Manage your bookings and plan your next adventure
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setActiveTab("bookings")}
            variant={activeTab === "bookings" ? "default" : "outline"}
            className={activeTab === "bookings" ? "bg-orange-600 text-white" : ""}
          >
            My Bookings ({userBookings.length})
          </Button>
          <Button
            onClick={() => setActiveTab("permits")}
            variant={activeTab === "permits" ? "default" : "outline"}
            className={activeTab === "permits" ? "bg-orange-600 text-white" : ""}
          >
            My Permits
          </Button>
          <Button
            onClick={() => setActiveTab("newBooking")}
            variant={activeTab === "newBooking" ? "default" : "outline"}
            className={activeTab === "newBooking" ? "bg-orange-600 text-white" : ""}
          >
            Create New Booking
          </Button>
        </div>

        {/* Content */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-orange-700 dark:text-orange-400">Your Bookings</h2>
            {userBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground text-lg">No bookings found</p>
                  <Button
                    onClick={() => setActiveTab("newBooking")}
                    className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white"
                  >
                    Create Your First Booking
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{booking.destination}</CardTitle>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-muted-foreground">Check-in</p>
                          <p>{booking.check_in_date}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Check-out</p>
                          <p>{booking.check_out_date}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Guest Name</p>
                          <p>{booking.guest_name}</p>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">Booking ID</p>
                          <p className="font-mono text-xs">{booking.id}</p>
                        </div>
                      </div>
                      {booking.guest_phone && (
                        <div className="mt-2">
                          <p className="font-medium text-muted-foreground">Phone</p>
                          <p>{booking.guest_phone}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "permits" && (
          <div>
            <h2 className="text-2xl font-semibold text-orange-700 dark:text-orange-400 mb-6">My Travel Permits</h2>
            <MyPermits />
          </div>
        )}

        {activeTab === "newBooking" && (
          <div>
            <h2 className="text-2xl font-semibold text-orange-700 dark:text-orange-400 mb-6">Create New Booking</h2>
            <BookingForm onBookingSuccess={() => {
              refreshBookings();
              setActiveTab("bookings");
            }} />
          </div>
        )}
      </div>
    </div>
  );
}