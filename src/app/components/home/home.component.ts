import { IWishlist } from './../../core/interfaces/iwishlist';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { map, Observable, Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { TrimTextPipe } from '../../core/pipes/trimText/trim-text.pipe';
import { CurrencyPipe, NgStyle } from '@angular/common';
import { SearchPipe } from '../../core/pipes/search/search.pipe';
import { FormsModule } from '@angular/forms';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/servcices/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { RatingComponent } from "../rating/rating.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule, RouterLink, TrimTextPipe, CurrencyPipe, SearchPipe, FormsModule, TranslateModule, NgStyle, RatingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly _FlowbitService = inject(FlowbiteService);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoryService = inject(CategoriesService);
  private readonly _CartService = inject(CartService);
  private readonly _WishlistService = inject(WishlistService)
  private readonly _ToastrService = inject(ToastrService)

  getProductSub!: Subscription;
  getCategoriesSub!: Subscription;
  searchValue: string = '';
  // isInWishlist: boolean = false;

  userWishList: WritableSignal<Map<string, boolean>> = signal(new Map<string, boolean>());
  wishlistMap: Map<string, boolean> = new Map<string, boolean>();




  products: IProduct[] = [];
  categories: ICategory[] = [];

  customOptionsCateg: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplayTimeout: 2000,
    rtl: true,
    autoplayHoverPause: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
    nav: true
  }
  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    rtl: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: true
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    // this.isInWishList("hello");
    this._FlowbitService.loadFlowbite(() => {

    });
    this.loadWishlist();
  }

  getProducts(): void {
    this.getProductSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        // console.log(this.products);
      },

    })
  }

  getCategories(): void {

    this.getCategoriesSub = this._CategoryService.getAllCategories().subscribe({
      next: (res) => {
        console.log(res);
        this.categories = res.data;
      },

    })
  }


  addToCart(id: string) {
    this._CartService.addToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message);
        this._CartService.cartQuantity.set(res.numOfCartItems)
        console.log("cart quantity", this._CartService.cartQuantity());
      },

    })
  }
  loadWishlist(): void {
    this._WishlistService.getWishlist().subscribe({
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


  addProductToWishlist(prodId: string): void {
    this._WishlistService.addProductToWishlist(prodId).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message);
        this._WishlistService.wishListQuantity.set(res.data.length);
        this.loadWishlist();
      },

    })
  }
  removeProductFromWishlist(prodId: string): void {
    this._WishlistService.removeProductFromWishlist(prodId).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message);
        this._WishlistService.wishListQuantity.set(res.data.length);
        this.loadWishlist();
      }
    })
  }

  ngOnDestroy(): void {
    //add the ? for null safety
    this.getProductSub?.unsubscribe();
    this.getCategoriesSub?.unsubscribe();
    
  }

}
