import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VaidatorService } from '../../shared/vaidator.service';
import { RouterLink } from '@angular/router';
import { EmailValidatorService } from '../../shared/email-validator.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { CommonModule } from '@angular/common';
import { LoginWithSocialMediaComponent } from '../login-with-social-media/login-with-social-media.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatDialogModule, LoginWithSocialMediaComponent, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  showPassword: boolean = false;
  isLoading = false;
  selectedFileBase64: string | null = null; 

  private authService: AuthService = inject(AuthService);
  private formBilder: FormBuilder = inject(FormBuilder);
  private validatorServices: VaidatorService = inject(VaidatorService);
  private emailValidatorServices: EmailValidatorService = inject(EmailValidatorService);
  private snackBarService: SnackbarService = inject(SnackbarService);

  registerForm: FormGroup = this.formBilder.group({
    name: ['', [Validators.required, Validators.pattern(this.validatorServices.username)]],
    last_name: ['', [Validators.required, Validators.pattern(this.validatorServices.username)]],
    email: ['', [Validators.required, Validators.pattern(this.validatorServices.emailPattern)], [this.emailValidatorServices.validate.bind(this.emailValidatorServices)]],
    password: ['', [Validators.required, Validators.pattern(this.validatorServices.passwordPattern)]],
    photo: ['']
  });

  valiedField(field: string) {
    return this.registerForm.get(field)?.invalid
      && this.registerForm.get(field)?.touched;
  }

  get emailErrorMessage(): string {
    return this.validatorServices.emailErrorMessage(this.registerForm);
  };
  get passwordErrorMessage(): string {
    return this.validatorServices.passwordErrorMessage(this.registerForm);
  };


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = reader.result as string; // Almacenar el archivo en base64
      };
      reader.readAsDataURL(file); //archivo convertido  a base64
    }
  }

  register() {
    if (this.registerForm.invalid) {
      this.snackBarService.alertBar('All field is required', 'Aceptar');
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.registerForm.value,
      photo: this.selectedFileBase64 // Agregando base64 al form
    };

    this.isLoading = !this.isLoading;
    this.authService.createUser(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBarService.alertBar('User created sussefully!', 'Aceptar');
        this.registerForm.reset();
        this.selectedFileBase64 = null;
      }, error: (err) => {
        this.snackBarService.alertBar('Failed to create user.', 'Aceptar');
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  };


}
