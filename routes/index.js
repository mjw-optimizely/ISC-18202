var express = require("express");
const axios = require("axios");
var router = express.Router();
var secretKey = "";
const baseUrl = "https://api.stripe.com";

router.get("/", function (req, res, next) {
    res.render("index", { title: "Stripe" });
});

router.post("/authenticated", async function (req, res, next) {
    res.render("result", {
        status: "Good",
        data: `Received: ${req.body.skey}, ${req.body.pan}, ${req.body.expm}, ${req.body.expy}, ${req.body.cvv}, ${req.body.radarSessionId}`,
    });
});

module.exports = router;
