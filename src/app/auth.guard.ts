import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (token) {
    return true;
  }
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'You must be logged in to access this page!',
  });
  router.navigate(['/login']);
  return false;
};
