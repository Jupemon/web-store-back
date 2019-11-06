
module.exports = (req, res, next) => { // checks if all form data exists for adding a new product
        const {price, manufacturer, name, color, taste, shape, amount}= req.body;
        
    try {
        if (amount.length>0 && price.length>0 && manufacturer.length>0 && name.length>0 && color.length>0 && taste.length>0 && shape.length>0) {
            console.log("ALL OF THE FORM DATA EXISTS AND IS VALID");
            next();
        }
        else {
            return res.status(402).json({
                message: "Invalid form-data"
            })
        }
    }
    catch (error) {
        return res.status(401).json({
            message: "Form data slots empty"
        });
    }
};