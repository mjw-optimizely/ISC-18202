async function createRadarSession() {
    const stripe = Stripe(
        "pk_test_51MikWFIentMRxMOaTOaruHHvKSOjEIHcpGCPPdtSFZmOub6WRjX04PANGooxoLl9BWD8FILWi9J4iN93OtvVuBEM000PYI8gQe",
    );

    const { radarSession, error } = await stripe.createRadarSession();

    if (error) {
        console.error(error);
        return null;
    }

    return radarSession;
}
