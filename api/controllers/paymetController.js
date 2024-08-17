var paypal = require("./../../utils/paypayConfig");
const express = require('express');
const Stripe = require('stripe');
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY ?? "N/A");
// const paypal_ = require('@paypal/checkout-server-sdk');
const axios = require('axios');
const userSchema = require("../model/userSchema")
const paymentSchema = require("../model/paymentSchema")
var nodemailer = require('nodemailer');
var data_ = process.env.DATA ?? ""
var user_ = "66c0a682e5dde1f6ccf95393"
var rental_ = "66a00489e476d42529c2da67"
var amount_ = 10

const sendEmailverify = (to, name, amount) => {
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'swift.secure.deliver@gmail.com',
          pass: 'vnmv onnd lfjx ybmo',
      }
  });

  var mailOptions = {
      to: to,
      subject: 'Paypal Payment Confirmation',
      html: `
          <a href="" class="logo d-flex" style="text-align: center; margin-bottom:.5em">
              <h2 class="fw-bold mx-2 text-white">Amount: $ ${amount}</h2>
          </a>

      `,
  };

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error)
      }else{
          console.log(info.response)
      }
  });


}


const Paypal = (req, res) => {
  const {amount, userId, rentId} = req.body
  user_ = userId
  rental_ = rentId
  amount_ = amount

  userSchema.find({_id : userId})
  .then(user => {
    if(user.length >= 1){

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
              sendEmailverify(data_, null, amount);
              return  res.status(200).json({redirect_url: payment.links[i].href });;
            }
          }
        }
      });
    }
    else{
      res.status(404).send("User does not exist");
    }
  })
  .catch(err => {
    res.status(500).send(err);
  })

};

const CancelUrl = async (req, res) => {
  return  res.status(500).json({message: "Transaction was not completed" });
}

const successUrl = async (req, res) => {
  const payment = new paymentSchema({
    user: user_,
    rental: rental_,
    amount: amount_
  })

  payment.save()
  .then(data => {
    return  res.status(200).json({message: "Transaction is completed successfully"});
  })
  .catch(err => {
    return  res.status(200).json({message: "Transaction is completed successfully", err });
  })
  
}

const paymentHistory = (req, res) => {  
  paymentSchema.find()
  .sort({"createdAt" : "desc"})
  .populate("rental")
  .populate("user")
  .then((data) => {
      if(data.length == 0){
          return res.status(200).json({
              message : "Payment history is empty",
          })
      }

      res.status(200).json({
          message : "Payment History is fetched successfully",
          data
      })
  })    

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

function environment() {
  let clientId = "YOUR_CLIENT_ID";
  let clientSecret = "YOUR_CLIENT_SECRET";

  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// const balanace = async(req, res) => {
  // let clientId = "Acsl2_Q9Lwqdftf_OsAfrQjaK6_kjl3bgg64uQxGxGAoeoP08nHYFzhanWrPQl_i0tBApXLAz9IVKLw2";
  // let clientSecret = "EKpVLi7Y6UFarapKalAFnL4MAushQPTZujdBfmzXOTRt52TCYIyO58sFWjB9jDhXP_fFqBjRuRh8AjSe";

//   let env_ = new paypal_.core.SandboxEnvironment(clientId, clientSecret);
//   let client_ = new paypal_.core.PayPalHttpClient(env_);

//   return  res.status(200).json({message: paypal_});
//   let request = new paypal_.v1.reporting.BalanceRequest();
//   try {
//     let response = await client().execute(request);
//     console.log('Balance:', response.result);
//     return  res.status(200).json({message: response.result});
//   } catch (err) {
//     console.error(err);
//     return  res.status(500).json({err});
//   }
// }

async function getAccessToken() {
  let clientId = "AZI-YNQWZ9wREKAONpd7VZLc5xVaVoX8NhZ3HC-brnUv5XalnPAdU_wHW12Y-kbXYWaIjn5uma_eF-kK";
  let clientSecret = "EI5ghQqCSbuOsYiNYk9zmuWUsIml7y2XmAJ7el84iylIR2uJfuDnCKz3AOM1cHq3LTa6QRMi3-s_zm3U";

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data.access_token;
}


async function balanace(req, res) {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.get('https://api.sandbox.paypal.com/v1/reporting/balances', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return  res.status(200).json({message: response });
    console.log('Balance:', response.data);
  } catch (error) {
    return  res.status(500).json({message: error.response.data });
    console.error('Error fetching balance:', error.response.data);
  }
}

module.exports = {
    Paypal,
    _Stripe,
    CancelUrl,
    successUrl,
    balanace,
    paymentHistory
};

