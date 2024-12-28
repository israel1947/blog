import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { responseData } from '../../interfaces/interface';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ImagenProfilePipe } from '../../pipes/imagen-profile.pipe';
import { FileUtils } from '../../shared/clases/file-helper';
import { VaidatorService } from '../../shared/vaidator.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modal-edit-perfil',
  imports: [MatDialogModule, ReactiveFormsModule, CommonModule, MatButtonModule, ImagenProfilePipe],
  templateUrl: './modal-edit-perfil.component.html',
  styleUrl: './modal-edit-perfil.component.scss'
})
export class ModalEditPerfilComponent implements OnInit {
  user: Partial<responseData> = {};
  fieldsUserData: Array<string> = ['name', 'last_name', 'email', 'photo', 'suscription', 'role', 'password']
  role: Array<string> = ['Admin', 'User'];
  showPassword: boolean = false;
  isLoading = false;
  previewImgCover = FileUtils.previewImage;

  fileSelected = FileUtils.onFileSelected;

  private auth: AuthService = inject(AuthService);
  private formBilder: FormBuilder = inject(FormBuilder)
  readonly dialogRef = inject(MatDialogRef<ModalEditPerfilComponent>);
  private validatorServices: VaidatorService = inject(VaidatorService);
  private snackBarService: SnackbarService = inject(SnackbarService);


  registerFormAdmin: FormGroup = this.formBilder.group({
    name: ['', [Validators.required, Validators.pattern(this.validatorServices.username)]],
    last_name: ['', [Validators.required, Validators.pattern(this.validatorServices.username)]],
    email: ['', [Validators.required, Validators.pattern(this.validatorServices.emailPattern)]],
    password: ['', [Validators.required, Validators.pattern(this.validatorServices.passwordPattern)]],
    photo: [null],
    suscription: [false],
    role: [''],
  });

  ngOnInit() {
    this.auth.getUser().then((user) => {
      this.user = user;
    });
  }


  onFileSelectedPreview(event: Event) {
    FileUtils.onFileSelected(event, this.registerFormAdmin, 'photo', (preview) => {
      this.previewImgCover = preview;
    });
  }


  updateUserInformation() {

    if (this.registerFormAdmin.invalid) {
      return;
    };

    const formData = FileUtils.loadFileSelected('photo', this.registerFormAdmin, this.fieldsUserData);
    const data = {
      name: formData.get('name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
      password: formData.get('password'),
      photo: formData.get('photo'),
      suscription: formData.get('suscription'),
      role: formData.get('role'),
    };

    this.isLoading = !this.isLoading;
    this.auth.updateUser(this.user._id, data).then((resp: any) => {
      this.isLoading = false;
      this.snackBarService.alertBar('User Updated sussefully!', 'Aceptar');
      this.dialogRef.close(true);
    });
  }

  getInitials(name: string | undefined, lastName: string | undefined): string {
    const nameInitial = name ? name.charAt(0).toUpperCase() : '';
    const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${nameInitial}${lastNameInitial}`;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  };

}
