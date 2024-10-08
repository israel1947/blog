import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, Renderer2, viewChild, ViewChild } from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { PerfilComponent } from '../../components/perfil/perfil.component';
import { RouterLink } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { LoginComponent } from '../../auth/login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { responseData } from '../../interfaces/interface';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatAccordion, PerfilComponent, RouterLink,MatButtonModule, MatDialogModule],
  changeDetection:ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {

  @ViewChild('menuItems') menuItems!: ElementRef;
  private click = false;
  isOpen = false;
  private render: Renderer2 = inject(Renderer2);
  accordion = viewChild.required(MatAccordion);
  readonly dialog = inject(MatDialog);
  perfil: responseData | null = null;

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.perfil = JSON.parse(storedUser);
    }
  }

  funMenu() {
    this.click = !this.click;
    if (this.click == true) {
      this.render.addClass(this.menuItems.nativeElement, "enable");
    } else {
      this.render.removeClass(this.menuItems.nativeElement, "enable");
    }
  }
  openDialogLogin() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed()
  }

  openDialogRegister(){
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed()
  }

 
}
