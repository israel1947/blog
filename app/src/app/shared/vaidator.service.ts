import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class VaidatorService {

  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public username: string = '([a-zA-Z]+)';
  public passwordPattern: string = '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{7,}$';

  emailErrorMessage(form:FormGroup){
    const errors = form.get('email')?.errors;
    if (errors?.['required']) {
      return 'Por favor ingrese un correo electronico';
    } else if (errors?.['pattern']) {
      return 'Por favor ingrese un coreo valido';
    } else if (errors?.['emailInUse']) {
      return 'El correo ya esta en uso';
    }
    return '';
  }
  passwordErrorMessage(form:FormGroup){
    const errors = form.get('password')?.errors;
    if (errors?.['required']) {
      return 'Por favor ingrese una contraseña';
    } else if (errors?.['pattern']) {
      return 'the password must contain more than 6 characters, capital letters, numbers, and special characters.';
    }
    return '';
  }
}
