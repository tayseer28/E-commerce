import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { sign } from 'crypto';
import { IWishlist } from '../../interfaces/iwishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  userWishList: WritableSignal<Map<string, boolean>> = signal(new Map<string, boolean>());
  wishlistMap: Map<string, boolean> = new Map<string, boolean>();

  private readonly _HtttpClient = inject(HttpClient);
  wishListQuantity:  WritableSignal<number> = signal(0)
  // header: any = { token: localStorage.getItem('token') };


  addProductToWishlist(prodId: string): Observable<any> {
    return this._HtttpClient.post(`${environment.baseUrl}/api/v1/wishlist`,
      {
        productId : prodId
      },

    )
  }

  removeProductFromWishlist(prodId: string): Observable<any> {
    return this._HtttpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${prodId}`,

    )
  }

  getWishlist(): Observable<any> {
    return this._HtttpClient.get(`${environment.baseUrl}/api/v1/wishlist`,

    )
  }
  loadWishlist(): void {
    this.getWishlist().subscribe({
      next: (res) => {
        console.log("wishlist res", res);
        this.userWishList.set(new Map<string, boolean>());
        res.data.forEach((element: IWishlist) => {
          this.userWishList().set(element.id, true);
        });
        this.wishlistMap = this.userWishList();
      },

    })

  }



  constructor() { }
}
