import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = async () => {
  const authService:AuthService = inject(AuthService); 
  const router = inject(Router);
  const user = await authService.getUser()
  if (user &&  user.role === 'Admin') {
    return true;
  }
  router.navigate(['/home']);
  return false;
};