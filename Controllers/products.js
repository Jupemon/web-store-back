const express = require('express');
const fs = require('fs');

const deleteProduct = (req, res, db) => { // delete a product with a certain id POST
    const {id} = req.params
    console.log(id)
    
    db('products').where('productid', id)
    .then(data => {
        if (data.length > 0) {
            db('products').where('productid', id)
            .then(data =>  {
                fs.unlink(data[0].productimage, (err) => {
                    if (err) {
                        console.log(err, "error happened")
                        res.status(404)
                        res.json("image not found")
                    }
                    else {
                        db('products').where('productid', id)
                        .del()
                        .then(() => {
                            res.status(200)
                            res.json("image and item successfully deleted from database")
                        })
                        
                    }
                })

            })
        }
        else {
            res.json("not found")
        }
    })
    .catch(err => {
        res.status(404)
        res.json("not found")
    })

}

const addProduct = (req, res, db) => { // add a product to the database POST
    console.log("adding product")
    const path = req.file.path
    const {amount, price, manufacturer, name, color, taste, shape} = req.body;
    
    const objectToInsert = {}

        Object.entries(req.body).map(i => {
        objectToInsert[i[0]] = i[1]
    })
    objectToInsert.productimage = path

    console.log(objectToInsert, "BODY OF THE OBJECT OT INSETE")

    console.log(req.body)
        db('products').insert( 
            objectToInsert
        ).then(data => {
            res.status(400);
            res.json('product added');
        })
        .catch(er => {
            res.status(404);
            res.json("Couldnt add to database");
        })


}

const sendProducts = (req, res, db) => {

        db.select('*').from('products').then(data=> {

            const productData = data.map(product => { // remove unneeded data before sending to front
                delete product.productimage;
                return product
            })
            res.json(productData); // responds with some cool ass data
        });
}



const updateProduct = (req, res, db) => { // update product data PATCH
    const {amount, price, manufacturer, name, color, taste, shape} = req.body;
    const { id } = req.params;

    const objectToInsert = {}

    Object.entries(req.body).map(i => {
    objectToInsert[i[0]] = i[1]
    })


    console.log(id, "PATCH HAPPENED")
        db('products')
        .where('productid', id)
        .then(data => {
            if (data.length > 0) {
                console.log(req.body)
                console.log("found")
                db("products")
                .where('productid', id)
                .update(objectToInsert)
                .then(function() {
                    res.status(200);
                    res.json("changed");
                })
            }
            else {
                console.log("not found")
                res.json(data)
            }
        })


                            /*price: price ? price : data[0].price,
                    manufacturer: manufacturer ? manufacturer : data[0].manufacturer,
                    name: name ? name : data[0].name,
                    color: color ? color : data[0].color,
                    taste: taste ? taste : data[0].taste,
                    shape: shape ? shape : data[0].shape*/
    /*
    db('products')
    .where('ID', id)
    .then(data => {
        if (data.length > 0) {
            db('products').where('ID', id)
            .update( {
                
            })
            .then(function() {
                res.json("deleted")
            })
        }
        else {
            res.json("not found")
        }
    })*/
    //res.json("product updated")


}

module.exports = { // export the signin function
    addProduct: addProduct,
    deleteProduct : deleteProduct,
    updateProduct : updateProduct,
    sendProducts : sendProducts
  }