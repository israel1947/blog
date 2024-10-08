import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroments';
import { delay, map, Observable } from 'rxjs';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { User } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator {

  private http: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.URL;

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`)
      .pipe(
        delay(1000),
        map((resp) => {
          return (resp.length === 0) ? null : { emailInUse: true }
        })
      );
  };
}
