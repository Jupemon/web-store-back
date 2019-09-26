const express = require('express');

const deleteProduct = (req, res, db) => { // delete a product with a certain id POST
    const {id} = req.params
    console.log(id)
    
    db('products').where('ID', id)
    .then(data => {
        if (data.length > 0) {
            db('products').where('ID', id)
            .del()
            .then(function() {
                res.json("deleted")
            })
        }
        else {
            res.json("not found")
        }
    })


}

const addProduct = (req, res, db) => { // add a product to the database POST
    const path = req.file.path
    const {amount, price, manufacturer, name, ID, color, taste, shape} = req.body;
    if (amount && price && manufacturer && name && ID && color && taste && shape) {

        db('products').insert( {
            amount: amount,
            price : price,
            manufacturer : manufacturer,
            name : name,
            ID : ID,
            color : color,
            taste : taste,
            shape : shape,
            productimage : path

        }).then(data => {
            res.json('product added')
        })
        .catch(er => {
            res.status(404);
            res.json("Couldnt add to database");
        })
    }
    else {
        res.json("wrong")
    }



}

const updateProduct = (req, res, db) => { // update product data PATCH
    const {amount, price, manufacturer, name, color, taste, shape} = req.body;
    const { id } = req.params;

        db('products')
        .where('ID', id)
        .then(data => {
            if (data.length > 0) {
                console.log("found")
                db("products")
                .where('ID', id)
                .update({
                    amount: amount ? amount : data[0].amount,
                    price: price ? price : data[0].price,
                    manufacturer: manufacturer ? manufacturer : data[0].manufacturer,
                    name: name ? name : data[0].name,
                    color: color ? color : data[0].color,
                    taste: taste ? taste : data[0].taste,
                    shape: shape ? shape : data[0].shape
                })
                .then(function() {
                    res.json("changed")
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
    updateProduct : updateProduct
  }