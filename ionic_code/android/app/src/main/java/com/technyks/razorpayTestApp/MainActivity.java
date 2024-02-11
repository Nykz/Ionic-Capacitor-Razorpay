package com.technyks.razorpayTestApp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.ionicframework.capacitor.Checkout;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(Checkout.class);
        super.onCreate(savedInstanceState);
    }
}
