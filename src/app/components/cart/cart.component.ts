import { ICart } from './../../core/interfaces/icart';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { subscribe } from 'diagnostics_channel';
import { FlowbiteService } from '../../core/services/flowbite/flowbite.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import swal from 'sweetalert2'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  private readonly _CartService = inject(CartService);
  // private readonly _FlowbiteService = inject(FlowbiteService)
  private readonly _ToastrService = inject(ToastrService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)

  // cartProducts: ICart = {} as ICart;
  cartProducts: WritableSignal<ICart> = signal({} as ICart);
  totalItems: WritableSignal<number> = signal(0);
  // totalItems: number = 0;

  constructor(private readonly _FlowbiteService: FlowbiteService) {
  }


  ngOnInit(): void {
    this.getCart();
    this._FlowbiteService.loadFlowbite(() => {
    });

  }
  getCart() {
    this._CartService.getCartProducts().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          console.log(res);
          console.log(res.data)
          this.cartProducts.set(res.data);
          this.totalItems.set(this.cartProducts().products.length);
          console.log(this.cartProducts());
          // this.totalItems.set(this.cartProducts.products.length);
        }
      },

    })
  }


  removeSpecificProduct(prodId: string): void {
    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to remove this product from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with removing the product
        this._CartService.deleteCartProduct(prodId).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              // Update cart state without fetching the cart again
              this.cartProducts.set(res.data); // Use the response data to update the cart
              this._ToastrService.success('Product removed from cart', 'Success');
              this._CartService.cartQuantity.set(res.numOfCartItems);

              Swal.fire(
                'Removed!',
                'The product has been removed from your cart.',
                'success'
              );
            }
          },
          error: (err) => {
            // Handle any error during product removal
            Swal.fire(
              'Error',
              'There was an issue removing the product. Please try again.',
              'error'
            );
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User canceled the operation
        Swal.fire(
          'Cancelled',
          'The product remains in your cart.',
          'error'
        );
      }
    });
  }

  // removeSpecificProduct(prodId: string): void{
  //   this._CartService.deleteCartProduct(prodId).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       if(res.status === 'success'){
  //         // this.getCart();
  //         this.cartProducts.set(res.data);//instead of calling the api again, and we know the response pattern is the same 
  //         this._ToastrService.success('Product removed from cart', 'Success');
  //         this._CartService.cartQuantity.set(res.numOfCartItems);
  //       }
  //     },

  //   });
  // }

  updateProductQuantity(prodID: string, newCount: number): void {
    this._CartService.updateProductQuantity(prodID, newCount).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.cartProducts.set(res.data);
        }
      },

    })
  }

  // clearCart(): void{
  //   this._CartService.clearCart().subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       if(res.message === 'success'){
  //         // this.cartProducts = res.data;
  //         this.cartProducts.set({} as ICart);
  //         this._CartService.cartQuantity.set(0);
  //       }
  //     },

  //   });
  // }
  clearCart(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to clear your cart. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with clearing the cart
        this._CartService.clearCart().subscribe({
          next: (res) => {
            if (res.message === 'success') {
              // Update cart state
              this.cartProducts.set({} as ICart);
              this._CartService.cartQuantity.set(0);

              Swal.fire(
                'Cleared!',
                'Your cart has been cleared.',
                'success'
              );
            }
          },
          error: (err) => {
            Swal.fire(
              'Error',
              'There was an issue clearing your cart. Please try again.',
              'error'
            );
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User cancelled
        Swal.fire(
          'Cancelled',
          'Your cart is safe!',

        );
      }
    });
  }

}
