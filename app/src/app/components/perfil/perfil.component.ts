import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { responseData } from '../../interfaces/interface';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  isOpen: Boolean = false;
  perfil: responseData | null = null;
  randomColor: string = '';

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.perfil = JSON.parse(storedUser);
    }
    this.randomColor = this.generateRandomColor();
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
}
