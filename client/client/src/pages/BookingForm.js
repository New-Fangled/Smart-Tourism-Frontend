import React, { useState } from "react";
import { checkAvailability, createBooking } from "../api/fastapi";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function BookingForm({ onBookingSuccess }) {
  const [searchResults, setSearchResults] = useState({
    destination: "",
    startDate: null,
    endDate: null
  });
  const [availabilityData, setAvailabilityData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState("search"); // "search", "details", "confirm"
  const [guestDetails, setGuestDetails] = useState({
    guest_name: "",
    guest_email: "",
    guest_phone: ""
  });

  const handleSearch = async (filters) => {
    if (!filters.destination || !filters.startDate || !filters.endDate) {
      setError("Please fill in destination, check-in and check-out dates");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Format dates for API
      const checkInDate = filters.startDate.toISOString().split('T')[0];
      const checkOutDate = filters.endDate.toISOString().split('T')[0];

      const response = await checkAvailability(
        checkInDate,
        checkOutDate,
        filters.destination
      );
      
      setAvailabilityData(response.data);
      if (response.data.available) {
        setBookingStep("details");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to check availability");
      setAvailabilityData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDetailsChange = (e) => {
    setGuestDetails({
      ...guestDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateBooking = async () => {
    if (!guestDetails.guest_name || !guestDetails.guest_email) {
      setError("Please fill in name and email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingData = {
        check_in_date: searchResults.startDate.toISOString().split('T')[0],
        check_out_date: searchResults.endDate.toISOString().split('T')[0],
        destination: searchResults.destination,
        guest_name: guestDetails.guest_name,
        guest_email: guestDetails.guest_email,
        guest_phone: guestDetails.guest_phone || null
      };

      const response = await createBooking(bookingData);
      setSuccess(
        `✅ Booking submitted successfully! Booking ID: ${response.data.id}\n` +
        `📋 Your permit request has been sent to authorities for approval.\n` +
        `⏳ Status: Pending Approval - Please wait for authority approval.\n` +
        `📧 You'll receive your travel permit and QR code once approved.\n` +
        `🚫 Do not travel until your permit is approved and confirmed.`
      );
      setBookingStep("confirm");
      
      // Reset form
      setTimeout(() => {
        setBookingStep("search");
        setSearchResults({ destination: "", startDate: null, endDate: null });
        setAvailabilityData(null);
        setGuestDetails({ guest_name: "", guest_email: "", guest_phone: "" });
        setSuccess("");
        
        // Call the callback if provided
        if (onBookingSuccess) {
          onBookingSuccess();
        }
      }, 5000);

    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-700 dark:text-orange-400 mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Book Your Perfect Journey
          </h1>
          <p className="text-lg text-muted-foreground" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
            Discover incredible destinations with smart booking and availability management
          </p>
        </div>

        {/* Search Step */}
        {bookingStep === "search" && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book Your Perfect Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-muted-foreground">Destination *</label>
                  <input
                    type="text"
                    placeholder="Enter destination (e.g., Ladakh, Manali)"
                    value={searchResults?.destination || ""}
                    onChange={(e) => setSearchResults(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-muted-foreground">Check-in Date *</label>
                    <input
                      type="date"
                      value={searchResults?.startDate?.toISOString().split('T')[0] || ""}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setSearchResults(prev => ({ ...prev, startDate: date }));
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-muted-foreground">Check-out Date *</label>
                    <input
                      type="date"
                      value={searchResults?.endDate?.toISOString().split('T')[0] || ""}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setSearchResults(prev => ({ ...prev, endDate: date }));
                      }}
                      min={searchResults?.startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    if (!searchResults?.destination || !searchResults?.startDate || !searchResults?.endDate) {
                      setError("Please fill in all required fields");
                      return;
                    }
                    handleSearch(searchResults);
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Checking Availability..." : "Check Availability"}
                </Button>
              </CardContent>
            </Card>
            
            {/* Permit Information Card */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 text-2xl">ℹ️</div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Travel Permit Information</h3>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Your booking will automatically create a permit request</p>
                      <p>• Authority approval is required before you can travel</p>
                      <p>• You'll receive a QR code via email once approved</p>
                      <p>• Present the QR code when entering the destination</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {loading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <p className="mt-2 text-muted-foreground">Checking availability...</p>
              </div>
            )}

            {availabilityData && !availabilityData.available && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-red-600 text-lg font-semibold mb-2">❌ Not Available</div>
                    <p className="text-muted-foreground">{availabilityData.message}</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => {
                        setAvailabilityData(null);
                        setSearchResults({ destination: "", startDate: null, endDate: null });
                      }}
                    >
                      Try Different Dates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Guest Details Step */}
        {bookingStep === "details" && availabilityData?.available && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-green-600">✅ Available for Booking!</CardTitle>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Destination:</strong> {availabilityData.destination}</p>
                <p><strong>Check-in:</strong> {availabilityData.check_in_date}</p>
                <p><strong>Check-out:</strong> {availabilityData.check_out_date}</p>
                <p><strong>Nights:</strong> {availabilityData.nights}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Guest Details</h3>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-muted-foreground">Full Name *</label>
                <input
                  type="text"
                  name="guest_name"
                  value={guestDetails.guest_name}
                  onChange={handleGuestDetailsChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-muted-foreground">Email Address *</label>
                <input
                  type="email"
                  name="guest_email"
                  value={guestDetails.guest_email}
                  onChange={handleGuestDetailsChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-muted-foreground">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="guest_phone"
                  value={guestDetails.guest_phone}
                  onChange={handleGuestDetailsChange}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-orange-400 bg-background text-foreground"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setBookingStep("search")}
                  className="flex-1"
                >
                  Back to Search
                </Button>
                <Button
                  onClick={handleCreateBooking}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white"
                >
                  {loading ? "Creating Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {bookingStep === "confirm" && success && (
          <Card className="mt-6">
            <CardContent className="p-8 text-center">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-4">{success}</p>
              <p className="text-sm text-muted-foreground">You will be redirected to the search page in a few seconds...</p>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mt-6 border-red-200">
            <CardContent className="p-4">
              <div className="text-red-600 font-medium text-center">{error}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default BookingForm;