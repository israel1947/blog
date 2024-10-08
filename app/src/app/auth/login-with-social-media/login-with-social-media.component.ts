import { Component, inject } from '@angular/core';
import { GoogleUser } from '../../interfaces/interface';
import { environment } from '../../../enviroments/enviroments';
import { AuthService } from '../auth.service';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  selector: 'app-login-with-social-media',
  standalone: true,
  imports: [GoogleSigninButtonModule],
  templateUrl: './login-with-social-media.component.html',
  styleUrl: './login-with-social-media.component.scss'
})
export class LoginWithSocialMediaComponent {
  client_id: string = environment.client_id;
  data!:GoogleUser;
  private authServiceRegister:AuthService=inject(AuthService);
  private authService: SocialAuthService = inject(SocialAuthService);
  private snackBarService: SnackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.data={
        id:user.id,
        name:user.firstName,
        last_name:user.lastName,
        email:user.email,
        photo:user.photoUrl
      }
      this.authServiceRegister.createUserWithGoogle(this.data).subscribe({
        next:()=>{
          this.snackBarService.alertBar('User created sussefully!', 'Aceptar');
        }, error: (err) => {
          console.log(err);
          this.snackBarService.alertBar('Failed to create user.', 'Aceptar');
        }
      })
    });
  }

}
