import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../shared/snackbar.service';
import { VaidatorService } from '../../shared/vaidator.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService: AuthService = inject(AuthService);
  private snakBar: SnackbarService = inject(SnackbarService);
  private formBilder: FormBuilder = inject(FormBuilder);
  private validatorServices: VaidatorService = inject(VaidatorService);

  isLoading = false;


  loginForm: FormGroup = this.formBilder.group({
    email: ['', [Validators.required, Validators.pattern(this.validatorServices.emailPattern)]],
    password: ['', [Validators.required, Validators.pattern(this.validatorServices.passwordPattern)]],
  });


  valiedField(field: string) {
    return this.loginForm.get(field)?.invalid
      && this.loginForm.get(field)?.touched;
  }

  get emailErrorMessage(): string {
    return this.validatorServices.emailErrorMessage(this.loginForm);
  };
  get passwordErrorMessage(): string {
    return this.validatorServices.passwordErrorMessage(this.loginForm);
  };

  async login() {
    const { email, password } = this.loginForm.value;
    console.log(email, password);

    if (this.loginForm.invalid) {
      this.snakBar.alertBar('Incorrect credentials!')
      return
    };

    this.isLoading = !this.isLoading;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.snakBar.alertBar('Logging in..');
        this.loginForm.reset();
      }, error: (err) => {
        this.snakBar.alertBar('Incorrect credentials!')
      }
    })

  }

}
