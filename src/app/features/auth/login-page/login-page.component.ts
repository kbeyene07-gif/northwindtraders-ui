import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h3 class="mb-2">Northwind Traders</h3>
              <p class="text-muted mb-4">Sign in to continue</p>

              <button class="btn btn-primary w-100" (click)="login()">
                Sign in with Microsoft
              </button>

              <div class="text-muted small mt-3">
                You’ll be redirected to Microsoft to sign in.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent implements OnInit {
  constructor(private msal: MsalService, private router: Router) {}

  ngOnInit(): void {
    if (this.msal.instance.getAllAccounts().length > 0) {
      this.router.navigate(['/customers']);
    }
  }

  login(): void {
    this.msal.loginRedirect();
  }
}
