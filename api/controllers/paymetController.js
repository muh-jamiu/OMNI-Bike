var paypal = require("./../../utils/paypayConfig");
const express = require('express');


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

module.exports = {
    Paypal,
};

