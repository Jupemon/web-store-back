module.exports = (req, res, next) => { // Validates the int to be a positive number above 0
    const {amount}= req.params;
    
try {
    var n = Math.floor(Number(amount));
    if (n !== Infinity && String(n) === amount && n >= 0) {
        next();
    }
    else {
        throw ("parameter is not valid")
    }
    

}
catch (error) {
    return res.status(400).json({
        message: "Invalid parameter"
    });
}
};