import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroments';
import { GoogleUser, Post, responseData, User, UserPost } from '../interfaces/interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { SnackbarService } from '../shared/snackbar.service';
import {  Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.URL;
  private _auth: any;
  private http: HttpClient = inject(HttpClient);
  private snackBarService: SnackbarService = inject(SnackbarService);
  private router: Router = inject(Router);

  token!: string | null;
  private user: Partial<responseData> = {};
  private redirectUrl: string = '';


  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  navigateToRedirectUrl() {
    const targetUrl = this.redirectUrl || '/home';
    this.router.navigateByUrl(targetUrl);
  }


  get auth() {
    return { ...this._auth };
  }

  createUser(user: FormData) {
    return new Promise(resolve => {
      this.http.post(`${this.baseUrl}/auth/create`, user)
        .subscribe(async (resp: any) => {
          if (resp['ok'] && resp['user'].access_token) {
            await this.saveToken(resp['user'].access_token);
            resolve(true);
          } else {
            this.clearSession();
          }
        }, () => {
          this.snackBarService.alertBar('Something went wrong please try again!');
          this.clearSession();
        });
    })
  }

  createUserWithGoogle(user: GoogleUser) {
    return this.http.post<GoogleUser>(`${this.baseUrl}/users`, user)
      .pipe(
      /* tap(auth => this.saveStorage(auth)), */
    );
  }

  login(email: string, password: string) {
    const data = { email, password };

    return new Promise((resolve) => {
      this.http.post(`${this.baseUrl}/auth/login`, data)
        .subscribe(async (resp: any) => {
          if (resp['ok'] && resp['user'].access_token) {
            await this.saveToken(resp['user'].access_token);
            resolve(true);
          } else {
            resolve(false);
            this.clearSession();
          }
        },()=>{
          this.snackBarService.alertBar('User not found or password is missing!');
          this.clearSession();
          resolve(false);

        })
    });
  }

  async clearSession() {
    this.token = null;
    this.user = {};
    localStorage.clear();
  }

  //get user information
  async getUser() {
    if (!this.user._id) {
      await this.validateToken();
    }
    return { ...this.user };
  }


  async saveToken(token: string) {
    this.token = token;
    localStorage.setItem('user', JSON.stringify(token));
    await this.validateToken();
  }

  async loadToken() {
    this.token = localStorage.getItem('user') || null;
  }

  async validateToken(): Promise<boolean> {
    await this.loadToken();


    if (!this.token) {
      return Promise.resolve(false);
    }

    //const tokenPba = this.token ? this.token.replace(/"/g, ''): ''

    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token ? this.token.replace(/"/g, '') : ''}`
      });


      this.http.get(`${this.baseUrl}/auth/profile`, { headers })
        .subscribe(resp => {
          if (resp) {
            this.user = resp;
            resolve(true);
          } else {
            this.token = null;  // Reset token if not valid
            localStorage.clear();
            resolve(false);
          }
        });
    })
  };

}
