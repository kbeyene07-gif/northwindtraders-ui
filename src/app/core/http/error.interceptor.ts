import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiError {
  status: number;
  title?: string;
  detail?: string;
  traceId?: string;
  correlationId?: string;
  errors?: Record<string, string[]>;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let apiError: ApiError = {
        status: error.status,
        title: error.statusText
      };

      if (error.error && typeof error.error === 'object') {
        apiError = {
          ...apiError,
          ...error.error
        };
      }

      console.error('API Error:', apiError);
      return throwError(() => apiError);
    })
  );
