# Test Booking Integration with Permit Creation

## How it works:

1. **User makes booking** via BookingForm.js → FastAPI
2. **FastAPI creates booking** in MongoDB bookings collection  
3. **FastAPI automatically creates permit request** in MongoDB permits collection
4. **Authority sees permit request** in their dashboard
5. **Authority approves permit** → User gets QR code
6. **User can check permit status** via MyPermits component

## Integration Flow:

```
[User Booking] → [FastAPI Booking] → [Auto Permit Request] → [Authority Dashboard] → [Permit Approval] → [QR Code to User]
```

## What happens when user books:

### Step 1: Booking Creation (FastAPI)
- Creates booking in `bookings` collection
- Updates destination capacity
- **NEW**: Calls `create_permit_request()`

### Step 2: Permit Request Creation (FastAPI)
- Automatically creates permit in `permits` collection with:
  - Guest details from booking
  - Destination reference
  - Status: "pending" 
  - Eco tax calculation
  - Link to original booking

### Step 3: Authority Dashboard (Express.js)
- Shows pending permit requests
- Includes guest info from booking
- Shows booking ID for reference
- **NEW**: Flag to identify booking-generated permits

### Step 4: Permit Approval (Express.js)
- Authority approves permit
- Generates QR code with guest details
- Status changes to "valid"
- **NEW**: Enhanced QR code data

### Step 5: User Notification
- User can check permit status via `/authority/my-permits`
- Gets QR code for approved permits
- **NEW**: MyPermits component shows status

## Database Collections:

### bookings (FastAPI)
```json
{
  "_id": "booking123",
  "guest_name": "John Doe",
  "guest_email": "john@example.com", 
  "destination": "Goa",
  "check_in_date": "2025-01-15",
  "status": "confirmed"
}
```

### permits (Express.js)  
```json
{
  "_id": "permit456",
  "bookingId": "booking123",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "destination": ObjectId("dest789"),
  "status": "pending",
  "qrCode": null,
  "ecoTax": 500
}
```

## API Endpoints:

- `POST /bookings` - Creates booking + auto permit request
- `GET /authority/Dashboard` - Shows pending permits (enhanced)
- `POST /authority/allowing-permits` - Approve permits (enhanced)
- `GET /authority/my-permits` - Check user permit status (NEW)

## Frontend Components:

- `BookingForm.js` - Shows permit info + success message
- `MyPermits.tsx` - User permit status + QR codes (NEW)
- Authority dashboard - Enhanced with booking info

## Benefits:

✅ **Seamless Integration**: Booking automatically creates permit request
✅ **No Extra Steps**: Users don't need separate permit application
✅ **Authority Visibility**: All booking requests appear in authority dashboard  
✅ **QR Code Delivery**: Automated QR code generation and delivery
✅ **Status Tracking**: Users can track permit approval status
✅ **Audit Trail**: Links between bookings and permits maintained