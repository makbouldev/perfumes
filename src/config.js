// Config file for API endpoints
// Uses localhost for local development, and relative path for Vercel production
export const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : '';

