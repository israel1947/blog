import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VaidatorService } from '../../shared/vaidator.service';
import { RouterLink } from '@angular/router';
import { EmailValidatorService } from '../../shared/email-validator.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { CommonModule } from '@angular/common';
import { LoginWithSocialMediaComponent } from '../login-with-social-media/login-with-social-media.component';
import { responseData } from '../../interfaces/interface';

@Component({
    selector: 'app-register',
    imports: [MatDialogModule, LoginWithSocialMediaComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  user: Partial<responseData> = {};
  showPassword: boolean = false;
  isLoading = false;
  selectedFileBase64: string | null = null;
  role: Array<string> = ['Admin', 'User'];
  selectedFile: File | null = null;

  private authService: AuthService = inject(AuthService);
  private formBilder: FormBuilder = inject(FormBuilder);
  private validatorServices: VaidatorService = inject(VaidatorService);
  private emailValidatorServices: EmailValidatorService = inject(EmailValidatorService);
  private snackBarService: SnackbarService = inject(SnackbarService);
  readonly dialogRef = inject(MatDialogRef<RegisterComponent>);

  registerForm: FormGroup = this.formBilder.group({
    name: ['', [Validators.required, Validators.pattern(this.validatorServices.username)]],
    last_name: ['', [Validators.required, Validators.pattern(this.validatorServices.username)]],
    email: ['', [Validators.required, Validators.pattern(this.validatorServices.emailPattern)] /* [this.emailValidatorServices.validate.bind(this.emailValidatorServices)] */],
    password: ['', [Validators.required, Validators.pattern(this.validatorServices.passwordPattern)]],
    photo: [null],
    suscription: [false],
    role: ['User', [Validators.required]],
  });

  ngOnInit() {
    this.authService.getUser().then((user) => {
      this.user = user;
    });
  }
  

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

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.length) {
      this.selectedFile = fileInput.files[0];
      this.registerForm.patchValue({ photo: this.selectedFile });
    }
  }

  async register() {
    if (this.registerForm.invalid) {
      this.snackBarService.alertBar('All field is required', 'Aceptar');
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const formFields = ['name', 'last_name', 'email', 'password', 'suscription','role'];
    formFields.map(field=>{
      const value = this.registerForm.get(field)?.value;
      if (value) {
       formData.append(field,value); 
      }
    });

    const photo = this.registerForm.get('photo')?.value;
     if (photo) {
       formData.append('photo', photo); // add file
     }

    this.isLoading = !this.isLoading;
    const regiasterValid = await this.authService.createUser(formData);
    if (regiasterValid) {
      this.isLoading = false;
      this.snackBarService.alertBar('User created sussefully!', 'Aceptar');
      this.registerForm.reset();
      this.dialogRef.close(true);
      window.location.reload();
    } else {
      this.snackBarService.alertBar('Failed to create user.', 'Aceptar');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  };


}
