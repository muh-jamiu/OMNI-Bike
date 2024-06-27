var paypal = require("./../../utils/paypayConfig");
const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY ?? "N/A");


const Paypal = (req, res) => {

  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://return.url/success",
      "cancel_url": "http://cancel.url/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "item",
          "sku": "item",
          "price": "1.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": "1.00"
      },
      "description": "This is the payment description."
    }]
  };
  

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
       return  res.status(200).send("payment");
      for(let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};


const _Stripe =  async(req, res) => {
//   const { amount, currency } = req.body;
var amount = 500 * 100
var currency = "USD"

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.status(200).send({
      clientSecret: paymentIntent,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
};



module.exports = {
    Paypal,
    _Stripe,
};

