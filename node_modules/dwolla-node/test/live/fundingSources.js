var should = require('should');
var config = require('./config.js');
var helper = require('./helper.js');

var dwolla = require('../../lib/dwolla')(config.appKey, config.appSecret);

dwolla.sandbox = config.sandbox;

describe('Funding', function() {
  describe('get funding source by id', function() {
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.fundingSourceById(config.fundingSource, function(err, res) {
        // sample: 
        // { Balance: null,
        // Id: '5da016f7769bcb1de9938a30d194d5a7',
        // Name: 'Blah - Checking',
        // Type: 'Checking',
        // Verified: true,
        // ProcessingType: 'ACH' }

        res.should.have.properties("Balance", "Id", "Name", "Type", "Verified", "ProcessingType");
        (res.Balance === null || typeof res.Balance == 'number').should.be.true;
        res.Name.should.be.a.String
          .and.not.empty;
        res.Type.should.be.a.String
          .and.not.empty;
        res.Verified.should.be.a.Boolean;
        res.ProcessingType.should.be.a.String
          .and.not.empty;
        res.Id.should.be.a.String
          .and.not.empty;

        done();
      });
    });
  });

  describe('get funding sources', function() {
      it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.fundingSources(function(err, res) {
        // sample:

        // [ { Id: 'Balance',
        //   Name: 'My Dwolla Balance',
        //   Type: '',
        //   Verified: true,
        //   ProcessingType: '' },
        // { Id: '5da016f7769bcb1de9938a30d194d5a7',
        //   Name: 'Blah - Checking',
        //   Type: 'Checking',
        //   Verified: true,
        //   ProcessingType: 'ACH' } ]

        res.should.be.an.Array
          .and.not.empty;

        var bal = res[0];

        bal.should.have.properties("Id", "Name", "Type", "Verified", "ProcessingType");
        bal.Id.should.be.a.String
          .and.eql('Balance');
        bal.Name.should.be.a.String;
        bal.Type.should.be.a.String
          .and.eql('');
        bal.Verified.should.be.a.Boolean
          .and.be.true;
        bal.ProcessingType.should.be.a.String
          .and.eql('');
        

        var fs = res[1];    // first item is Balance FS, get the bank FS.

        fs.should.have.properties("Id", "Name", "Type", "Verified", "ProcessingType");
        fs.Id.should.be.a.String;
        fs.Name.should.be.a.String;
        fs.Type.should.be.a.String;
        fs.Verified.should.be.a.Boolean;
        fs.ProcessingType.should.be.a.String;

        done();
      });
    });
  });


  describe('withdraw from account balance to funding source', function() {
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.withdrawToFundingSource(config.pin, 5.00, config.fundingSource, function(err, res) {
        // sample:
        // { Id: 327843,
        // Amount: 5,
        // Date: '2014-09-05T06:40:56Z',
        // Type: 'withdrawal',
        // UserType: 'Dwolla',
        // DestinationId: 'XXX9999',
        // DestinationName: 'Blah',
        // Destination: { Id: 'XXX9999', Name: 'Blah', Type: 'Dwolla', Image: '' },
        // SourceId: '812-742-8722',
        // SourceName: 'Cafe Kubal',
        // Source:
        //  { Id: '812-742-8722',
        //    Name: 'Cafe Kubal',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-742-8722' },
        // ClearingDate: '2014-09-08T00:00:00Z',
        // Status: 'pending',
        // Notes: null,
        // Fees: null,
        // OriginalTransactionId: null,
        // Metadata: null }

        res.should.have.properties("Id", "Amount", "Date", "Type", "UserType", "DestinationId", "DestinationName", "Destination", "SourceId", "SourceName", "Source", "ClearingDate", "Status", "Notes", "Fees", "OriginalTransactionId", "Metadata");

        res.Id.should.be.a.Number
          .and.greaterThan(0);
        res.Amount.should.be.a.Number
          .and.above(0);
        res.Date.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Type.should.be.a.String
          .and.eql('withdrawal');
        res.UserType.should.be.a.String
          .and.eql('Dwolla');

        res.DestinationId.should.be.a.String
          .and.startWith('XXX');      // should be masked last four digits of bank account
        res.DestinationName.should.be.a.String
          .and.not.empty;

        res.Destination.should.be.an.Object
          .with.properties('Id', 'Name', 'Type', 'Image');
        res.Destination.Id.should.be.a.String
          .and.startWith('XXX');
        res.Destination.Name.should.be.a.String
          .and.not.empty;
        res.Destination.Type.should.be.a.String
          .and.eql('Dwolla');
        res.Destination.Image.should.be.a.String;

        res.SourceId.should.be.a.String
          .and.match(helper.patterns.dwollaId);
        res.SourceName.should.be.a.String
          .and.not.empty;

        res.Source.should.be.an.Object
          .with.properties('Id', 'Name', 'Type', 'Image');
        res.Source.Id.should.be.a.String
          .and.match(helper.patterns.dwollaId);
        res.Source.Name.should.be.a.String
          .and.not.empty;
        res.Source.Type.should.be.a.String
          .and.eql('Dwolla');
        res.Source.Image.should.be.a.String
          .and.match(helper.patterns.url);

        res.ClearingDate.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Status.should.be.a.String
          .and.eql('pending');
        (res.Notes == null).should.be.true;
        (res.Fees == null).should.be.true;
        (res.OriginalTransactionId == null).should.be.true;
        (res.Metadata == null).should.be.true;

        done();
      });
    });
  });

  describe('deposit from funding source to account balance', function() {
    it('Should be successful and return a valid response', function(done) {

      dwolla.setToken(config.accessToken);
      dwolla.depositFromFundingSource(config.pin, 5.00, config.fundingSource, function(err, res) {
        //sample:

        // { Id: 327844,
        // Amount: 5,
        // Date: '2014-09-05T06:40:57Z',
        // Type: 'deposit',
        // UserType: 'Dwolla',
        // DestinationId: '812-742-8722',
        // DestinationName: 'Cafe Kubal',
        // Destination:
        //  { Id: '812-742-8722',
        //    Name: 'Cafe Kubal',
        //    Type: 'Dwolla',
        //    Image: 'http://uat.dwolla.com/avatars/812-742-8722' },
        // SourceId: 'XXX9999',
        // SourceName: 'Blah',
        // Source: { Id: 'XXX9999', Name: 'Blah', Type: 'Dwolla', Image: '' },
        // ClearingDate: '2014-09-10T00:00:00Z',
        // Status: 'pending',
        // Notes: null,
        // Fees: null,
        // OriginalTransactionId: null,
        // Metadata: null }

        res.should.have.properties("Id", "Amount", "Date", "Type", "UserType", "DestinationId", "DestinationName", "Destination", "SourceId", "SourceName", "Source", "ClearingDate", "Status", "Notes", "Fees", "OriginalTransactionId", "Metadata");

        res.Id.should.be.a.Number
          .and.greaterThan(0);
        res.Amount.should.be.a.Number
          .and.above(0);
        res.Date.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Type.should.be.a.String
          .and.eql('deposit');
        res.UserType.should.be.a.String
          .and.eql('Dwolla');

        res.DestinationId.should.be.a.String
          .and.match(helper.patterns.dwollaId);
        res.DestinationName.should.be.a.String
          .and.not.empty;

        res.Destination.should.be.an.Object
          .with.properties('Id', 'Name', 'Type', 'Image');
        res.Destination.Id.should.be.a.String
          .and.match(helper.patterns.dwollaId);
        res.Destination.Name.should.be.a.String
          .and.not.empty;
        res.Destination.Type.should.be.a.String
          .and.eql('Dwolla');
        res.Destination.Image.should.be.a.String
          .and.match(helper.patterns.url);;

        res.SourceId.should.be.a.String
          .and.startWith('XXX');
        res.SourceName.should.be.a.String
          .and.not.empty;

        res.Source.should.be.an.Object
          .with.properties('Id', 'Name', 'Type', 'Image');
        res.Source.Id.should.be.a.String
          .and.startWith('XXX');
        res.Source.Name.should.be.a.String
          .and.not.empty;
        res.Source.Type.should.be.a.String
          .and.eql('Dwolla');
        res.Source.Image.should.be.a.String;

        res.ClearingDate.should.be.a.String
          .and.match(helper.patterns.ISOTimestamp);
        res.Status.should.be.a.String
          .and.eql('pending');
        (res.Notes == null).should.be.true;
        (res.Fees == null).should.be.true;
        (res.OriginalTransactionId == null).should.be.true;
        (res.Metadata == null).should.be.true;

        done();
      });
    });
  });
});