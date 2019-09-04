const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user : 'postgres',
        password : 'test',
        database: 'postgres'
    }
});




db.select('*').from('users').then(data=> {
    console.log(data);
});

app.get('/image/:id', (req, res) => { // sends an image based on the id of parameters
    const { id } = req.params;
    db('products').where('ID', id).then(data => {
        res.sendFile(`C:/Users/Juho/Documents/ecommerce-back/images/${id}.png`);
    })
})

app.get('/', (req, res) => {
    const id = "271"
    db('products').where('ID', id).then(data => {
        //res.type('png').sendFile(`C:/Users/Juho/Documents/ecommerce-back/images/${id}.png`);
        res.send(`<img src=C:/Users/Juho/Documents/ecommerce-back/images/${id}.png>`);
    })
    
})
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


app.post('/register', (req, res) => { // adds a new users to the users table
    const {email, name, password } = req.body; // destruct email, name, password from request
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
                    db('users').insert({ // insert user into the database
                        email: email,
                        username: name
                    })
                    .then(data => {
                        console.log("user added to database");
                        res.json("User added to database");
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

app.get('/getproducts', (req, res) => { // gets all products from  db
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
                    db('users')
                    .where('username', name)
                    .del()
                    .then(data => {
                        console.log("user deleted from database");
                        res.json("User deleted from database"); // responds with some cool ass data
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
/getitem


*/


app.listen(3000, () => {
    console.log('app is running on port 3000')
})
