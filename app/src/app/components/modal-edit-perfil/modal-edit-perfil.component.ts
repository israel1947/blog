import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { responseData } from '../../interfaces/interface';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FileUtils } from '../../shared/clases/file-helper';
import { VaidatorService } from '../../shared/vaidator.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  selector: 'app-modal-edit-perfil',
  imports: [MatDialogModule, ReactiveFormsModule, CommonModule, MatButtonModule],
  templateUrl: './modal-edit-perfil.component.html',
  styleUrl: './modal-edit-perfil.component.scss'
})
export class ModalEditPerfilComponent implements OnInit {
  user: Partial<responseData> = {};
  fieldsUserData: Array<string> = ['name', 'last_name', 'email', 'suscription', 'role', 'password']
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


  addNewCreator: FormGroup = this.formBilder.group({
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
    FileUtils.onFileSelected(event, this.addNewCreator, 'photo', (preview) => {
      this.previewImgCover = preview;
    });
  }


  async addNewCreatorUser() {

    if (this.addNewCreator.invalid) {
      return;
    };

    const formData = FileUtils.loadFileSelected('photo', this.addNewCreator, this.fieldsUserData);
    this.isLoading = !this.isLoading;
    const regiasterValid = await this.auth.createUser(formData)
      .catch((error) => {
        this.isLoading = false;
        this.snackBarService.alertBar(error.message, 'Aceptar');
      });

    if (regiasterValid) {
      this.isLoading = false;
      this.snackBarService.alertBar('User created sussefully!', 'Aceptar');
      this.addNewCreator.reset();
      this.dialogRef.close(true);
    } else {
      this.isLoading = false;
      this.snackBarService.alertBar('Failed to create user.', 'Aceptar');
    }
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
