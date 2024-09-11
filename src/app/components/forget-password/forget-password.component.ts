import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {

  private readonly _FlowbitService = inject(FlowbiteService);
  private readonly _FormBuilder = inject(FormBuilder);

  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  isLoading: boolean = false;
  errorMsg: string = "";
  successMsg: string = "";
  step: number = 1;

  verifyEmail: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]]
  })

  verifyCode: FormGroup = this._FormBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
  })

  resetPassword: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required, Validators.pattern(/^[A-Z].{5,}$/)]]
  })



  ngOnInit(): void {
    this._FlowbitService.loadFlowbite(() => {

    });
  }
  verifyEmailSubmit(): void {
    //get the email from the form and set it to the email of third form
    this.isLoading = true;
    let emailValue = this.verifyEmail.get('email')?.value;
    this.resetPassword.get('email')?.patchValue(emailValue);
    this._AuthService.setEmailForgetPass(this.verifyEmail.value).subscribe({
      next: (res) => {
        if (res.statusMsg === 'success') {
          this.successMsg = res.statusMsg;
          this.errorMsg = "";
          this.isLoading = false;
          this.step = 2;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error.message;
        console.log(err);
        this.isLoading = false;
      }
    })
  
  }

  verifyCodeSubmit(): void {
    this.isLoading = true;
    this._AuthService.setCodeForgetPass(this.verifyCode.value).subscribe({
      next: (res) => {
        if (res.status === 'Success') {
          this.successMsg = res.status;
          this.errorMsg = "";
          this.step = 3;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error.message;
        console.log(err);
        this.isLoading = false;

      }
    })
    this.isLoading = false;
  }

  setNewPassSubmit(): void {
    this._AuthService.setNewPass(this.resetPassword.value).subscribe({
      next: (res) => {
        //save the token in the local storage
        localStorage.setItem('token', res.token);
        //decode the token
        this._AuthService.saveToken();
        this._Router.navigate(['/home']);
      },
      // error: (err) => {
      //   console.log(err);
      // }
    })
  }




}
