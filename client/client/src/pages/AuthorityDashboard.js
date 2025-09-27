import React, { useEffect, useState } from "react";
import { getAuthorityDashboard, approvePermit, getDestinationDetails } from "../api/auth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle, Clock, Users, DollarSign, MapPin } from "lucide-react";

export default function AuthorityDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPermit, setProcessingPermit] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
    } else {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching authority dashboard data...");
      const response = await getAuthorityDashboard();
      console.log("Dashboard response:", response);
      setDashboardData(response.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePermit = async (permitId) => {
    try {
      setProcessingPermit(permitId);
      const result = await approvePermit(permitId);
      setNotification({
        type: 'success',
        message: `Permit approved successfully! QR code has been generated and sent to the guest.`
      });
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.error || err.message || 'Failed to approve permit'
      });
    } finally {
      setProcessingPermit(null);
    }
  };

  const handleViewDestination = async (destinationId) => {
    try {
      const details = await getDestinationDetails(destinationId);
      setSelectedDestination(details);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800">
        <div className="bg-white dark:bg-background rounded-2xl shadow-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700 mx-auto"></div>
          <p className="text-center mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800">
        <div className="bg-white dark:bg-background rounded-2xl shadow-2xl p-8">
          <Alert>
            <AlertDescription>Error loading dashboard: {error}</AlertDescription>
          </Alert>
          <Button onClick={fetchDashboardData} className="mt-4 w-full">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-orange-700 dark:text-orange-400" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Authority Dashboard
          </h1>
          <p className="text-lg text-muted-foreground" style={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
            Manage permits and monitor tourism activities
          </p>
        </div>

        {notification && (
          <Alert className={`mb-4 ${notification.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="permits">Pending Permits</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Permits</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalPermits || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Permits</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.pendingRequests || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Eco Tax Collected</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{dashboardData?.ecoTaxTotal || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.activeVisitors || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="permits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Permit Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.pendingPermitsList?.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Found {dashboardData.pendingPermitsList.length} pending permits
                    </p>
                    {dashboardData.pendingPermitsList.map((permit) => (
                      <div key={permit._id} className="flex items-start justify-between p-4 border-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-1 pr-4">
                          <p className="font-medium text-lg">{permit.userName || permit.guestName || 'Unknown Guest'}</p>
                          <p className="text-sm text-gray-600">
                            {permit.userEmail || permit.guestEmail}
                          </p>
                          <p className="text-sm text-gray-600">
                            {permit.destination} • {permit.checkInDate ? new Date(permit.checkInDate).toLocaleDateString() : new Date(permit.date).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-yellow-600 bg-yellow-50">
                              {permit.status}
                            </Badge>
                            {permit.bookingId && (
                              <Badge variant="secondary" className="text-xs">
                                Booking: {permit.bookingId.slice(-6)}
                              </Badge>
                            )}
                          </div>
                          {permit.ecoTax && (
                            <p className="text-sm mt-1 font-medium">Eco Tax: ₹{permit.ecoTax}</p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {/* Simple approve button that should definitely show */}
                          <button
                            onClick={() => {
                              console.log('🔥 APPROVE CLICKED for permit:', permit._id);
                              alert('Approving permit: ' + permit._id);
                              handleApprovePermit(permit._id);
                            }}
                            disabled={processingPermit === permit._id}
                            style={{
                              backgroundColor: '#16a34a',
                              color: 'white',
                              padding: '8px 16px',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              minWidth: '100px',
                              display: 'block'
                            }}
                          >
                            {processingPermit === permit._id ? (
                              '⏳ Processing...'
                            ) : (
                              '✅ APPROVE NOW'
                            )}
                          </button>
                          <div className="text-xs text-center mt-1 text-gray-500">
                            ID: {permit._id?.slice(-4)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No pending permits to review
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="destinations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Destination Management</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.destinations?.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {dashboardData.destinations.map((destination) => (
                      <Card key={destination._id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{destination.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">{destination.location}</p>
                          <div className="flex justify-between items-center">
                            <Badge variant="secondary">
                              Capacity: {destination.currentCapacity || 0}/{destination.maxCapacity || 0}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleViewDestination(destination._id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No destinations found
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>This Month Permits:</span>
                      <span className="font-bold">{dashboardData?.monthlyPermits || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue Generated:</span>
                      <span className="font-bold">₹{dashboardData?.monthlyRevenue || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tourist Visits:</span>
                      <span className="font-bold">{dashboardData?.monthlyVisits || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.popularDestinations?.map((dest, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <span>{dest.name}</span>
                      <Badge>{dest.visits} visits</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {selectedDestination && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-96 overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedDestination.name}</CardTitle>
                  <Button variant="ghost" onClick={() => setSelectedDestination(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p><strong>Location:</strong> {selectedDestination.location}</p>
                  <p><strong>Description:</strong> {selectedDestination.description}</p>
                  <p><strong>Current Capacity:</strong> {selectedDestination.currentCapacity || 0}/{selectedDestination.maxCapacity || 0}</p>
                  <p><strong>Eco Tax:</strong> ₹{selectedDestination.ecoTax || 0}</p>
                  {selectedDestination.permits && selectedDestination.permits.length > 0 && (
                    <div>
                      <strong>Recent Permits:</strong>
                      <div className="mt-2 space-y-2">
                        {selectedDestination.permits.slice(0, 5).map((permit, index) => (
                          <div key={index} className="p-2 border rounded text-sm">
                            <p>User: {permit.userId?.name || 'N/A'}</p>
                            <p>Date: {new Date(permit.date).toLocaleDateString()}</p>
                            <Badge variant={permit.status === 'approved' ? 'default' : 'secondary'}>
                              {permit.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
