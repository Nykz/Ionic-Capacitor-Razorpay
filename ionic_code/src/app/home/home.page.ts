import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonInput,
  IonButton,
  IonIcon,
  IonLoading,
  IonToast,
} from '@ionic/angular/standalone';
import { RazorpayService } from '../services/razorpay/razorpay.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonLoading,
    IonIcon,
    IonButton,
    IonInput,
    IonCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    FormsModule,
  ],
})
export class HomePage {
  amount!: number;
  isLoading = false;
  isToast = false;
  toast: any = {};
  model: any = {
    email: 'technyks@gmail.com',
    phone: 9999900000,
  };
  private razorpay = inject(RazorpayService);

  constructor() {}

  loader(value: boolean) {
    this.isLoading = value;
  }

  setToast(message: string, color: string) {
    this.isToast = true;
    this.toast = {
      message,
      color,
    };
    console.log('toast', this.toast);
  }

  async payWithRazorpay() {
    try {
      this.loader(true);

      const razorpay_data = {
        amount: this.amount * 100,
        currency: 'INR',
      };
      const order_data = await this.razorpay.createRazorpayOrder(razorpay_data);
      console.log('order data: ', order_data);

      const param = {
        email: this.model.email,
        phone: this.model.phone,
        amount: this.amount * 100,
        order_id: order_data.id,
      };

      this.loader(false);

      const data: any = await this.razorpay.payWithRazorpay(param);
      console.log('razorpay data: ', data);
      
      if(data?.razorpay_signature) {
        const order_param = {
          order_id: order_data.id,
          payment_id: data?.razorpay_payment_id,
          razorpay_signature: data?.razorpay_signature
        };
  
        const orderConfirmStatus = await this.razorpay.confirmPayment(order_param);
        console.log(orderConfirmStatus);
      }
      this.setToast('Razorpay payment successful', 'success');
    } catch (e) {
      console.log(e);
      this.loader(false);
      this.setToast('Error! please try again', 'danger');
    }
  }
}
