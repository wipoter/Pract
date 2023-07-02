import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '../../custom-validator';
import { AuthService } from '../../services/auth-service/auth.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { Status } from '../../interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  status: Status = { status: true };

  registerForm = new FormGroup({
    login: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required]),
    isPublic: new FormControl(null),
    password: new FormControl(null, [Validators.required]),
    passwordConfirm: new FormControl(null, [Validators.required])
  },
    { validators: CustomValidators.passwordsMatching }
  )

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  register() {
    if (!this.registerForm.valid) {
      return;
    }
  
    this.authService.reg(
      this.registerForm.controls['login'].value,
      this.registerForm.controls['date'].value,
      this.registerForm.controls['password'].value,
      this.registerForm.controls['isPublic'].value
    ).subscribe((result: Status) => {
      this.status = result;
      if (this.status?.status) {
        this.authService.register(this.registerForm.value).pipe(
          tap(() => this.router.navigate(['../login']))
        ).subscribe();
      } else {
        return;
      }
    });
  }

}
