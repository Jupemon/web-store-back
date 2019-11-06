const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password, owner } = req.body; // destruct email, name, password from request
    console.log("REGISTER HAPPENS")
    //console.log(typeof owner, owner)
    const ownerValue = owner === "true";
    const hash = bcrypt.hashSync(password); // create an hash of the password
    //console.log(email, "EMAIL HERE");
    //console.log(name, "NAME HERE");

    db('users').where('email', email) // check for duplicate emails or usernames
    .then(data => {
        //console.log(data[0])
        if (data[0] === undefined) {
            console.log("no users by that email was found");
            db('users').where('name', name)
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
                                name: name,
                                owner : ownerValue
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

   
}


const unregister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body; // desctructure the emai, name, passwod

    db('users').where('email', email) // check for duplicate emails or usernames
    .then(data => {
        //console.log(data[0])
        if (data[0] !== undefined) {
            console.log("user with that email was found");
            db('users').where('name', name)
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
                            .where('name', name)
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

}

module.exports = { // export the signin function
    handleRegister: handleRegister,
    unregister : unregister
  }