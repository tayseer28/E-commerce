import { IUser } from './../../interfaces/iuser';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HtttpClient = inject(HttpClient);
  private readonly _Router = inject(Router);
  userData: IUser = {} as IUser;
  // userData: IUser = {
  //   id: '',
  //   name: '',
  //   role: '',
  //   iat: 0,
  //   exp: 0
  // }


  //we create intrface if we want to  access the data of object, but in this case we want to send the data to backend only so we don't need to access the data or create an interface
  setRegisterForm(data: object): Observable<any>{
    return this._HtttpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, data)
  }
  setLoginForm(data: object): Observable<any>{
    return this._HtttpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, data)
  }

  saveToken(): void{
    //check if the token is not null
    if(localStorage.getItem('token') != null){
      this.userData = jwtDecode(localStorage.getItem('token')!)   
    }
  }

  //we define it in the service cause we want it to be shred so we could reuse it
  // logOut(): void{
  //   localStorage.removeItem('token');
  //   this.userData = {} as IUser;
  //   //TO DO: call the api to remove the token
  //   //navigate to login
  //   this._Router.navigate(['/login']);

  // }
  logOut(): void {
    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'No, stay logged in'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with log out
        localStorage.removeItem('token');
        this.userData = {} as IUser;
  
        // TO DO: Call the API to remove the token (if needed)
        // Navigate to login page
        this._Router.navigate(['/login']);
  
        Swal.fire(
          'Logged Out!',
          'You have successfully logged out.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User canceled the log out operation
        Swal.fire(
          'Cancelled',
          'You are still logged in.',
          'info'
        );
      }
    });
  }

  //we make the email paramter object cause this is the pattern the backend is expecting
  setEmailForgetPass(email: object): Observable<any>{
    return this._HtttpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, email)
  }

  setCodeForgetPass(code: object): Observable<any>{
    return this._HtttpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, code)
  }

  setNewPass(newPass: object): Observable<any>{
    return this._HtttpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, newPass)
  }
}
