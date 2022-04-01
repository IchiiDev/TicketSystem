function renewTokenEndpoint(req, res) {
    res.status(200).json({ message: "Token still valid" });
}

module.exports = { renewTokenEndpoint };