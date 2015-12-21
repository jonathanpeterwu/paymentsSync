var should = require('should');
var config = require('./config.js');
var helper = require('./helper.js');
var _ = require('underscore');

var dwolla = require('../../lib/dwolla')(config.appKey, config.appSecret);

dwolla.sandbox = config.sandbox;


describe('Transaction', function() {
  // TODO: test- transaction > 10 should incur fee
  // TODO: test- sender should be able to assume fee via assumeFees
  // TODO: test- recipient should assume fee by default
  // TODO: test- additionalFacilitatorFees should be assumed by recipient by default
  // TODO: test- bank sourced transaction should have clearingDate and pending status

  describe('send transaction', function() {
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      
      dwolla.send(config.pin, config.merchantDwollaID, '10.01', function(err, res) {
        // sample: 328979
        res.should.be.a.Number
          .above(0);
        done();
      });
    });
  });

  describe('get transaction by id', function() {
    var transactionId;

    before(function(done) { // create a transaction
      dwolla.setToken(config.accessToken);
      var params = {
        notes: 'foobar',
        metadata: {
          foo9: 'bar10',
          forst: 'gump'
        }
      };
      dwolla.send(config.pin, config.merchantDwollaID, '10.01', params, function(err, res) {
        // sample: 328979
        res.should.be.a.Number
          .above(0);

        transactionId = res;

        done();
      });
    });

    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.transactionById(transactionId, function(err, res) {
        // sample:
        // { Id: 328991,
        // Amount: 10.01,
        // Date: '2014-09-09T04:56:03Z',
        // Type: 'money_sent',
        // UserType: 'Dwolla',
        // DestinationId: '812-740-4294',
        // DestinationName: 'GORDCORP',
        // Destination:
        //  { Id: '812-740-4294',
        //    Name: 'GORDCORP',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-740-4294' },
        // SourceId: '812-742-8722',
        // SourceName: 'Cafe Kubal',
        // Source:
        //  { Id: '812-742-8722',
        //    Name: 'Cafe Kubal',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-742-8722' },
        // ClearingDate: '',
        // Status: 'processed',
        // Notes: '',
        // Fees: null,
        // OriginalTransactionId: null,
        // Metadata: null }

        res.should.be.an.Object
          .with.properties("Id", "Amount", "Date", "Type", "UserType", "DestinationId", "DestinationName", "Destination", "SourceId", "SourceName", "Source", "ClearingDate", "Status", "Notes", "Fees", "OriginalTransactionId", "Metadata");

        res.Amount.should.be.a.Number
          .eql(10.01);
        res.Date.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Type.should.be.a.String
          .and.not.empty;
        (_.contains(helper.constants.TRANSACTION_TYPES, res.Type)).should.be.true;
        res.UserType.should.be.a.String
          .and.eql('Dwolla');

        res.DestinationId.should.be.a.String
          .and.eql(config.merchantDwollaID);
        res.DestinationName.should.be.a.String
          .and.not.empty;

        res.Destination.should.be.an.Object
          .and.have.properties('Id', 'Name', 'Type', 'Image');
        res.Destination.Id.should.be.a.String
          .and.not.empty
          .and.eql(config.merchantDwollaID);
        res.Destination.Name.should.be.a.String
          .and.not.empty;
        res.Destination.Type.should.be.a.String
          .and.not.empty
          .and.eql('Dwolla');
        res.Destination.Image.should.be.a.String
          .and.match(helper.patterns.url);

        res.SourceId.should.be.a.String
          .and.match(helper.patterns.dwollaId);
        res.SourceName.should.be.a.String
          .and.not.empty;

        res.Source.should.be.an.Object
          .and.have.properties('Id', 'Name', 'Type', 'Image');
        res.Source.Id.should.be.a.String
          .and.not.empty
          .and.match(helper.patterns.dwollaId);
        res.Source.Name.should.be.a.String
          .and.not.empty;
        res.Source.Type.should.be.a.String
          .and.not.empty
          .and.eql('Dwolla');
        res.Source.Image.should.be.a.String
          .and.match(helper.patterns.url);

        res.ClearingDate.should.be.a.String;
        res.Status.should.be.a.String
          .and.eql('processed');
        res.Notes.should.be.a.String
          .and.eql('foobar');
        (res.Fees == null).should.be.true;
        (res.OriginalTransactionId == null).should.be.true;
        res.Metadata.should.be.an.Object
          .and.eql({
            foo9: 'bar10',
            forst: 'gump'
          });

        done();
      });
    });
  });

  describe('get transactions', function() {
    //TODO: test limit, skip work
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.transactions(function(err, res) {
        // sample
        //    [ { Id: 328979,
        // Amount: 10.01,
        // Date: '2014-09-09T04:49:41Z',
        // Type: 'money_sent',
        // UserType: 'Dwolla',
        // DestinationId: '812-232-2342',
        // DestinationName: 'ClearCapital',
        // Destination:
        //  { Id: '812-232-2342',
        //    Name: 'ClearCapital',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-232-2342' },
        // SourceId: '812-742-8722',
        // SourceName: 'Cafe Kubal',
        // Source:
        //  { Id: '812-742-8722',
        //    Name: 'Cafe Kubal',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-742-8722' },
        // ClearingDate: '',
        // Status: 'processed',
        // Notes: '',
        // Fees: null,
        // OriginalTransactionId: null,
        // Metadata: null },
        // ...
        // ]

        res.should.be.an.Array
          .and.not.empty;

        // test all the transactions in the listing:

        res.forEach(function(tx, index, list) {
          tx.should.be.an.Object
            .with.properties("Id", "Amount", "Date", "Type", "UserType", "DestinationId", "DestinationName", "Destination", "SourceId", "SourceName", "Source", "ClearingDate", "Status", "Notes", "Fees", "OriginalTransactionId", "Metadata");

          tx.Amount.should.be.a.Number
            .above(0);
          tx.Date.should.be.a.String
            .and.match(helper.patterns.ISOTimestamp);
          tx.Type.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.TRANSACTION_TYPES, tx.Type)).should.be.true;
          tx.UserType.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.USER_TYPES, tx.UserType)).should.be.true;


          tx.DestinationId.should.be.a.String; // can be empty, if type Fee
          tx.DestinationName.should.be.a.String
            .and.not.empty;

          tx.Destination.should.be.an.Object
            .and.have.properties('Id', 'Name', 'Type', 'Image');
          tx.Destination.Id.should.be.a.String;
          tx.Destination.Name.should.be.a.String
            .and.not.empty;
          tx.Destination.Type.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.USER_TYPES, tx.Destination.Type)).should.be.true;
          tx.Destination.Image.should.be.a.String;

          tx.SourceId.should.be.a.String
            .and.not.empty;
          tx.SourceName.should.be.a.String
            .and.not.empty;

          tx.Source.should.be.an.Object
            .and.have.properties('Id', 'Name', 'Type', 'Image');
          tx.Source.Id.should.be.a.String
            .and.not.empty;
          tx.Source.Name.should.be.a.String
            .and.not.empty;
          tx.Source.Type.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.USER_TYPES, tx.Source.Type)).should.be.true;
          tx.Source.Image.should.be.a.String;

          tx.ClearingDate.should.be.a.String;
          if (tx.ClearingDate != null && tx.ClearingDate != '') tx.ClearingDate.should.match(helper.patterns.ISOTimestamp);
          tx.Status.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.TRANSACTION_STATUSES, tx.Status)).should.be.true;
          
          if (tx.Notes != null) tx.Notes.should.be.a.String;

          if (tx.Fees != null) tx.Fees.should.be.an.Array.and.not.empty;
          if (tx.OriginalTransactionId != null) tx.OriginalTransactionId.should.be.a.Number;
          if (tx.Metadata != null) tx.Metadata.should.be.an.Object;

          if (list.length - 1 == index) done();   // end if last transaction in list
        });
      });

    });
  });

  describe('get transaction stats', function() {
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.transactionsStats(function(err, res) {
        // sample:
        // { TransactionsCount: 2, TransactionsTotal: 24 }

        res.should.be.an.Object
          .with.properties('TransactionsCount', 'TransactionsTotal');
        res.TransactionsCount.should.be.a.Number;
        res.TransactionsTotal.should.be.a.Number;

        done();
      });

    });
  });

  describe('process a refund', function() {
    var transactionId;
    var recipientTransactionId;

    before(function(done) { // create a transaction
      dwolla.setToken(config.accessToken);
      var params = {
        notes: 'foobar',
        metadata: {
          foo9: 'bar10',
          forst: 'gump'
        }
      };
      dwolla.send(config.pin, config.merchantDwollaID, '10.01', params, function(err, res) {
        // sample: 328979
        res.should.be.a.Number
          .above(0);

        transactionId = res;

        // find recipient transaction ID

        dwolla.setToken(config.merchantAccessToken);
        dwolla.transactionById(transactionId, function(err, res) {
          res.Id.should.be.a.Number.above(0);
          recipientTransactionId = res.Id;
          done();
        });
      });
    });

    it('Should be successful and return a valid response', function(done) {
      // TODO: test- cannot refund more than refund amount + fee amount (if sender assumed)
      dwolla.setToken(config.merchantAccessToken);
      dwolla.refund(config.merchantPIN, recipientTransactionId, 'Balance', '10.01', function(err, res) {
        // sample
        // { TransactionId: 329100,
        // RefundDate: '09/09/2014 05:47:59',
        // Amount: 10.01 }

        res.should.be.an.Object
          .with.properties("TransactionId", "RefundDate", "Amount");
        res.TransactionId.should.be.a.Number
          .and.above(0);
        res.RefundDate.should.be.a.String
          .and.not.Empty;   // TODO: test against this old timestamp format
        res.Amount.should.be.a.Number
          .and.above(0);
        done();
      });

    });
  });

  describe('transactions by app', function() {
    it('Should be successful and return a valid response', function(done) {
      dwolla.transactionsByApp({limit: 10}, function(err, res) {
        res.should.be.an.Array
          .and.not.empty;

        // test all the transactions in the listing:

        res.forEach(function(tx, index, list) {
          tx.should.be.an.Object
            .with.properties("Id", "Amount", "Date", "Type", "UserType", "DestinationId", "DestinationName", "Destination", "SourceId", "SourceName", "Source", "ClearingDate", "Status", "Notes", "Fees", "OriginalTransactionId", "Metadata");

          tx.Amount.should.be.a.Number
            .above(0);
          tx.Date.should.be.a.String
            .and.match(helper.patterns.ISOTimestamp);
          tx.Type.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.TRANSACTION_TYPES, tx.Type)).should.be.true;
          tx.UserType.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.USER_TYPES, tx.UserType)).should.be.true;


          tx.DestinationId.should.be.a.String
            .and.not.empty;
          tx.DestinationName.should.be.a.String
            .and.not.empty;

          tx.Destination.should.be.an.Object
            .and.have.properties('Id', 'Name', 'Type', 'Image');
          tx.Destination.Id.should.be.a.String;
          tx.Destination.Id.should.not.be.empty;
          tx.Destination.Name.should.be.a.String
            .and.not.empty;
          tx.Destination.Type.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.USER_TYPES, tx.Destination.Type)).should.be.true;
          tx.Destination.Image.should.be.a.String;

          tx.SourceId.should.be.a.String
            .and.not.empty;
          tx.SourceName.should.be.a.String
            .and.not.empty;

          tx.Source.should.be.an.Object
            .and.have.properties('Id', 'Name', 'Type', 'Image');
          tx.Source.Id.should.be.a.String
            .and.not.empty;
          tx.Source.Name.should.be.a.String
            .and.not.empty;
          tx.Source.Type.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.USER_TYPES, tx.Source.Type)).should.be.true;
          tx.Source.Image.should.be.a.String;

          tx.ClearingDate.should.be.a.String;
          if (tx.ClearingDate != null && tx.ClearingDate != '') tx.ClearingDate.should.match(helper.patterns.ISOTimestamp);
          tx.Status.should.be.a.String
            .and.not.empty;
          (_.contains(helper.constants.TRANSACTION_STATUSES, tx.Status)).should.be.true;
          tx.Notes.should.be.a.String;
          if (tx.Fees != null) tx.Fees.should.be.an.Array.and.not.empty;
          if (tx.OriginalTransactionId != null) tx.OriginalTransactionId.should.be.a.Number;
          if (tx.Metadata != null) tx.Metadata.should.be.an.Object;

          if (list.length - 1 == index) done();   // end if last transaction in list
        });
      });
    });
  });
});