// Centralized API base URL for frontend
// Declare process as any to avoid TypeScript linter error in CRA
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://lexica-production-01d0.up.railway.app');

export { API_BASE_URL }; 