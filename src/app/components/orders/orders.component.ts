import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../core/services/orders/orders.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _OrdersService = inject(OrdersService)
  cartId: string | null = '';
  isLoading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';

  orders: FormGroup = new FormBuilder().group({
    details: [null, Validators.required],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: [null, [Validators.required, Validators.pattern(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/)]],
  });


  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.cartId = params.get('id');
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  orderSubmit(): void {
    this.isLoading = true;

    if (this.orders.valid) {
      this._OrdersService.checkOut(this.cartId, this.orders.value).subscribe({
        next: (res) => {
          console.log(res)
          if(res.status === 'success'){
            this.isLoading = false
            this.errorMsg = ''
            this.successMsg = res.status;
            //get the url of the stripe, we cannot use router.navigate because this navigate to component, we need to navigate to the url
            window.open(res.session.url, '_self');
          }

        },
        error: (err: HttpErrorResponse) => {
          console.log(err)
          this.isLoading = false
          this.errorMsg = err.error.status;
      }
    })
      
    }
    else {
      this.orders.markAllAsTouched();
    }
  }
}
