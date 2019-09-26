const express = require('express');


const getOrders = (req, res, db) => { // get orders GET
    db.select('*').from('orders').then(data => {
        res.json(data)
    })

}

const addOrder = (req, res, db) => {
    db('orders')
    .insert({
        
    })
}