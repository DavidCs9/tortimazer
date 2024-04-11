import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  users = [{ username: 'tortilleriaGutierrez', password: 'tortillitas' }];

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private router: Router) {}

  handleLogin() {
    if (this.loginForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill all the fields',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      this.loginForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.loginForm.value;
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      Swal.fire({
        title: 'Success',
        text: 'You have successfully logged in',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      window.localStorage.setItem('token', 'logged');
      this.router.navigate(['/reports']);
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Invalid credentials',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }
}
