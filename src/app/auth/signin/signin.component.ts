import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  hidePassword = true;
  signInForm!: FormGroup;

  constructor(private authSvc: AuthService) {}

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required],
      }),
    });
  }

  onSubmit() {
    this.authSvc.login({
      email: this.signInForm.value.email,
      password: this.signInForm.value.password,
    });
  }
}
