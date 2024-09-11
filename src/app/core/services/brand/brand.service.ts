import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor() { }

  private readonly _HttpClient = inject(HttpClient);

  getAllBrands(): Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/brands`)
  }
  getSpecificBrand(brandId: string): Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/brands/${brandId}`)
  }

  


}
