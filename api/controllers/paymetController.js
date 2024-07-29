var paypal = require("./../../utils/paypayConfig");
const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY ?? "N/A");


const Paypal = (req, res) => {
  const {amount, userId} = req.body

  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "https://electric-bike-rental.onrender.com/payment/success-paypal",
      "cancel_url": "https://electric-bike-rental.onrender.com/payment/cancel-paypal"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Rental",
          "sku": "Bike",
          "price": amount ?? "1.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": amount ??  "1.00"
      },
      "description": "Payment for bike rental services"
    }]
  };
  

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      for(let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          return  res.status(200).json({redirect_url: payment.links[i] });
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
};

const CancelUrl = async (req, res) => {
  return  res.status(500).json({message: "Transaction was not completed" });
}

const successUrl = async (req, res) => {
  return  res.status(200).json({message: "Transaction is completed successfully" });
}


const _Stripe =  async(req, res) => {
    const { amount, currency, userId, rentalId } = req.body;
    var _amount = amount ?? 4000 * 100
    var _currency = currency ?? "USD"

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount :_amount,
            currency : _currency,
        });

        res.status(200).send({
        clientSecret: paymentIntent.client_secret,
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
    CancelUrl,
    successUrl,
};

