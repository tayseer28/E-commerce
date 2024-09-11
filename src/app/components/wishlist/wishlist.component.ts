import { Component, inject, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/servcices/wishlist/wishlist.service';
import { RouterLink } from '@angular/router';
import { TrimTextPipe } from '../../core/pipes/trimText/trim-text.pipe';
import { CurrencyPipe } from '@angular/common';
import { IWishlist } from '../../core/interfaces/iwishlist';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, TrimTextPipe, CurrencyPipe, TranslateModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {

  private readonly _WishlistService = inject(WishlistService);
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)

  // wishlistProducts: IWishlist[] = [];
  wishlistProducts: WritableSignal<IWishlist[]> = signal([]);
  quantity: WritableSignal<number> = signal(0);

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(): void {
    this._WishlistService.getWishlist().subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistProducts.set(res.data);
        this.quantity.set(this.wishlistProducts().length)
        // console.log(this.wishlistProducts);
      },
      
    })
  }
  // addProductToWishlist(prodId: string): void {
  //   this._WishlistService.addProductToWishlist(prodId).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this._ToastrService.success(res.message);
  //       this._WishlistService.wishListQuantity.set(res.data.length);
  //       this._WishlistService.loadWishlist();
  //     },
  //   })
  // }

  removeProductFromWishlist(prodId: string): void {
    this._WishlistService.removeProductFromWishlist(prodId).subscribe({
      next: (res) => {
        console.log(res);
        this.getWishlist();
        this._ToastrService.success('Product removed from wishlist');
        this._WishlistService.wishListQuantity.set(res.data.length);
        this._WishlistService.loadWishlist();
      },
    })
  }

  addToCart(prodId: string): void {
    this._CartService.addToCart(prodId).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success('Product added to cart');
      },
    })
  }

}
