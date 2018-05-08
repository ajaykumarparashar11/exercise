import { Component } from '@angular/core';

import { AuthService, SocialUser } from "angular4-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";

import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private user: SocialUser;
  private loggedIn: boolean;
  title = 'Exercise Management Tool';
  
  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      
      if (this.loggedIn) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
  
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.router.navigate(['/dashboard']);
  }
  
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.router.navigate(['/dashboard']);
  }
 
  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
