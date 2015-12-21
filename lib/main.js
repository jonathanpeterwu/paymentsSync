var request         = require('request'),
    moment          = require('moment'),
    crypto          = require('crypto');

// Globals
var PLAID_SANDBOX = 'https://tartan.plaid.com/',
    PLAID_API = 'https://api.plaid.com/ ';

var COINBASE_API = 'https://api.coinbase.com',
    COINBASE_SANDBOX = 'https://sandbox.coinbase.com';

var DWOLLA_API = 'https://www.dwolla.com',
    DWOLLA_SANDBOX = 'https://uat.dwolla.com/';

var STRIPE_API = 'https://api.stripe.com/v1',
    STRIPE_SANDBOX = 'https://api.stripe.com/v1';


////
//   REQUEST HANDLERS
////

// Create api signature
var createApiSignature = function(platform, publicKey, privateKey) {
  if (platform === 'COINBASE') {
    var date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    var key = privateKey + date.toString();
    var hmac = crypto.createHash('sha1').update(key).digest('hex');
    return {
      DATE: date,
      SIGNATURE: hmac,
      APIKEY: publicKey,
      'Content-Type': 'application/json'
    };
  }
  if (platform === 'DWOLLA') {
    var date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    var key = privateKey + date.toString();
    var hmac = crypto.createHash('sha1').update(key).digest('hex');
    return {
      DATE: date,
      SIGNATURE: hmac,
      APIKEY: publicKey,
      'Content-Type': 'application/json'
    };
  }
  if (platform === 'PLAID') {
    var date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    var key = privateKey + date.toString();
    var hmac = crypto.createHash('sha1').update(key).digest('hex');
    return {
      DATE: date,
      SIGNATURE: hmac,
      APIKEY: publicKey,
      'Content-Type': 'application/json'
    };
  }
  if (platform === 'STRIPE') {
    var date = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    var key = privateKey + date.toString();
    var hmac = crypto.createHash('sha1').update(key).digest('hex');
    return {
      DATE: date,
      SIGNATURE: hmac,
      APIKEY: publicKey,
      'Content-Type': 'application/json'
    };
  }
};

var createMethod = function(method, publicKey, privateKey, sandbox, platform) {
  return function(uri, data, cb) {
    if (typeof data === 'function') {
      cb = data;
      data = {};
    } else if (['string', 'number'].indexOf(typeof data) !== -1) {
      data = { id: data };
    }

    var signature = createApiSignature(platform, publicKey, privateKey);

    var options = {
      method: method,
      headers: signature
    };

    if (platform === 'COINBASE') {
      options.uri: (sandbox ? COINBASE_SANDBOX : COINBASE_API) + uri,
    }
    if platform === 'PLAID' {
      options.uri: (sandbox ? PLAID_SANDBOX : PLAID_API) + uri,
    }
    if platform === 'DWOLLA' {
      options.uri: (sandbox ? DWOLLA_SANDBOX : DWOLLA_API) + uri,
    }
    if platform === 'STRIPE' {
      options.uri: (sandbox ? STRIPE_SANDBOX : STRIPE_API) + uri,
    }

    // Add data to request
    if (method === 'GET' || method === 'DELETE') options.qs = data || {};
    else options.json = data || {};

    request(options, globalResponseHandler(cb).bind(this));
  };
};


////
//   RESPONSE HANDLERS
////

var globalResponseHandler = function(cb) {
  return function(err, res, body) {
    if (typeof cb !== 'function') return;

    // Catch connection errors
    if (err || !res) {
      var returnErr = 'Error connecting to ' + platform;
      if (err) returnErr += ': ' + err.code;
      err = returnErr;
    } else if (res.statusCode !== 200) {
      err = 'Something went wrong.'+ platform +' responded with a ' + res.statusCode;
      err += '\n Error Body Response is ' + res.body;
    }
    if (err) return cb(err, null);

    // Try to parse response
    if (body !== Object(body)) {
      try {
        body = JSON.parse(body);
      } catch(e) {
        return cb('Could not parse response from '+ platform + ': ' + body, null);
      }
    }

    // Check for error returned in a 200 response
    if (body.opstat === 'error') {
      if (body.err) return cb(body.err);
      return cb(err);
    }

    // Make sure response is OK
    if (body.opstat === 'ok') body = body.response;

    // Return response
    cb(null, body);
  };
};



////
//   PUBLIC API
////

module.exports = function(publicKey, privateKey, sandbox, platform) {
  var sendGet = createMethod('GET', publicKey, privateKey, sandbox, platform),
      sendPost = createMethod('POST', publicKey, privateKey, sandbox, platform),
      sendPut = createMethod('PUT', publicKey, privateKey, sandbox, platform),
      sendDelete = createMethod('DELETE', publicKey, privateKey, sandbox, platform);
      sendPathc = createMethod('PATCH', publicKey, privateKey, sandbox, platform);

  var getId = function(data) {
    return data.id;
  }
  // RETURN API
  return {
    stripe: {
      account: {
        create: function(data,cb) {
          sendPost('/customers', data, cb);
        },
        info: function(data, cb) {
          sendGet('/customers/' + getId(data), cb);
        }
      },
      transaction: {
        create: function(data,cb) {
          sendPost('/charges', data, cb);
        },
        info: function(data, cb) {
          sendGet('/charges' + getId(data), cb);
        }
      }
    },
    dwolla: {
      account: {
        create: function(data,cb) {
          sendPost('/customers', data, cb);
        },
        info: function(data, cb) {
          sendGet('/customers/' + getId(data), data, cb);
        }
      },
      funding: {
        create: function(data, cb) {
          sendPost('customers/' + getId(data) + '/funding-sources', data, cb);
        },
        info: function(data, cb) {
          sendGet('/funding-sources/' + getId(data), data, cb);
        },
        list: function(data, cb) {
          sendGet('accounts/' + getId(data) + '/funding-sources', data, cb);
        }
      },
      transfer: {
        create: function(data,cb) {
          sendPost('/transfers', data, cb);
        },
        info: function(data, cb) {
          sendGet('/transfers/' + getId(data), data, cb);
        },
        customers: function(data, cb) {
          sendGet('/customers/' + getId(data) + '/transfers', data, cb);
        },
        account: function(data, cb) {
          sendGet('/transfers' + getId(data), data, cb);
        },
      }
    },
    plaid: {
      account: {
        create: function(data,cb) {
          sendPost('/connect', data, cb);
        },
        mfa: function(data, cb) {
          sendPost('/connect/step', data, cb);
        },
        inf: function(data, cb) {
          sendGet('/auth/get', data, cb)
        },
        balance: function(data, cb) {
          sendGet('/balance', data, cb)
        }
        update: function(data, cb) {
          sendPatch('/auth', data, cb);
        },
        delete: function(data, cb) {
          sendDelete('/auth', data, cb);
        }
      },
      institution: {
        info: function(data, cb) {
          sendGet('/institutions', data, cb);
        },
        list: function(data, cb) {
          sendGet('/institutions' + getId(data), cb);
        }
      }
    },
    coinbase: {
      account: {
        create: function(data,cb) {
          sendPost('/url', data, cb);
        },
        info: function(data, cb) {
          sendGet('/url', data, cb);
        }
      },
      transaction: {
        create: function(data,cb) {
          sendPost('/transaction/create', data, cb);
        },
        info: function(data, cb) {
          sendGet('/transaction/info', data, cb);
        }
      }
    },
    putExamplee: function(params, data, cb) {
      sendPut('clients/projects/' + getProject(params), data, cb);
    }
  };
};
