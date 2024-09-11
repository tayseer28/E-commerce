import { Component, inject, signal, WritableSignal } from '@angular/core';
import { OrdersService } from '../../core/services/orders/orders.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Observable } from 'rxjs';
import { IOrderDetails } from '../../core/interfaces/iorder-details';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from 'express';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent {

  private readonly _OrdersService = inject(OrdersService);
  private readonly _AuthService = inject(AuthService)
  // userOrders: IOrderDetails[] = [];
  userOrders: WritableSignal<IOrderDetails[]> = signal([]);
  deliveryDate: string | Date = '';


  ngOnInit(): void {
    this._AuthService.saveToken();
    console.log(this._AuthService.userData.id)
    this.getOrders();
    
  }
  calcDeliveryDate(creatDate: string| Date): Date{
    this.deliveryDate = new Date(creatDate);
    this.deliveryDate.setDate(this.deliveryDate.getDate() + 3);
    return this.deliveryDate;
  }
  getOrders(): void {
    this._OrdersService.getAllOrders(this._AuthService.userData.id).subscribe({
      next: (res) => {
        this.userOrders.set(res);
        // console.log(res)
        console.log(this.userOrders())
      },

    })
  }

}
