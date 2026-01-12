import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { AuthTokenService } from '../services/auth-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(AuthTokenService);

  return tokenService.getToken$().pipe(
    switchMap((token) => {
      if (!token) return next(req);

      return next(
        req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        })
      );
    })
  );
};
