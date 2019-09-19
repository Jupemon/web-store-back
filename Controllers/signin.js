const jwt = require('jsonwebtoken');

const handleSignin = ( req, res, db, bcrypt) => {

  const {email, password} = req.body; // get the email and password from body

  //email && password ? createSessions() : 

  console.log(email, password, "LOGIN DAAT");
  if (!email || !password) { // if email or password doesnt exist in json request return incorrect form submission
      return res.status(400).json('incorrect form submission');
    }
  db.select('email', 'hash').from('login') // get email and hash from login table
      .where('email', '=', email) // select the row where email is equal to req.email
      .then(data => {
          const isValid = bcrypt.compareSync(password, data[0].hash);
          if (isValid) {

              db.select('*').from('users')
            .where('email', '=', email)
            .then(data => {
                if (data.length > 0) {
                  res.json(data);
                }
                else {
                    res.status(400).json("Fail");
                }
                
            })
            .catch(err => res.status(400).json('wrong credentials'))
      
          }
      else {
          res.status(400).json("Fail");
      }

      })
      .catch(err => {
          console.log("error happened");
          res.json("Fail")
      })
    }

const getAuthtokenid = () => {
  console.log("auth ok")
}

const createSessions = (user) => {

}

const signInAuth = (db, bcrypt) => (req, res) => { // check if we have autorization
  const { autorization } = req.headers; // if we dont, handle sign in normally
  return autorization ? // if we have auth, log in with token
  getAuthtokenid() : 
  handleSignin(db, bcrypt, req, res)
}

  module.exports = { // export the signin function
    handleSignin: handleSignin,
    
  }