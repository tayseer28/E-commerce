import { dirname } from 'node:path';
import { Component, computed, ElementRef, inject, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { TrimTextPipe } from '../../core/pipes/trimText/trim-text.pipe';
import { CurrencyPipe, NgStyle } from '@angular/common';
import { RatingComponent } from "../rating/rating.component";
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/servcices/wishlist/wishlist.service';

@Component({
selector: 'app-products',
  standalone: true,
  imports: [TrimTextPipe, CurrencyPipe, NgStyle, RatingComponent, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {


  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  _WishlistService = inject(WishlistService);

  WishlistCount: Signal<Map<string, boolean>> = computed(() => this._WishlistService.userWishList());

  @ViewChild('lazyLoading') lazyLoadTrigger!: ElementRef;
  isLazyLoaded: boolean = false;

  products: WritableSignal<IProduct[]> = signal([]);

  ngOnInit(): void {

    this.getAllProducts();
    this._WishlistService.loadWishlist();
    console.log(Array.from(this._WishlistService.userWishList()).length);
  }

  getAllProducts(): void {

    this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res.data)
        this.products.set(res.data);
      }
    })
  }

  getProductById(id: string): void {

    this._ProductsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        console.log(res);
      }
    })
  }
  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isLazyLoaded = true;
          observer.unobserve(this.lazyLoadTrigger.nativeElement);
        }
      });
    });
    
    observer.observe(this.lazyLoadTrigger.nativeElement);
  }

  addToCart(prodId: string): void {
    this._CartService.addToCart(prodId).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success('Product added to cart');
        this._CartService.cartQuantity.set(res.numOfCartItems);
      },

    })
  }
  addProductToWishlist(prodId: string): void {
    this._WishlistService.addProductToWishlist(prodId).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message);
        this._WishlistService.wishListQuantity.set(res.data.length);
        this._WishlistService.loadWishlist();
      },

    })
  }
  removeProductFromWishlist(prodId: string): void {
    this._WishlistService.removeProductFromWishlist(prodId).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message);
        this._WishlistService.wishListQuantity.set(res.data.length);
        this._WishlistService.loadWishlist();
      }
    })
  }

}
