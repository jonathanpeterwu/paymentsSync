var should = require('should');
var config = require('./config.js');
var helper = require('./helper.js');

var dwolla = require('../../lib/dwolla')(config.appKey, config.appSecret);

dwolla.sandbox = config.sandbox;

describe('Checkouts', function() {

  // TODO: test Submit Directly and old Gateway endpoint
  // TODO: test params

  describe('create checkout session', function() {
    it('Should be successful and return a valid response', function(done) {
      var purchaseOrder = {
        destinationId: dwolla.sandbox ? '812-740-4294' : '812-713-9234',
        total: '5.00',
        orderItems: [
          {
            "name": "Prime Rib Sandwich", 
            "description": "A somewhat tasty non-vegetarian sandwich", 
            "quantity": "1", 
            "price": "2.0"
          },
          {
            "name": "Ham Sandwich", 
            "description": "Yum!", 
            "quantity": "3", 
            "price": "1.00"
          }
        ]
      };

      var params = {
        allowFundingSources: true,
        orderId: 'blah'
      };

      dwolla.createCheckout('https://google.com', purchaseOrder, params, function(err, checkout) {
        should(err).should.be.undefined;

        checkout.should.have.property('checkoutId')
          .which.is.a.String
          .and.match(helper.patterns.UUID);

        checkout.should.have.property('checkoutURL')
          .which.is.a.String
          .and.match(helper.patterns.checkoutURL);

        done();
      });

    });
  });

  describe('retrieve checkout session', function() {
    var existingCheckout;

    before(function(done) {
      // create a checkout session...
      var purchaseOrder = {
        destinationId: dwolla.sandbox ? '812-740-4294' : '812-713-9234',
        total: '5.00',
        orderItems: [
          {
            "name": "Prime Rib Sandwich", 
            "description": "A somewhat tasty non-vegetarian sandwich", 
            "quantity": "1", 
            "price": "2.0"
          },
          {
            "name": "Ham Sandwich", 
            "description": "Yum!", 
            "quantity": "3", 
            "price": "1.00"
          }
        ]
      };

      var params = {
        allowFundingSources: true,
        orderId: 'blah'
      };

      dwolla.createCheckout('https://google.com', purchaseOrder, params, function(err, checkout) {
        existingCheckout = checkout;
        done();
      });
    });

    it('Should be successful and return a valid response', function(done) {
      //sample
      // { CheckoutId: '8943f72a-9367-4093-a4f4-651538a8eabc',
      //  Discount: null,
      //  Shipping: null,
      //  Tax: null,
      //  Total: 5,
      //  Status: 'Created',
      //  FundingSource: null,
      //  TransactionId: null,
      //  ProfileId: null,
      //  DestinationTransactionId: null,
      //  OrderItems:
      //   [ { Description: 'A somewhat tasty non-vegetarian sandwich',
      //       Name: 'Prime Rib Sandwich',
      //       Price: 2,
      //       Quantity: 1,
      //       Total: 2 },
      //     { Description: 'Yum!',
      //       Name: 'Ham Sandwich',
      //       Price: 1,
      //       Quantity: 3,
      //       Total: 3 } ],
      //  Metadata: null }

      dwolla.getCheckout(existingCheckout.checkoutId, function(err, response) {
        response.should.have.properties("CheckoutId", "Discount", "Shipping", "Tax", "Total", "Status", "FundingSource", "TransactionId", "ProfileId", "DestinationTransactionId", "OrderItems", "Metadata");

        response.CheckoutId.should.be.a.String.and.match(/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/);
        (response.Discount == null).should.be.true;
        (response.Shipping == null).should.be.true;
        (response.Tax == null).should.be.true;
        response.Total.should.be.a.Number.and.equal(5);
        response.Status.should.be.a.String.and.equal('Created');
        (response.FundingSource == null).should.be.true;
        (response.TransactionId == null).should.be.true;
        (response.ProfileId == null).should.be.true;
        (response.DestinationTransactionId == null).should.be.true;
        response.OrderItems.should.be.an.Array
          .and.containEql({ 
            Description: 'A somewhat tasty non-vegetarian sandwich',
            Name: 'Prime Rib Sandwich',
            Price: 2,
            Quantity: 1,
            Total: 2 
          })
          .and.containEql({ 
            Description: 'Yum!',
            Name: 'Ham Sandwich',
            Price: 1,
            Quantity: 3,
            Total: 3 
          });

        (response.Metadata == null).should.be.true;

        done();
      });

    });
  });
});