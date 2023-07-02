import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { Status } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  status: Status = { status: true };

  loginForm: FormGroup = new FormGroup({
    login: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  login() {
    if (!this.loginForm.valid) {
      return;
    }
  
    this.authService.loggin(this.loginForm.controls['login'].value, this.loginForm.controls['password'].value).subscribe((result: Status) => {
      this.status = result
        if (this.status?.status) {
          this.authService.login(this.loginForm.value)
            .pipe(
              tap(() => this.router.navigate(['../../protected/dashboard'], {queryParams: {login: this.loginForm.controls['login'].value}}))
            )
            .subscribe();

        }
            else{
              return;
            }
          });
      
          }

}
