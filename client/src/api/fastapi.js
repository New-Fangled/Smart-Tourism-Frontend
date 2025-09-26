import axios from "axios";

// FastAPI backend base URL
const FASTAPI_BASE_URL = "http://localhost:8001";

// Check availability for destination and dates
export const checkAvailability = (checkInDate, checkOutDate, destination) =>
  axios.get(`${FASTAPI_BASE_URL}/availability`, {
    params: {
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      destination: destination
    }
  });

// Create a new booking (permit request)
export const createBooking = (bookingData) =>
  axios.post(`${FASTAPI_BASE_URL}/bookings`, bookingData);

// Get all bookings
export const getAllBookings = (skip = 0, limit = 100) =>
  axios.get(`${FASTAPI_BASE_URL}/bookings`, {
    params: { skip, limit }
  });

// Get booking by ID
export const getBookingById = (bookingId) =>
  axios.get(`${FASTAPI_BASE_URL}/bookings/${bookingId}`);

// Update booking
export const updateBooking = (bookingId, updateData) =>
  axios.put(`${FASTAPI_BASE_URL}/bookings/${bookingId}`, updateData);

// Cancel booking
export const cancelBooking = (bookingId) =>
  axios.put(`${FASTAPI_BASE_URL}/bookings/${bookingId}/cancel`);

// Get bookings by guest email
export const getBookingsByEmail = (guestEmail) =>
  axios.get(`${FASTAPI_BASE_URL}/bookings/guest/${guestEmail}`);

// Search bookings by destination
export const searchBookingsByDestination = (destination) =>
  axios.get(`${FASTAPI_BASE_URL}/bookings/search/destination/${destination}`);

// Search bookings by date range
export const searchBookingsByDateRange = (startDate, endDate) =>
  axios.get(`${FASTAPI_BASE_URL}/bookings/search/date-range`, {
    params: {
      start_date: startDate,
      end_date: endDate
    }
  });

// Admin endpoints for destination limits
export const setDestinationLimit = (limitData) =>
  axios.post(`${FASTAPI_BASE_URL}/admin/destination-limits`, limitData);

export const getDestinationLimits = () =>
  axios.get(`${FASTAPI_BASE_URL}/admin/destination-limits`);

// Health check
export const healthCheck = () =>
  axios.get(`${FASTAPI_BASE_URL}/health`);
