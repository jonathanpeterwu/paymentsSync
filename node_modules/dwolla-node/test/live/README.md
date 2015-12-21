# live integration tests

Here lies a nearly complete suite of tests to pit the library against our API (can be configured to hit production or sandbox (UAT)).

Hits the API and makes sure the data we get back makes sense, and is of the right data type.

# Getting started

You'll need to populate `test/live/config.js` with your API credentials and test user account credentials.

```js
module.exports = {
	accessToken: "",
	fundingSource: "",
	pin: "",
	merchantAccessToken: "",
	merchantPIN: "",
	merchantDwollaID: "",
	merchantEmail: "",
	appKey: "",
	appSecret: "",
	sandbox: true
};
```

To run all the tests, you'll need two accounts: one individual-type account with an attached funding source, and another merchant-type account.  The reason is, some of the tests require two accounts to implement, like Refund and Money Request.

For the individual-type account, provide an `accessToken` with all OAuth scopes (generate one using our [token generator](https://developers.dwolla.com/dev/token)), the account `pin`, and the attached `fundingSource` ID.

For the merchant-type account, provide an access token with all OAuth scopes for it via `merchantAccessToken`, the account's PIN in `merchantPIN`, Dwolla ID `merchantDwollaID`, and email address of merchant account: `merchantEmail`.

To test against production, set `sandbox` to `false`.

# Running

From the root of the project, run

`mocha test/live`

# Test coverage

All API functionality is covered except for:

- OAuth
- Checkouts / Complete
- Funding Sources / Add
- Funding Sources / Verify

because we're not using browser emulation to run through OAuth and the Gateway checkout, and only 2 funding sources are permitted per account at this time, which makes testing difficult.