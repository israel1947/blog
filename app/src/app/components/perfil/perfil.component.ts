import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { responseData, User } from '../../interfaces/interface';
import { AuthService } from '../../auth/auth.service';
import { ImagenProfilePipe } from '../../pipes/imagen-profile.pipe';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../shared/snackbar.service';
import { Router, RouterModule } from '@angular/router';
import { ModalEditPerfilComponent } from '../modal-edit-perfil/modal-edit-perfil.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RegisterComponent } from '../../auth/register/register.component';

@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule, 
    ImagenProfilePipe, 
    MatButtonModule, 
    RouterModule,
    MatDividerModule
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfilComponent implements OnInit {
  isOpen: Boolean = false;
  perfil: responseData | null | any = null;
  randomColor: string = '';

  user: Partial<responseData> = {}

  private readonly authService: AuthService = inject(AuthService);
  private snakService: SnackbarService = inject(SnackbarService);
  private router: Router = inject(Router);
  readonly dialog = inject(MatDialog);

  constructor(private changeDetettor: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadProfile();

  }

  loadProfile() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.perfil = JSON.parse(storedUser);
      this.randomColor = this.generateRandomColor();
    }
    this.getUserData();
  }

  getUserData() {
    this.authService.getUser().then((user) => {
      this.user = user;
      this.changeDetettor.detectChanges();
    }).catch((error) => {

    })
  }

  getInitials(name: string | undefined, lastName: string | undefined): string {
    const nameInitial = name ? name.charAt(0).toUpperCase() : '';
    const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${nameInitial}${lastNameInitial}`;
  }

  funMenuPerfil() {
    this.isOpen = !this.isOpen;
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async logout() {
    this.snakService.openDialog().afterClosed().subscribe(async (close: boolean) => {
      if (close) {
        await this.authService.clearSession();
        window.location.reload();
      }
    });
  }

  getRouterRoleUser(role:any) {

    if (role === 'Admin') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed();
  }
}
