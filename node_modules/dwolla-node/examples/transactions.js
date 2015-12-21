var cfg = require('./_config'); 
var Dwolla = require('dwolla-node')(cfg.apiKey, cfg.apiSecret);

// use a pre-set OAuth access token
Dwolla.setToken(cfg.accessToken);

// use the sandbox environment's API
Dwolla.sandbox = true;

/**
 * Example 1:
 *
 * Retrieve the 10 recentmost transactions for
 * the user associated with the configured OAuth
 * token.
 */

Dwolla.transactions(function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

/**
 * Example 2:
 *
 * Retrieve information about transaction ID '12345'
 * from the user with the authorized OAuth token.
 */

Dwolla.transactionById('12345', function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

/**
 * Example 3:
 *
 * Retrieve transaction statistics for the user
 * with the authorized OAuth token.
 */

Dwolla.transactionsStats(function(err, data){
  if (err) { console.log(err); }
  console.log(data);
});

/**
 * Example 4:
 *
 * Retrieve the 10 recentmost transactions which
 * have been facilitated by the requesting application.
 */

Dwolla.transactionsByApp(function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

/**
 * Example 5:
 *
 * Process a refund for transaction '123456'
 * with pin set in cfg.pin and funding source ID '7654321'
 * for amount $10.00
 */

Dwolla.refund(cfg.pin, '12345', '7654321', '10.00', function(err, data) {
  if (err) { console.log(err); }
  console.log(data);
});

/**
 * Example 6:
 * Schedule a transaction for 5.50 on 2015-09-09 to 812-111-1234
 */

Dwolla.schedule('1234', '812-111-1234', 5.50, '2015-09-09', function(err, data) {
  if (err) {console.log(err);}
  console.log(data);
});


/**
 * Example 7:
 * Get all scheduled transactions.
 */
Dwolla.scheduled(function(err, data) {
  if (err) {console.log(err);}
  console.log(data);
});

/**
 * Example 8:
 * Edit scheduled transaction with ID '12bfd5' 
 * to specify a new amount of 10.50
 */
Dwolla.editScheduled('12bfd5', cfg.pin, {amount: 10.50}, {function(err, data) {
  if (err) {console.log(err);}
  console.log(data);
});

/**
 * Example 9:
 * Delete scheduled transaction with ID '12bfd5'
 */
Dwolla.deleteScheduledById('12bfd5', function(err, data) {
  if (err) {console.log(err);}
  console.log(data);
});

/**
 * Example 10:
 * Delete all scheduled transactions.
 */
Dwolla.deleteAllScheduled(function(err, data) {
  if (err) {console.log(err);}
  console.log(data);
});

/**
 * Example 11:
 * Get scheduled transaction with ID 'abcd123'
 */
Dwolla.scheduledById('abcd123', function(err, data) {
  if (err) {console.log(err);}
  console.log(data);
});