var should = require('should');
var config = require('./config.js');
var helper = require('./helper.js');

var dwolla = require('../../lib/dwolla')(config.appKey, config.appSecret);

dwolla.sandbox = config.sandbox;

describe('Contacts', function() {
  describe('get contacts', function() {
    it('Should be successful and return a valid response', function(done) {
      dwolla.setToken(config.accessToken);
      dwolla.contacts(function(err, res) {
        //sample:
        //  { Name: 'GORDCORP',
        // Id: '812-740-4294',
        // Type: 'Dwolla',
        // Image: 'http://uat.dwolla.com/avatars/812-740-4294',
        // City: 'Test',
        // State: 'NY' }

        res.should.be.an.Array
          .and.not.be.empty;      // warning: account must have at least one contact.
        
        contact = res[0];

        contact.Name.should.be.a.String;
        contact.Id.should.be.a.String
          .and.match(helper.patterns.dwollaId);
        contact.Type.should.be.a.String
          .and.eql('Dwolla');   // this is the only Type a contact can have at this time.
        contact.Image.should.be.a.String
          .and.match(helper.patterns.url)
        contact.City.should.be.a.String;
        contact.State.should.be.a.String
          .and.have.length(2);

        done();
      });
    });
  });

  describe('get nearby spots', function() {
    it('Should be successful and return a valid response', function(done) {
      dwolla.nearby('41.5', '-93.7', function(err, res) {       
        //sample:
        // [ { Name: 'Rocket Gear',
        //     Id: '812-742-6826',
        //     Type: 'Dwolla',
        //     Image: 'http://uat.dwolla.com/avatars/812-742-6826',
        //     Latitude: 41.58975983,
        //     Longitude: -93.61564636,
        //     Address: '123 Test Ave\n',
        //     City: 'Des Moines',
        //     State: 'IA',
        //     PostalCode: '50169',
        //     Group: '812-742-6826',
        //     Delta: 0.17411347000000177 } ]

        res.should.be.an.Array
          .and.not.be.empty;

        spot = res[0];

        spot.Name.should.be.a.String;
        spot.Id.should.be.a.String
          .and.match(helper.patterns.dwollaId);
        spot.Type.should.be.a.String
          .and.eql('Dwolla');   // this is the only Type a spot can have at this time.
        spot.Image.should.be.a.String
          .and.match(helper.patterns.url);
        spot.Latitude.should.be.a.Number
          .and.within(-90, 90);
        spot.Longitude.should.be.a.Number
          .and.within(-180, 180);
        spot.Address.should.be.a.String;
        spot.City.should.be.a.String;
        spot.State.should.be.a.String
          .and.have.length(2);
        spot.PostalCode.should.be.a.String
          .with.length(5);
        spot.Group.should.be.a.String;
        spot.Delta.should.be.a.Number
          .and.above(-0.00001);     // should be greater than or equal to 0.

        done();
      });
    });
  });

});