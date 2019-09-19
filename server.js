const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

/* SETUP REDIS
const redis = require('redis')
const redisClient = redis.createClient({host: '127.0.0.1'});
*/


const signin = require('./Controllers/signin');

app.use(bodyParser.json());
app.use(cors());

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

db.select('*').from('users').then(data=> {
    console.log(data);
}).then(db('*').from('login').then(data => {
    console.log(data)
}))

/*
app.get('mostpopular'), (req, res) => {
    
}
*/

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

app.get('/image/:id', (req, res) => { // sends an image based on the id of parameters
    const { id } = req.params;
    db('products').where('ID', id).then(data => {
        res.sendFile(__dirname + `/new-images/${id}.png`);
        //res.sendFile(`:/images/${id}.png`);
    })
})
app.get('/', (req, res) => {
    res.json("working"); // responds with some cool ass data
})
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

app.get('/getproducts', (req, res) => { // gets all products from  db
    db.select('*').from('products').then(data=> {
        res.json(data); // responds with some cool ass data
    });
})


app.get('/sendtoken/:email', (req, res)=> { // signs a token and sends it to frontend
    const { email } = req.params;
    console.log(email)
    res.json(jwt.sign(email, "secret"))
})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })


app.post('/register', (req, res) => { // adds a new users to the users table
    const {email, name, password } = req.body; // destruct email, name, password from request
    console.log("REGISTER HAPPENS")

    const hash = bcrypt.hashSync(password); // create an hash of the password
    //console.log(email, "EMAIL HERE");
    //console.log(name, "NAME HERE");

    db('users').where('email', email) // check for duplicate emails or usernames
    .then(data => {
        //console.log(data[0])
        if (data[0] === undefined) {
            console.log("no users by that email was found");
            db('users').where('username', name)
            .then(data=> {
                //console.log(data[0]);
                if (data[0] === undefined) {
                    console.log("no usernames or emails by that name");

                    db.transaction(trx => {
                        trx.insert({
                            hash: hash,
                            email: email
                        })
                        .into('login') // insert hash and email into login
                        .returning('email') // return the email from the table
                        .then(loginEmail => { // email returned
                            return trx('users')
                            .returning('*') // returnig everything from users 
                            .insert({
                                email: loginEmail[0],
                                username: name
                            })
                            .then(user => {
                                res.json("User added to database");
                            })
                        })
                        .then(trx.commit)
                        .catch(trx.rollback)
                    })

                    
                }
                else {
                    console.log("usernames already exists")
                    res.json("failed to add user to database"); // responds with some cool ass data
                }
            })
        }
        else {
            console.log("email already exists")
            res.json("failed to add user to database"); // responds with some cool ass data
        }
    })

   
})



app.post('/changeprofile/:id', (req, res) => {

    const {email, name} = req.body
    const { id } = req.params;
    console.log("THIS", id, email, name)
    db('users').where('email', email).orWhere('username', name)
    .then(data => {
        if (data[0]===undefined) {
            console.log("no dublicate users found")
            db('users').where('id', id)
    .then(data => {
        db('login').where('email', data[0].email)
        .update({ email : email })
        .then(data => {
            db('users').where('id', id)
            .update({ username:name, email:email })
            .then(data => {
                res.json("data changed")
            })
        })
    })
    .catch(err => {
        console.log(err, "RERER");
        res.json("id not found")
    })
    /*
    db('users').where('id', id) // select from users where id is equal to id
    .update( {email : email, username: name}) // update email and name*/
    .then(em => { // 

        
    })
    
    
        }
    
        else {
            console.log("dublicate exists")
            res.json("dublicate username or email exists");
        }
    })
    .catch(err => {
        console.log("getting data didint work")
        res.json("error while getting data")
    })
    
})

app.get('/getproducts', (req, res) => { // gets all products from  db
    db.select('*').from('products').then(data=> {
        res.json(data); // responds with some cool ass data
    });
})

app.get('/mostpopular', (req, res) => { // returns the most popular products
    db.select('*').from('products').then(data=> {
        res.json(data); // responds with some cool ass data
    });
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
                        console.log(hs, "AND");
                        const isValid = bcrypt.compareSync(password, hs[0]);
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


/*
/signin
/register
/profile
/placeOrder
/getitem


*/

//3000 process.env.PORT
app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT || 3000}`)
})
