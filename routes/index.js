var express = require("express");
const axios = require("axios");
var router = express.Router();
var secretKey = "";
const baseUrl = "https://api.stripe.com";

router.get("/", function (req, res, next) {
    res.render("index", { title: "Stripe" });
});

function createPaymentIntent(amount) {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        // This is how you request 3DS verification
        params.append("payment_method_options[card][request_three_d_secure]", "any");
        // This payment method value was created with
        // https://api.stripe.com/v1/customers/cus_NUlvJCIihFkt5H/sources. See Postman collection.
        params.append("payment_method", "card_1MjqhDIentMRxMOauWJwy6Sw");
        // This customer value was created with https://api.stripe.com/v1/customers. See Postman collection.
        params.append("customer", "cus_NUlvJCIihFkt5H");
        params.append("currency", "usd");
        params.append("confirm", "true");
        params.append("amount", amount);

        axios
            .post(`${baseUrl}/v1/payment_intents`, params, {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                },
            })
            .then(response => {
                resolve({ secret: response.data.client_secret });
            })
            .catch(error => {
                reject(error);
            });
    });
}

router.post("/authenticated", async function (req, res, next) {
    secretKey = req.body.skey;
    console.log(`Received: ${req.body.skey}, ${req.body.amount}`);

    try {
        var paymentIntentResponse = await createPaymentIntent(req.body.amount);

        res.render("enter_card", { secret: paymentIntentResponse.secret });
    } catch (error) {
        res.render("error", { message: JSON.stringify(error) });
    }
});

router.get("/handle_redirect", async function (req, res, next) {
    res.render("handle_redirect", {
        payment_intent: req.query.payment_intent,
        payment_intent_client_secret: req.query.payment_intent_client_secret,
        redirect_status: req.query.redirect_status,
    });
});

module.exports = router;
