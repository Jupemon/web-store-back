const options = { // options for the image serving
    root: 'uploads'
}

const serveImage = (req, res, db) => {
    const { id } = req.params;
    db('products').where('productid', id).then(data => {
        console.log(data[0].productimage, "PRODUCT IMAGE DATA HERE")
        console.log(data[0].productimage.replace("uploads", ""), "PRODUCT DATA CHANGED HERE")
        res.sendFile(data[0].productimage.replace("/uploads", ""), options, (err) => {
            if (err) {
                res.status(404);
                res.json(err)
            }
            else {
                console.log( "file sent")
            }
        })
        //res.sendFile(__dirname + `/new-images/${id}.png`);
        //res.sendFile(`:/images/${id}.png`);
    })
}

module.exports = { // export the signin function
    serveImage: serveImage
  }