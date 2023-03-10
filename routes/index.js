var express = require("express");
const axios = require("axios");
var router = express.Router();
var secretKey = "";
const baseUrl = "https://api.stripe.com";

router.get("/", function (req, res, next) {
    res.render("index", { title: "Stripe" });
});

function step1_createPaymentIntent(amount) {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams();
        params.append("amount", amount);
        params.append("currency", "usd");
        params.append("customer", "cus_NUlvJCIihFkt5H");
        params.append("payment_method", "card_1MjqhDIentMRxMOauWJwy6Sw");
        params.append("confirm", "true");

        axios
            .post(`${baseUrl}/v1/payment_intents`, params, {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                },
            })
            .then(response => {
                // console.log(`BLAM! ${JSON.stringify(response.data)}`);
                resolve({ secret: response.data.client_secret });
            })
            .catch(error => {
                reject(error);
            });
    });
}

router.post("/authenticated", async function (req, res, next) {
    secretKey = req.body.skey;
    console.log(
        `Received: ${req.body.skey}, ${req.body.pan}, ${req.body.expm}, ${req.body.expy}, ${req.body.cvv}, ${req.body.amount}, ${req.body.radarSessionId}`,
    );

    try {
        var paymentIntentResponse = await step1_createPaymentIntent(req.body.amount);

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
