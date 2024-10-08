import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroments';
import { GoogleUser, responseData, User } from '../interfaces/interface';
import { HttpClient } from '@angular/common/http';
import { catchError, map, pipe, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.URL;
  private _auth: any;
  private http: HttpClient = inject(HttpClient);



  get auth() {
    return { ...this._auth };
  }

  createUser(user: Omit<User[], "id">) {
    return this.http.post<User>(`${this.baseUrl}/users`, user)
      .pipe(
        tap(auth => this._auth = auth),
        tap(auth => this.saveStorage(auth)),
      );
  }

  createUserWithGoogle(user:GoogleUser){
    return this.http.post<GoogleUser>(`${this.baseUrl}/users`, user)
    .pipe(
      tap(auth =>  this.saveStorage(auth)),
    );
  }

  login(email: string, password: string) {
    const data = { email, password };
    return this.http.post<responseData>(`${this.baseUrl}/users`, data)
    .pipe(
      /* tap(auth => this._auth = auth), */
      tap(resp=>{
        if (resp) {
          this.saveStorage(resp);
        }
      }),
      map(resp=>resp),
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(() => new Error('Login failed'));
      }) 
    )
  }

   saveStorage(auth:any){
    return localStorage.setItem('user', JSON.stringify(auth))
  }
}
