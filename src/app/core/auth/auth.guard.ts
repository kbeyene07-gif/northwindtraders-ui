import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = () => {
  const msal = inject(MsalService);
  const router = inject(Router);

  const hasAccount = msal.instance.getAllAccounts().length > 0;

  if (!hasAccount) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
