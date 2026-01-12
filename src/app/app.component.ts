import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
   

      <router-outlet></router-outlet>
  
  `
})
export class AppComponent implements OnInit {
  constructor(private msal: MsalService) {}

  async ngOnInit(): Promise<void> {
    // ✅ Complete the redirect flow
    const result = await this.msal.instance.handleRedirectPromise();
    if (result?.account) {
      this.msal.instance.setActiveAccount(result.account);
    }

    // ✅ If already logged in, set an active account from cache
    const account =
      this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];

    if (account) {
      this.msal.instance.setActiveAccount(account);
    }
  }

}
