import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { responseData, User } from '../../interfaces/interface';
import { AuthService } from '../../auth/auth.service';
import { ImagenProfilePipe } from '../../pipes/imagen-profile.pipe';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../shared/snackbar.service';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ImagenProfilePipe, MatButtonModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfilComponent {
  isOpen: Boolean = false;
  perfil: responseData | null | any = null;
  randomColor: string = '';

  user: Partial<responseData> = {}

  private readonly authService: AuthService = inject(AuthService);
  private snakService: SnackbarService = inject(SnackbarService);

  constructor(){
    this.loadProfile();
  }

  async loadProfile() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.perfil = JSON.parse(storedUser);
      this.randomColor = this.generateRandomColor();
    }
    this.getUserData();
  }

  async getUserData() {
    this.user = await this.authService.getUser();
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
    this.snakService.openDialog().afterClosed().subscribe(async(close:boolean)=>{
      if (close) {
        await this.authService.clearSession();
        window.location.reload();
      }
    });
  }
}
