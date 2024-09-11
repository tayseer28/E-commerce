import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly _HttpClient = inject(HttpClient);
  cartQuantity: WritableSignal<number> = signal(0)
  // header: any = { token: localStorage.getItem('token') };
  constructor() { }

  addToCart(prodId: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/cart`,
      {
        "productId": prodId
      },

    );
  }

  getCartProducts(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/cart`,

    )
  }

  updateProductQuantity(prodId: string, newCount: number): Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}/api/v1/cart/${prodId}`,
      {
        "count": newCount
      },

    )
  }

  deleteCartProduct(prodId: string): Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart/${prodId}`,

    )
  }

  clearCart(): Observable<any>{

    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart`,

    )
  }
}
