import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { getMyPermits } from '../api/auth';

interface Permit {
  _id: string;
  destination: string;
  destinationLocation?: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'valid' | 'expired';
  qrCode?: string;
  approvedAt?: string;
  createdAt: string;
  isExpired: boolean;
}

interface PermitSummary {
  total: number;
  pending: number;
  approved: number;
  expired: number;
}

const MyPermits: React.FC = () => {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [summary, setSummary] = useState<PermitSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching user permits...');
      const response = await getMyPermits();
      console.log('✅ Permits response:', response.data);
      console.log('📋 Number of permits:', response.data.permits?.length || 0);
      
      // Log details about each permit
      response.data.permits?.forEach((permit: Permit, index: number) => {
        console.log(`📄 Permit ${index + 1}:`, {
          id: permit._id,
          destination: permit.destination,
          status: permit.status,
          hasQrCode: !!permit.qrCode,
          qrCodeLength: permit.qrCode?.length || 0
        });
      });
      
      setPermits(response.data.permits);
      setSummary(response.data.summary);
      setError(null);
    } catch (err: any) {
      console.error('❌ Error fetching permits:', err);
      setError(err.response?.data?.error || 'Failed to fetch permits');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, isExpired: boolean) => {
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'valid':
        return <Badge variant="default">Approved</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const downloadQRCode = (qrCode: string, permitId: string) => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `permit-qr-${permitId}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading your permits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-md mx-auto">
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={fetchPermits} className="mt-2">
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Travel Permits</h1>
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{summary.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{summary.approved}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{summary.expired}</div>
                <div className="text-sm text-gray-600">Expired</div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Debug Info - Remove after testing */}
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <strong>Debug Info:</strong><br />
          Total permits: {permits.length}<br />
          Permits with QR codes: {permits.filter(p => p.qrCode).length}<br />
          Valid permits: {permits.filter(p => p.status === 'valid').length}<br />
          {permits.map((permit, index) => (
            <div key={permit._id}>
              Permit {index + 1}: {permit.destination} - Status: {permit.status} - QR: {permit.qrCode ? 'Yes' : 'No'}
            </div>
          ))}
        </div>
      </div>

      {permits.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-lg text-gray-600">No permits found</div>
            <div className="text-sm text-gray-500 mt-2">
              Book a destination to create your first permit
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {permits.map((permit) => (
            <Card key={permit._id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{permit.destination}</CardTitle>
                    {permit.destinationLocation && (
                      <div className="text-sm text-gray-600 mt-1">
                        {permit.destinationLocation}
                      </div>
                    )}
                  </div>
                  {getStatusBadge(permit.status, permit.isExpired)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <strong>Check-in:</strong> {new Date(permit.checkInDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Check-out:</strong> {new Date(permit.checkOutDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Applied:</strong> {new Date(permit.createdAt).toLocaleDateString()}
                    </div>
                    {permit.approvedAt && (
                      <div>
                        <strong>Approved:</strong> {new Date(permit.approvedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {permit.qrCode && permit.status === 'valid' && !permit.isExpired && (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-sm font-medium text-green-600">
                        ✅ Your Travel QR Code
                      </div>
                      <img 
                        src={permit.qrCode} 
                        alt="Permit QR Code" 
                        className="w-32 h-32 border rounded"
                      />
                      <Button
                        onClick={() => downloadQRCode(permit.qrCode!, permit._id)}
                        size="sm"
                        variant="outline"
                      >
                        Download QR Code
                      </Button>
                      <div className="text-xs text-gray-500 text-center">
                        Show this QR code when entering the destination
                      </div>
                    </div>
                  )}

                  {permit.status === 'pending' && (
                    <div className="flex items-center justify-center">
                      <div className="text-center text-yellow-600">
                        <div className="text-lg">⏳</div>
                        <div className="text-sm">Awaiting approval</div>
                        <div className="text-xs text-gray-500 mt-1">
                          You'll receive your QR code once approved
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <Button onClick={fetchPermits} variant="outline">
          Refresh Permits
        </Button>
      </div>
    </div>
  );
};

export default MyPermits;