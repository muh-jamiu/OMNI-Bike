const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', // or 'live' for production
  'client_id': 'Acsl2_Q9Lwqdftf_OsAfrQjaK6_kjl3bgg64uQxGxGAoeoP08nHYFzhanWrPQl_i0tBApXLAz9IVKLw2',
  'client_secret': 'EKpVLi7Y6UFarapKalAFnL4MAushQPTZujdBfmzXOTRt52TCYIyO58sFWjB9jDhXP_fFqBjRuRh8AjSe'
});

module.exports = paypal;
