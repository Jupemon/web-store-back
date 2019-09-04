const handleSignin = ( req, res, db, bcrypt) => {

    const { email, password } = req.body; // get the email and password from body
    if (!email || !password) { // if email or password doesnt exist in json request return incorrect form submission
      return res.status(400).json('incorrect form submission');
    }
    db.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
  }

  module.exports = { // export the signin function
    handleSignin: handleSignin
  }