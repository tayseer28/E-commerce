import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriesService {

  private readonly _HttpClient = inject(HttpClient);
  constructor() { }

  getSpecificSubCategory(subCategoryId: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/subcategories/${subCategoryId}`)
  }

  getSubCategoriesByCategory(categoryId: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories/${categoryId}/subcategories`)
  }


}
