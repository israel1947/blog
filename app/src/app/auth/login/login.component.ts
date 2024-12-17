import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../shared/snackbar.service';
import { VaidatorService } from '../../shared/vaidator.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, CommonModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService: AuthService = inject(AuthService);
  private snakBar: SnackbarService = inject(SnackbarService);
  private formBilder: FormBuilder = inject(FormBuilder);
  private validatorServices: VaidatorService = inject(VaidatorService);
  readonly dialogRef = inject(MatDialogRef<LoginComponent>);

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
    this.isLoading = !this.isLoading;
    const valid = await this.authService.login(email, password);
    this.isLoading = false;
    if (valid) {
      this.snakBar.alertBar('Logging in..');
      this.dialogRef.close(true);
      window.location.reload();
    } else {
      this.snakBar.alertBar('Incorrect credentials!')
    }
  }

}
