// Central API Base URL Configuration
// In development & with Vite proxy on Render, relative path "" routes through Vite proxy
// For direct cross-origin API access, VITE_API_URL can be set
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || "";
