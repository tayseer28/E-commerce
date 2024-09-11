import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../core/services/products/products.service';
import { IProduct } from '../../../core/interfaces/iproduct';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { RatingComponent } from "../../rating/rating.component";

@Component({
  selector: 'app-prod-details',
  standalone: true,
  imports: [CarouselModule, CurrencyPipe, TranslateModule, RatingComponent],
  templateUrl: './prod-details.component.html',
  styleUrl: './prod-details.component.scss'
})
export class ProdDetailsComponent implements OnInit {

  //inject the service that gets the url info
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService)
  private productId: string = "";
  productDetails: IProduct | null = null;//we set initial value to null cause i will check on it in the template, and i will not display the template untill it becomes not null

  customOptionsDet: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false
  }

  ngOnInit(): void {
    //pramMap returns an observable that holds the parameters of the url, so we subscribe to it
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        //get the id of the product
        this.productId= params.get('id')!;//we use ! to tell typescript that this value will never be null
        this.getProductById(this.productId);
      }
    });
  }

  getProductById(prodId: string): void{
    this._ProductsService.getSpecificProduct(this.productId).subscribe({
      next: (res) => {
        console.log(res);
        this.productDetails = res.data;
      },

    })
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

}
