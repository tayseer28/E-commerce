import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

  //here i will write the code theat deals with the request(send the header)
  //we cannot deal directly with the req object so we will clone it
  if(localStorage.getItem('token') !== null){

    //check if the api need header or not , if it needs header we will send it
    if(req.url.includes('cart') || req.url.includes('wishlist') || req.url.includes('orders')){
      req = req.clone({
        setHeaders: {token: localStorage.getItem('token')!},
      });
    }
  }
  return next(req);
};
