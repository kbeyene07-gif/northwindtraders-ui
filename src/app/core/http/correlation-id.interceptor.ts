import { HttpInterceptorFn } from '@angular/common/http';

const HEADER = 'X-Correlation-Id';
const STORAGE_KEY = 'northwind.correlationId';

// One correlationId per browser tab/session (good enough + stable for debugging)
function getOrCreateCorrelationId(): string {
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  // browser-safe GUID
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  sessionStorage.setItem(STORAGE_KEY, id);
  return id;
}

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  // Don’t overwrite if caller already set it
  if (req.headers.has(HEADER)) return next(req);

  const correlationId = getOrCreateCorrelationId();
  const cloned = req.clone({
    setHeaders: { [HEADER]: correlationId },
  });

  return next(cloned);
};
