var should = require('should');
var config = require('./config.js');
var helper = require('./helper.js');
var _ = require('underscore');

var dwolla = require('../../lib/dwolla')(config.appKey, config.appSecret);

dwolla.sandbox = config.sandbox;

describe('MassPay', function() {
  var items = [
    {
      amount: "12.00",
      destination: "gordon@dwolla.com",
      destinationType: "Email",
      notes: "hello world",
      metadata: {
        foo: "bar"
      }
    },
    {
      amount: "0.50",
      // first Dwolla ID is only valid in sandbox, and other in production:
      destination: config.sandbox ? "812-232-2342" : "812-713-9234",  
      destinationType: "Dwolla",
      notes: "hello world",
      metadata: {
        lol: "whooooo"
      }
    },
  ];

  var params = {
    userJobId: "job id blah blah",
    assumeCosts: true
  };

  var masspayJobId;     // a new masspay job created in before()

  before(function(done) {
    // send a masspay job for the GET endpoints to lookup.
    // (we do this in a before instead of relying on the next test to pass)
    dwolla.setToken(config.accessToken);
    dwolla.createMassPayJob(config.fundingSource, config.pin, items, params, function(err, res) {
      (err == null).should.be.true;
      res.should.have.properties("Id", "UserJobId", "AssumeCosts", "FundingSource", "Total", "Fees", "CreatedDate", "Status", "ItemSummary");
      masspayJobId = res.Id;
      done();
    });
  });

  describe('create masspay job', function() {
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.createMassPayJob(config.fundingSource, config.pin, items, params, function(err, res) {
        //sample:
        // { Id: 'a575af69-e053-414a-9d2b-a39e0064c58a',
        // UserJobId: 'job id blah blah',
        // AssumeCosts: true,
        // FundingSource: '5da016f7769bcb1de9938a30d194d5a7',
        // Total: 12.50,
        // Fees: 0.25,
        // CreatedDate: '2014-09-06T06:06:51Z',
        // Status: 'queued',
        // ItemSummary: { Count: 2, Completed: 0, Successful: 0 } }

        res.should.have.properties("Id", "UserJobId", "AssumeCosts", "FundingSource", "Total", "Fees", "CreatedDate", "Status", "ItemSummary");

        res.Id.should.be.a.String
          .and.match(helper.patterns.UUID);
        res.UserJobId.should.be.a.String
          .and.eql('job id blah blah');
        res.AssumeCosts.should.be.a.Boolean
          .and.be.true;
        res.FundingSource.should.be.a.String
          .and.eql(config.fundingSource);
        res.Total.should.be.a.Number
          .and.eql(12.5);
        res.Fees.should.be.a.Number
          .and.eql(0.25);
        res.CreatedDate.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Status.should.be.a.String
          .and.eql('queued');
        res.ItemSummary.should.be.an.Object
          .with.properties("Count", "Completed", "Successful");

        res.ItemSummary.Count.should.be.a.Number
          .and.eql(2);
        res.ItemSummary.Completed.should.be.a.Number
          .and.eql(0);
        res.ItemSummary.Successful.should.be.a.Number
          .and.eql(0);

        done();
      });
    });
  });

  describe('get masspay job', function() {
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.getMassPayJob(masspayJobId, function(err, res) {
        //sample:
        // { Id: '63ecf797-59e0-4c2a-8674-a39e011b590e',
        // UserJobId: 'job id blah blah',
        // AssumeCosts: true,
        // FundingSource: '5da016f7769bcb1de9938a30d194d5a7',
        // Total: 12.5,
        // Fees: 0.25,
        // CreatedDate: '2014-09-06T17:11:35Z',
        // Status: 'processing',
        // ItemSummary: { Count: 2, Completed: 1, Successful: 1 } }

        res.should.have.properties("Id", "UserJobId", "AssumeCosts", "FundingSource", "Total", "Fees", "CreatedDate", "Status", "ItemSummary");

        res.Id.should.be.a.String
          .and.match(helper.patterns.UUID);
        res.UserJobId.should.be.a.String
          .and.eql('job id blah blah');
        res.AssumeCosts.should.be.a.Boolean
          .and.be.true;
        res.FundingSource.should.be.a.String
          .and.eql(config.fundingSource);
        res.Total.should.be.a.Number
          .and.eql(12.5);
        res.Fees.should.be.a.Number
          .and.eql(0.25);
        res.CreatedDate.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Status.should.be.a.String
          .and.not.empty;
        _.contains(helper.constants.MASSPAY_JOB_STATUSES, res.Status).should.be.true;
        res.ItemSummary.should.be.an.Object
          .with.properties("Count", "Completed", "Successful");

        res.ItemSummary.Count.should.be.a.Number
          .and.eql(2);
        res.ItemSummary.Completed.should.be.a.Number;
        res.ItemSummary.Successful.should.be.a.Number;
        done();
      });
    });
  });

  describe('get masspay job items', function() {
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.getMassPayJobItems(masspayJobId, function(err, res) {
        //sample:
        // [ { JobId: '63ecf797-59e0-4c2a-8674-a39e011b590e',
        //   ItemId: 480183,
        //   Destination: 'gordon@dwolla.com',
        //   DestinationType: 'email',
        //   Amount: 12,
        //   Status: 'success',
        //   TransactionId: 328183,
        //   Error: null,
        //   CreatedDate: '2014-09-06T17:11:35Z',
        //   Metadata: { foo: 'bar' } },
        // { JobId: '63ecf797-59e0-4c2a-8674-a39e011b590e',
        //   ItemId: 480184,
        //   Destination: '812-232-2342',
        //   DestinationType: 'dwolla',
        //   Amount: 0.5,
        //   Status: 'notrun',
        //   TransactionId: null,
        //   Error: null,
        //   CreatedDate: '2014-09-06T17:11:35Z',
        //   Metadata: { lol: 'whooooo' } } ]

        res.should.be.an.Array
          .and.not.empty;

        var item = res[0];

        item.should.have.properties("JobId", "ItemId", "Destination", "DestinationType", "Amount", "Status", "TransactionId", "Error", "CreatedDate", "Metadata");

        item.JobId.should.be.a.String
          .and.eql(masspayJobId);
        item.ItemId.should.be.a.Number
          .and.above(0);
        item.Destination.should.be.a.String
          .and.eql('gordon@dwolla.com');
        item.DestinationType.should.be.a.String
          .and.eql('email');
        item.Amount.should.be.a.Number
          .and.eql(12);
        item.Status.should.be.a.String;
        (_.contains(helper.constants.MASSPAY_ITEM_STATUSES, item.Status)).should.be.true;
        (item.Status == 'notrun' || item.Status == 'success').should.be.true; // at this point, this job could have been processed/processing
        (item.TransactionId == null || typeof item.TransactionId == 'number').should.be.true; // if already run, will be a number, else, null
        (item.Error == null).should.be.true;
        item.CreatedDate.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        item.Metadata.should.be.an.Object;
        item.Metadata.should.eql({foo: 'bar'});

        // TODO: check from recipient account that they received payment

        done();
      });
    });
  });

  describe('get a masspay job item', function() {
    var itemId; 

    before(function(done) {
      // fetch the masspay job's first item's ID
      dwolla.getMassPayJobItems(masspayJobId, function(err, res) {
        (err == null).should.be.true;
        itemId = res[1].ItemId;
        done();
      });
    });

    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.getMassPayJobItem(masspayJobId, itemId, function(err, res) {
        //sample:
        // { JobId: '63ecf797-59e0-4c2a-8674-a39e011b590e',
        //   ItemId: 480184,
        //   Destination: '812-232-2342',
        //   DestinationType: 'dwolla',
        //   Amount: 0.5,
        //   Status: 'notrun',
        //   TransactionId: null,
        //   Error: null,
        //   CreatedDate: '2014-09-06T17:11:35Z',
        //   Metadata: { lol: 'whooooo' } }

        res.should.have.properties("JobId", "ItemId", "Destination", "DestinationType", "Amount", "Status", "TransactionId", "Error", "CreatedDate", "Metadata");

        res.JobId.should.be.a.String
          .and.eql(masspayJobId);
        res.ItemId.should.be.a.Number
          .and.above(0);
        res.Destination.should.be.a.String
          .and.eql(config.sandbox ? "812-232-2342" : "812-713-9234");
        res.DestinationType.should.be.a.String
          .and.eql('dwolla');
        res.Amount.should.be.a.Number
          .and.eql(0.5);
        res.Status.should.be.a.String;
        (_.contains(helper.constants.MASSPAY_ITEM_STATUSES, res.Status)).should.be.true;
        (res.TransactionId == null || typeof res.TransactionId == 'number').should.be.true; // if already run, will be a number, else, null
        (res.Error == null).should.be.true;
        res.CreatedDate.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Metadata.should.be.an.Object;
        res.Metadata.should.eql({lol: 'whooooo'});

        done();
      });
    });
  });

  describe('get all masspay jobs created by a user', function() {
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.getMassPayJobs(function(err, res) {
        // sample:
        // [ { Id: '8191e0b2-0e44-4627-81c3-a39e0122f2d8',
        // UserJobId: 'job id blah blah',
        // AssumeCosts: true,
        // FundingSource: '5da016f7769bcb1de9938a30d194d5a7',
        // Total: 12.5,
        // Fees: 0.25,
        // CreatedDate: '2014-09-06T17:39:16Z',
        // Status: 'complete',
        // ItemSummary: { Count: 2, Completed: 2, Successful: 2 } },
        // ...
        // ]

        res.should.be.an.Array
          .and.not.empty;

        var job = res[0];

        job.should.have.properties("Id", "UserJobId", "AssumeCosts", "FundingSource", "Total", "Fees", "CreatedDate", "Status", "ItemSummary");

        job.Id.should.be.a.String
          .and.match(helper.patterns.UUID);
        job.UserJobId.should.be.a.String
          .and.eql('job id blah blah');
        job.AssumeCosts.should.be.a.Boolean
          .and.be.true;
        job.FundingSource.should.be.a.String
          .and.eql(config.fundingSource);
        job.Total.should.be.a.Number
          .and.eql(12.5);
        job.Fees.should.be.a.Number
          .and.eql(0.25);
        job.CreatedDate.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        job.Status.should.be.a.String
          .and.not.empty;
        (_.contains(helper.constants.MASSPAY_JOB_STATUSES, job.Status)).should.be.true;

        job.ItemSummary.should.be.an.Object
          .with.properties("Count", "Completed", "Successful");

        job.ItemSummary.Count.should.be.a.Number
          .and.eql(2);
        job.ItemSummary.Completed.should.be.a.Number;
        job.ItemSummary.Successful.should.be.a.Number;

        done();
      });

    });
  });
});