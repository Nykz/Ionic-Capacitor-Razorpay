import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Checkout } from 'capacitor-razorpay';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {

  private http = inject(HttpClient);

  constructor() { }

  async createRazorpayOrder(param: any) {
    try {
      const data$ = this.http.post<any>(environment.api + 'order', param);
      // const data = await (data$).toPromise();
      const data = await lastValueFrom(data$);
      return data;
    } catch (e) {
      throw e;
    }
  }

  async payWithRazorpay(param: any) {
    try {
      const options = {
        key: environment.razorpay.key_id,
        amount: param.amount.toString(),
        // image: '../../assets/icon/favicon.png',
        image: 'https://firebasestorage.googleapis.com/v0/b/maza-eats-ui-app.appspot.com/o/logo.png?alt=media&token=e42539e1-f976-4b9e-a6dd-5cfe9021be23',
        currency: 'INR',
        name: 'Test App',
        prefill: {
          email: param.email,
          contact: param.phone,
        },
        theme: {
          color: '#2dd36f',
        },
      };
      const data = await Checkout.open(options);
      console.log('data received: ', data);
      return data?.response;
    } catch (e) {
      throw e;
    }
  }

  async confirmPayment(param: any) {
    try {
      const data$ = this.http.post<any>(environment.api + 'confirm-payment', param);
      // const data = await (data$).toPromise();
      const data = await lastValueFrom(data$);
      return data;
    } catch (e) {
      throw e;
    }
  }

}
