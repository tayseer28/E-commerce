import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { OwnTranslateService } from '../../core/services/ownTranslate/own-translate.service';
// import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
// import { BrowserModule } from '@angular/platform-browser';
// import { RxwebValidators } from '@rxweb/reactive-form-validators';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, TranslateModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  //inject the AuthService
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router)
  private readonly _OwnTranslateService = inject(OwnTranslateService)

  errorMsg: string = ""
  successMsg: string = ""
  isLoading: boolean = false;//to show the spinner when the form is submitting
  rgisterSubmitSub!: Subscription;

  registerForm: FormGroup = this._FormBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^[A-Z].{5,}$/)]],
    rePassword: [null],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  }, {validators: this.confirmPassword
  })

  // create the formGroup
  // registerForm: FormGroup = new FormGroup({
  //   //we use array to store the validators
  //   name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),//first parameter is the default value, second parameter is the validators i want to apply
  //   email: new FormControl(null, [Validators.required, Validators.email]),
  //   // if we want to create custome validator (regex) we can use pattern
  //   password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z].{5,}$/)]),
  //   rePassword: new FormControl(null),
  //   phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),

  // }, this.confirmPassword);//we place the custome validator in the second parameter of the formGroup

  registerSubmit(): void{
    //we make sure form is valid before submitting
    if(this.registerForm.valid){
      this.isLoading = true;

      //to get the values and info of the form, they will be stored in the registerForm object
      this.rgisterSubmitSub = this._AuthService.setRegisterForm(this.registerForm.value).subscribe({
        next: (res) => {
          //navigate to the login if meassage is success
          if(res.message === 'success'){
            this.successMsg = res.message;
            this.errorMsg = "";
            setTimeout(() => {
              this._Router.navigate(['/login']);
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
      this.registerForm.setErrors({mismatch: true});
      this.registerForm.markAllAsTouched();
    }


  }

  // custome validation for confirm password
  //takes the formGroup as a parameter, but if we make the datatype formGroup it will give us an error, so we use abstractControl
  //cause we are not sure if it will be a formGroup or a formControl so abstractControl is the parent class of both
  confirmPassword(g: AbstractControl){

    if(g.get('password')?.value === g.get('rePassword')?.value){
      //we return null cause the pattern of errors in the formGroup is null if there is no error and object if there is an error
      return null;
    }
    else{
      //this is the pattern of errors in the formGroup, and it is known to be named misMatch but it is not a keyword
      return {mismatch: true};
    }
  }
  ngOnDestroy(): void {
    this.rgisterSubmitSub?.unsubscribe();
    
  }
}
