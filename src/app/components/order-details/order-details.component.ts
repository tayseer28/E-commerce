import { OrdersService } from './../../core/services/orders/orders.service';
import { Component, inject, computed, Signal, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrderDetails } from '../../core/interfaces/iorder-details';
import { Writable } from 'stream';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {

  private readonly _ActivatedRoute = inject(ActivatedRoute);
  orderId: string = '';
  private readonly _OrdersService = inject(OrdersService);
  private readonly _AuthService = inject(AuthService)

  userOrders: WritableSignal<IOrderDetails[]> = signal([]);


  ngOnInit(): void {
    //pramMap returns an observable that holds the parameters of the url, so we subscribe to it
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.orderId = params.get('id')!;
        console.log(this.orderId);
        // this.getProductById(this.productId);
      }
    });
    this.getOrders();

  }

    getOrders(): void{
      this._OrdersService.getAllOrders(this._AuthService.userData.id).subscribe({
        next: (res) => {
          console.log("res of orderDet",res);
          this.userOrders.set(res);
        }
    })
  }


}
