    // imports
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('knex');
const multer = require('multer'); // used to parse form-data/multipart data
const storage = multer.diskStorage({ // specify a fold
    destination: function(req, file, cb) { // specify destination for the images
        cb(null, 'uploads'); // specify a folder where 
    },
    filename: function(req, file, cb) { // run any functions to images
        console.log(file, "FILE HERE")
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); // give the image file a name
    }
});

    // Middleware

const validateForm = require('./Middleware/validate-form');
const checkAuth = require('./Middleware/check-auth');
const validateInt = require('./Middleware/Validate/validate-params-integer');

const upload = multer({storage: storage}); // set the storage for multer uploads

const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

/* SETUP REDIS
const redis = require('redis')
const redisClient = redis.createClient({host: '127.0.0.1'});
*/

    // controllers
const profile = require('./Controllers/profile')
const filters = require('./Controllers/filters');
const image = require('./Controllers/image');
const categories = require('./Controllers/categories')
const signin = require('./Controllers/signin');
const products = require('./Controllers/products');
const orders = require('./Controllers/orders');
const register = require('./Controllers/register');

    // Parsing

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())

    // prevent unauthorized acces, used in every request
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Orgin', '*');
    res.header(
        "Access-Control-Allow-Headers",
        "Orgin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({
            info : "not allowed, dont know why"
        })
    }
    next();
})*/

    // DB connection

const db = process.env.DATABASE_URL ? knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
}) : knex({
    client: 'pg',
    connection: {
        
        host: '127.0.0.1',
        user : 'postgres',
        password : 'test',
        database: 'postgres'

    }});

    // Select data for testing purposes

//db('categories').update({ items : ["Black", "Blue", "Red", "Brown", 'Black', 'Yellow','Pink', 'Green','Orange', 'White']}).then((data) => {console.log(data)})
//db('categories').insert({name : "shape", items: ["Animal", "Ring", "Ball"]}).then(() => {console.log("inserted")})
db.select('*').from('categories').then( data => {
    console.log(data)
})
/*
db.select('*').from('users').then(data=> {
    console.log(data);
}).then(db('*').from('login').then(data => {
    console.log(data)
}))*/

/*
db.select('*').from('users').where('email', '=', "ttttt")
.update({email : "owner@gmail.com"})
.then(data => {
    if (data.length > 0) {
        console.log("user with that email exists")
    }
})
*/

app.post('/test', upload.single('productImage'), (req, res, next) => {
    console.log(req.body, "BODY OF REQUEST");
    console.log(req.file)
    console.log("testing worked");
    res.json("ok")
})

app.get('/', (req, res) => {
    console.log("working")
    res.json("working"); // responds with some cool ass data
})

    // Endpoints ,
//checkAuth validateForm, upload.single('productImage'),
app.get('/getgoogleauthlink', (req, res) => {})
app.post('/changeprofile/:id', (req, res) => {profile.changeProfile(req, res, db)})
app.post('/addfilter', checkAuth, (req, res) => {filters.addFilter(req, res, db)})
app.post('/unregister', (req, res) => {register.unregister(req, res, db, bcrypt)}) // deletes a user
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/getproducts', (req, res) => {products.sendProducts(req, res, db)})
app.get('/image/:id', (req, res) => {image.serveImage(req, res, db)})
app.get('/mostpopular/:amount', validateInt, (req, res) => {products.mostPopular(req, res, db)})
app.post('/deletecategory', (req, res) => {categories.removeCategory(req, res, db)});
app.post('/addcategory', (req, res) => {categories.addCategory(req, res, db)})
app.get('/getcategories', (req, res) => {categories.getCategories(req, res, db )})
app.get('/getitem', (req, res) => {products.get})
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt) })
app.post('register', (req, res) => {})
app.post('/addproduct', upload.single("productImage"), (req, res) => { products.addProduct(req, res, db)})
app.post('/deleteproduct/:id', checkAuth, (req, res) => { products.deleteProduct(req, res, db)})
app.patch('/updateproduct/:id', checkAuth, upload.none(), (req, res) => { products.updateProduct(req, res, db)})


/*
app.get('/products', (req, res) => {
    const {color, taste, shape} = req.query;
    db('products').where('color', color).orWhere('category', "Hard Candy").then(data => {
        console.log("start here", data, "this should be data from transaction")
    })
    console.log(color);
    /*
    const { colors, tastes, shapes} = req.query
    console.log(colors.split(','))
    if (colors !== undefined) {
        console.log("color exists");
        db('products').where({
            color: colors[0],
            category: "Fruity Candy",
            price: 1.29
        }).then(data => {
            console.log(data);
        })
        .catch(data => {
            console.log(colors, tastes, shapes);
        })
    }
    if (tastes !== undefined) {
        console.log("taste exists")
    }
    if (shapes !== undefined) {
        console.log("shape exists")
    }
    console.log(color, taste, shape);
    //console.log(req.params.taste);
   // console.log(req.params.shape);
    console.log();
    
})
*/


/*
app.get('/', (req, res) => {
    const id = "271"
    db('products').where('ID', id).then(data => {
        //res.type('png').sendFile(`C:/Users/Juho/Documents/ecommerce-back/images/${id}.png`);
        res.send(`<img src=C:/Users/Juho/Documents/ecommerce-back/images/${id}.png>`);
    })
})*/
/*
app.get('/profile/:id', (req, res) => {
    const { id } = req.params; // take id from request parameter
    
    db('users')
    .where({ id })
    .update({ name })
    .then( response => {
      if (response) {
        res.json("success")
      }
      else {
        res.status(400).json("Unable to update")
      }
    })
    .catch(err => res.status(400).json("error when updating the user"))
    
})
*/

/*
app.post('/changeprofile/:id', (req, res) => {

    
    
})
app.post('/unregister', (req, res) => { // deletes a user
    const {email, name, password} = req.body; // desctructure the emai, name, passwod


    db('users').where('email', email) // check for duplicate emails or usernames
    .then(data => {
        //console.log(data[0])
        if (data[0] !== undefined) {
            console.log("user with that email was found");
            db('users').where('username', name)
            .then(data=> {
                //console.log(data[0]);
                if (data[0] !== undefined) {
                    console.log("user with that name was found")
                    db('login').where('email', email)
                        .then(hs => {
                        console.log(hs[0].hash, "AND");
                        console.log(bcrypt.compareSync(password, hs[0].hash))
                        const isValid = bcrypt.compareSync(password, hs[0].hash);
                        if (isValid) {
                            console.log("hash matches");
                            db('users')
                            .where('username', name)
                            .del()
                            .then(data => {
                                db('login').where('email', email)
                                .del()
                                .then( data => {
                                    console.log("user deleted from users and login table");
                                    res.json("User deleted from database"); // responds with some cool ass data
                                })
                            })
                        }
                        else {
                            res.json('Hash doesnt match');
                        }
                    })
                    
                }
                else {
                    console.log("username doesnt exist")
                    res.json("failed to delete user from database"); // responds with some cool ass data
                    
                }
            })
        }
        else {
            console.log("email doesnt exist")
            res.json("failed to delete user from database"); // responds with some cool ass data
            
        }
    })

    
})

*/
/*
/signin
/register
/profile
/placeOrder
/getitem


*/
    // Error handling

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

    // Port

//3000 process.env.PORT
app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT || 3000}`)
})
