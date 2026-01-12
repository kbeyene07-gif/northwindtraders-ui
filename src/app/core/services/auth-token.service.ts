import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_SCOPE } from '../auth/msal-config';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  constructor(private msal: MsalService) {}

  getToken$(): Observable<string | null> {
    const account =
      this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];

    if (!account) return of(null);

    this.msal.instance.setActiveAccount(account);

    return from(
      this.msal.instance.acquireTokenSilent({
        account,
        scopes: [API_SCOPE]
      })
    ).pipe(
      map(r => r.accessToken),
      catchError(err => {
        console.error('Token acquisition failed:', err);
        return of(null);
      })
    );
  }
}
