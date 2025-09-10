// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Cấu hình worker với các handler đã định nghĩa
export const worker = setupWorker(...handlers);