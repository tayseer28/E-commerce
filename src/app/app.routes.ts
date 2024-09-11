import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';

import { HomeComponent } from './components/home/home.component';

import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';


export const routes: Routes = [
    //we create two main routes for auth-layout and blank-layout
    {path: '', component: AuthLayoutComponent,canActivate: [loggedGuard] ,children: 
        [
            {path: '', redirectTo: 'login', pathMatch: 'full'},
            {path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)},
            {path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)},
            {path: 'forgot-password', loadComponent: () => import('./components/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent)}
        ]
    } ,
    
    {path: '', component: BlankLayoutComponent, canActivate: [authGuard], children: 
        [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'home', component: HomeComponent},
            {path: 'products', loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)},
            {path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent)},
            {path: 'brands', loadComponent: () => import('./components/brands/brands.component').then(m => m.BrandsComponent)},
            {path: 'categories', loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent)},
            {path: 'details/:id',loadComponent: () => import('./components/prodDetails/prod-details/prod-details.component').then(m => m.ProdDetailsComponent)},//we use :id to specify that there is a parameter
            {path: 'wishlist', loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent)},
            {path: 'allorders', loadComponent: () => import('./components/all-orders/all-orders.component').then(m => m.AllOrdersComponent)},
            {path: 'orders/:id', loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent)},
            {path: 'order-details/:id', loadComponent: () => import('./components/order-details/order-details.component').then(m => m.OrderDetailsComponent)},

        ]
    },


    {path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)}
];
