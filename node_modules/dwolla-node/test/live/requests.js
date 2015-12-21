var should = require('should');
var config = require('./config.js');
var helper = require('./helper.js');
var _ = require('underscore');

var dwolla = require('../../lib/dwolla')(config.appKey, config.appSecret);

dwolla.sandbox = config.sandbox;

describe('Requests', function() {
  describe('make money request', function () {
    it('to a Dwolla ID, Should be successful and return a valid response', function (done) {

      dwolla.setToken(config.accessToken);
      dwolla.request(config.merchantDwollaID, '5.00', function (err, res) {
      	// sample: 1486
      	(err == null).should.be.true;
      	res.should.be.a.Number
      		.and.above(0);
      	done();
      });
    });

    it('to an Email, Should be successful and return a valid response', function (done) {

      dwolla.setToken(config.accessToken);
      dwolla.request(config.merchantEmail, '2.00', {
      	sourceType: 'Email'
      }, function (err, res) {
      	(err == null).should.be.true;
      	res.should.be.a.Number
      		.and.above(0);
      	done();
      });
    });
  });

  describe('list pending requests', function () {
    // TODO: add test: I Should be able to see a request I just got as a recipient in Listing
    it('Should be successful and return a valid response', function (done) {

      // have another test that checks to see if recipient got the request

      dwolla.setToken(config.accessToken);
      dwolla.requests(function (err, res) {
      	//sample:
      	// [{ Id: 1452,
		    // Source:
		    //  { Id: '812-742-8722',
		    //    Name: 'Cafe Kubal',
		    //    Type: 'Dwolla',
		    //    Image: 'http://uat.dwolla.com/avatars/812-742-8722' },
		    // Destination:
		    //  { Id: '812-443-2936',
		    //    Name: ' ',
		    //    Type: 'Dwolla',
		    //    Image: 'http://uat.dwolla.com/avatars/812-443-2936' },
		    // Amount: 1,
		    // Notes: '',
		    // DateRequested: '2014-08-27T03:47:39Z',
		    // Status: 'Pending',
		    // Transaction: null,
		    // CancelledBy: null,
		    // DateCancelled: '',
		    // SenderAssumeFee: false,
		    // SenderAssumeAdditionalFees: false,
		    // AdditionalFees: [],
		    // Metadata: null },
		    // ...
		    // ]

		    res.should.be.an.Array
		    	.and.not.empty;

		    var req = res[0];

		    req.should.be.an.Object
		    	.with.properties("Id", "Source", "Destination", "Amount", "Notes", "DateRequested", "Status", "Transaction", "CancelledBy", "DateCancelled", "SenderAssumeFee", "SenderAssumeAdditionalFees", "AdditionalFees", "Metadata");

		    req.Id.should.be.a.Number
		    	.and.above(0);

        req.Source.should.be.an.Object
          .and.have.properties('Id', 'Name', 'Type', 'Image');
        req.Source.Id.should.be.a.String
          .and.not.empty;
        req.Source.Name.should.be.a.String
          .and.not.empty;
        req.Source.Type.should.be.a.String
          .and.not.empty;
        (_.contains(helper.constants.USER_TYPES, req.Source.Type)).should.be.true;
        req.Source.Image.should.be.a.String;

        req.Destination.should.be.an.Object
          .and.have.properties('Id', 'Name', 'Type', 'Image');
        req.Destination.Id.should.be.a.String
          .and.not.empty;
        req.Destination.Name.should.be.a.String
          .and.not.empty;
        req.Destination.Type.should.be.a.String
          .and.not.empty;
        (_.contains(helper.constants.USER_TYPES, req.Destination.Type)).should.be.true;
        req.Destination.Image.should.be.a.String;

        req.Amount.should.be.a.Number
          .and.above(0);
        req.Notes.should.be.a.String;
        req.DateRequested.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        req.Status.should.be.a.String;
        (_.contains(helper.constants.REQUEST_STATUSES, req.Status));

        req.DateCancelled.should.be.a.String;
        req.SenderAssumeFee.should.be.a.Boolean;
        req.SenderAssumeAdditionalFees.should.be.a.Boolean;
        req.AdditionalFees.should.be.an.Array;

        if (req.Metadata != null) req.Metadata.should.be.an.Object;
        if (req.Transaction != null) req.Transaction.should.be.an.Object;
        if (req.CancelledBy != null) req.CancelledBy.should.be.a.String;

      	done();
      });
    });
  });

  describe('get request details by id', function () {
    // TODO: I should be able to lookup the same request as a recipient
    var requestId;

    before(function(done) {
      // create a new request
      dwolla.setToken(config.accessToken);

      var params = {
        notes: "Foobar",
        metadata: {
          'foo': 'bar',
          'nine9': 'ten10',
        },
        senderAssumeCosts: true,
        senderAssumeAdditionalFees: true,
        additionalFees: [{
          destinationId: config.sandbox ? "812-232-2342" : "812-713-9234",
          amount: 1.00
        }]
      };

      dwolla.request(config.merchantDwollaID, '12.00', params, function (err, res) {
        // sample: 1486
        (err == null).should.be.true;
        res.should.be.a.Number
          .and.above(0);
        requestId = res;
        done();
      });
    });

    it('Should be successful and return a valid response', function (done) {

      dwolla.setToken(config.accessToken);
      dwolla.requestById(requestId, function (err, res) {
      	// sample
        // { Id: 1502,
        // Source:
        //  { Id: '812-742-8722',
        //    Name: 'Cafe Kubal',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-742-8722' },
        // Destination:
        //  { Id: '812-740-4294',
        //    Name: 'GORDCORP',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-740-4294' },
        // Amount: 12,
        // Notes: 'Foobar',
        // DateRequested: '2014-09-09T04:19:38Z',
        // Status: 'Pending',
        // Transaction: null,
        // CancelledBy: null,
        // DateCancelled: '',
        // SenderAssumeFee: true,
        // SenderAssumeAdditionalFees: true,
        // AdditionalFees: [ { DestinationId: '812-232-2342', Amount: 1 } ],
        // Metadata: { foo: 'bar', nine9: 'ten10' } }

        res.should.be.an.Object
          .with.properties("Id", "Source", "Destination", "Amount", "Notes", "DateRequested", "Status", "Transaction", "CancelledBy", "DateCancelled", "SenderAssumeFee", "SenderAssumeAdditionalFees", "AdditionalFees", "Metadata");

        res.Id.should.be.a.Number
          .and.above(0);

        res.Source.should.be.an.Object
          .and.have.properties('Id', 'Name', 'Type', 'Image');
        res.Source.Id.should.be.a.String
          .and.not.empty;
        res.Source.Name.should.be.a.String
          .and.not.empty;
        res.Source.Type.should.be.a.String
          .and.not.empty
          .and.eql('Dwolla');
        (_.contains(helper.constants.USER_TYPES, res.Source.Type)).should.be.true;
        res.Source.Image.should.be.a.String
          .and.match(helper.patterns.url);

        res.Destination.should.be.an.Object
          .and.have.properties('Id', 'Name', 'Type', 'Image');
        res.Destination.Id.should.be.a.String
          .and.not.empty;
        res.Destination.Name.should.be.a.String
          .and.not.empty;
        res.Destination.Type.should.be.a.String
          .and.not.empty
          .and.eql('Dwolla');
        res.Destination.Image.should.be.a.String
          .and.match(helper.patterns.url);

        res.Amount.should.be.a.Number
          .and.eql(12);
        res.Notes.should.be.a.String
          .and.eql('Foobar');
        res.DateRequested.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Status.should.be.a.String
          .and.eql('Pending');
        (_.contains(helper.constants.REQUEST_STATUSES, res.Status));

        res.DateCancelled.should.be.a.String
          .and.eql('');
        res.SenderAssumeFee.should.be.a.Boolean
          .and.true;
        res.SenderAssumeAdditionalFees.should.be.a.Boolean
          .and.true;
        res.AdditionalFees.should.be.an.Array
          .and.eql([ { DestinationId: '812-232-2342', Amount: 1 } ]);

        res.Metadata.should.be.an.Object
          .and.eql({ foo: 'bar', nine9: 'ten10' });

        (res.Transaction == null).should.be.true;
        (res.CancelledBy == null).should.be.true;

        done();
      });
    });
  });

  describe('cancel a request', function () {
    // TODO: add test: I should be able to cancel the request as a recipient
    var requestId;

    before(function(done) {
      // create a new request
      dwolla.setToken(config.accessToken);
      dwolla.request(config.merchantDwollaID, '12.00', function (err, res) {
        // sample: 1486
        (err == null).should.be.true;
        res.should.be.a.Number
          .and.above(0);
        requestId = res;
        done();
      });
    });

    it('Should be successful and return a valid response', function (done) {

      dwolla.setToken(config.accessToken);
      dwolla.cancelRequest(requestId, function (err, res) {
        // sample: true.  Just a boolean.
        res.should.be.a.Boolean
          .and.true; 

      	done();
      });
    });
  });

  describe('fulfill a request', function () {
    // TODO: add test that facilitator fees are paid when request fulfilled
    // TODO: add test: I should be able to pay more than the request amount
    // TODO: add testL I should not be able to pay less than the request amount
    var requestId;

    before(function(done) {
      // create a new request
      dwolla.setToken(config.accessToken);

      var params = {
        notes: "Foobar",
        metadata: {
          'foo': 'bar',
          'nine9': 'ten10',
        },
        senderAssumeCosts: true,
        senderAssumeAdditionalFees: true,
        additionalFees: [{
          destinationId: config.sandbox ? "812-232-2342" : "812-713-9234",
          amount: 1.00
        }]
      };

      dwolla.request(config.merchantDwollaID, '12.00', params, function (err, res) {
        // sample: 1486
        (err == null).should.be.true;
        res.should.be.a.Number
          .and.above(0);
        requestId = res;
        done();
      });
    });

    it('Should be successful and return a valid response', function (done) {

      dwolla.setToken(config.merchantAccessToken);
      dwolla.fulfillRequest(config.merchantPIN, requestId, '12.00', function (err, res) {
        // sample
        // { RequestId: 1514,
        // Id: 328969,
        // Source:
        //  { Id: '812-740-4294',
        //    Name: 'GORDCORP',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-740-4294' },
        // Destination:
        //  { Id: '812-742-8722',
        //    Name: 'Cafe Kubal',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-742-8722' },
        // Amount: 12,
        // SentDate: '2014-09-09T04:30:46Z',
        // ClearingDate: '2014-09-09T04:30:46Z',
        // Status: 'processed' }

        res.should.be.an.Object
          .with.properties("RequestId", "Id", "Source", "Destination", "Amount", "SentDate", "ClearingDate", "Status");

        res.Id.should.be.a.Number
          .and.above(0);
        res.RequestId.should.be.a.Number
          .and.eql(requestId);

        res.Source.should.be.an.Object
          .and.have.properties('Id', 'Name', 'Type', 'Image');
        res.Source.Id.should.be.a.String
          .and.not.empty;
        res.Source.Name.should.be.a.String
          .and.not.empty;
        res.Source.Type.should.be.a.String
          .and.not.empty
          .and.eql('Dwolla');
        (_.contains(helper.constants.USER_TYPES, res.Source.Type)).should.be.true;
        res.Source.Image.should.be.a.String
          .and.match(helper.patterns.url);

        res.Destination.should.be.an.Object
          .and.have.properties('Id', 'Name', 'Type', 'Image');
        res.Destination.Id.should.be.a.String
          .and.not.empty;
        res.Destination.Name.should.be.a.String
          .and.not.empty;
        res.Destination.Type.should.be.a.String
          .and.not.empty
          .and.eql('Dwolla');
        res.Destination.Image.should.be.a.String
          .and.match(helper.patterns.url);

        res.Amount.should.be.a.Number
          .and.eql(12);
        res.SentDate.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.ClearingDate.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Status.should.be.a.String
          .and.eql('processed');

        done();
      });
    });
  });
});