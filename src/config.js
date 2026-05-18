// Config file for API endpoints
// Uses localhost for local development, and Railway backend for production
export const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://perfumes-production-c777.up.railway.app';
