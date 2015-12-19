NPM Module for payment providers
===========

Building an open source Node module to provide access to some of the following APIs:

[Plaid](https://plaid.com/docs/)

[Coinbase](https://developers.coinbase.com/)

[Dwolla](https://developers.dwolla.com/)

[Stripe](https://stripe.com/docs)

.. More to come


Installation
----------

Install via [npm](http://npmjs.org/)

    npm install payment-sync --save


Initialize PaymentSync with your public and private keys for each service. Pass variable true : false for isSandbox.

    var paymentSync = require('payment-sync')(credentialsObject, isSandbox);


Endpoints
----------

- All callbacks are passed an error and response: `callback(err, res)`.

- Supports camelCase and underscore naming conventions (Textmaster uses the underscore convention).

- Please refer to the API docs for each provider:

[Plaid API Docs](https://plaid.com/docs/) for endpoint details.

[Coinbase API Docs](https://developers.coinbase.com/api/v2) for endpoint details.

[Dwolla API Docs](https://docsv2.dwolla.com/) for endpoint details.

[Stripe API Docs](https://stripe.com/docs/api) for endpoint details

**paymentSync.plaid**

    paymentSync.plaid.account.create(account, callback);

    paymentSync.plaid.account.authenticate(account, callback);

    paymentSync.plaid.account.balance(callback);

    paymentSync.plaid.transaction.create(projectObject, callback);

    paymentSync.plaid.transaction.info(projectObject, callback);

**paymentSync.coinbase**

    paymentSync.coinbase.account.create(projectObject, callback);

    paymentSync.coinbase.account.info(projectObject, callback);

    paymentSync.coinbase.transaction.create(projectObject, callback);

    paymentSync.coinbase.transaction.info(projectObject, callback);


**paymentSync.dwolla**

    paymentSync.dwolla.account.create(projectObject, callback);

    paymentSync.dwolla.account.info(projectObject, callback);

    paymentSync.dwolla.transaction.create(projectObject, callback);

    paymentSync.dwolla.transaction.info(projectObject, callback);

**paymentSync.stripe**

    paymentSync.stripe.account.create(projectObject, callback);

    paymentSync.stripe.account.info(projectObject, callback);

    paymentSync.stripe.transaction.create(projectObject, callback);

    paymentSync.stripe.transaction.info(projectObject, callback);


Contribute
----------

Forks and pull requests welcome!

TODO
----------
* Add tests


Author
----------

Jonathan Wu. Email me if you have any questions: [jonathan.x.wu@gmail.com](mailto:jonathan.x.wu@gmail.com).
