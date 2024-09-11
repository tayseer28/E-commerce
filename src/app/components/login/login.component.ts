import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NgClass, NgStyle } from '@angular/common';
import { OwnTranslateService } from '../../core/services/ownTranslate/own-translate.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router)
  private readonly _OwnTranslateService = inject(OwnTranslateService)
  loginSubmitSub!: Subscription;


  isLoading: boolean = false;
  errorMsg: string = "";
  successMsg: string = "";

  loginForm: FormGroup = this._FormBuilder.group ({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z].{5,}$/)])

  })

  
  loginSubmit(): void{
    if(this.loginForm.valid){
      this.isLoading = true;

      //to get the values and info of the form, they will be stored in the loginForm object
      this.loginSubmitSub = this._AuthService.setLoginForm(this.loginForm.value).subscribe({
        next: (res) => {
          //navigate to the login if meassage is success
          if(res.message === 'success'){
            this.successMsg = res.message;
            this.errorMsg = "";
            setTimeout(() => {
              //1-save the token in the local storage
              localStorage.setItem('token', res.token);

              //2-decode the token
              this._AuthService.saveToken();

              //3- navigate to the home page
              this._Router.navigate(['/home']);
            }, 2000);
          } 

          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err.error.message; 
          console.log(err);
          this.isLoading = false;
        }
      })
    }
    else{
      this.loginForm.setErrors({mismatch: true});
      this.loginForm.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    // if we dont add the ? it will throw an error
    this.loginSubmitSub?.unsubscribe();
    
  }

}
