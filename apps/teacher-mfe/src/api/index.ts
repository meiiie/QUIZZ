// ========================================================================
// FILE: src/api/index.ts
// PURPOSE: Main API module export
// DESCRIPTION: Central export for all API functionality
// ========================================================================

// ============= CORE EXPORTS =============
export { httpClient, api } from './httpClient';
export { ENDPOINTS, buildQueryString, buildEndpointWithQuery } from './endpoints';

// ============= SERVICE EXPORTS =============
export * from './services';
export { default as apiServices } from './services';

// ============= TYPE EXPORTS (Explicit to avoid conflicts) =============
export type {
  Student,
  Quiz,
  Department,
  ApiResponse,
  PaginationParams,
} from '../types';

// ============= CONVENIENCE EXPORTS =============
import { httpClient } from './httpClient';
import { ENDPOINTS } from './endpoints';
import apiServices from './services';

// Main API object for easy usage
export const API = {
  client: httpClient,
  endpoints: ENDPOINTS,
  services: apiServices,
} as const;

export default API;
