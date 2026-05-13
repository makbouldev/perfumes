// Config file for API endpoints
// Uses localhost for local development, and Vercel's multi-service route for production
export const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : '/_/backend';
