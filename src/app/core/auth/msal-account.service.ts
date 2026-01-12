import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Injectable({ providedIn: 'root' })
export class MsalAccountService {
  constructor(private msal: MsalService) {}

  async init(): Promise<void> {
    //  MUST initialize before calling any other MSAL API
    await this.msal.instance.initialize();

    //  Complete redirect flow if returning from login
    const result = await this.msal.instance.handleRedirectPromise();

    if (result?.account) {
      this.msal.instance.setActiveAccount(result.account);
      return;
    }

    //  Fallback: pick first cached account
    const acct =
      this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];

    if (acct) {
      this.msal.instance.setActiveAccount(acct);
    }
  }
}

