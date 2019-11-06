const changeProfile = (req, res, db) => {
    const { id } = req.params;
    console.log(req.body)
    console.log(id)


    if (req.body.email) { // update email from login table and user table
        db('users').where("id", id)
        .then(data => {
            db('login').where("email", data[0].email)
            .update({email : req.body.email})
            .then(() => {
                db('users').where('id', id)
                .update(req.body)
                .then(() => {
                    console.log("email updated")
                    res.json("data changed")
                })
            })
        })
    }
/*
    db('users').where('email', email).orWhere('username', name)
    .then(data => {




                    .then((data) => {
                console.log(data, "RETURNING DATA")
                res.status(200)
                res.json(req.body)
            })
            .catch(err => {
                res.status(400)
                res.json("error")
            })
*/
}



module.exports = {
    changeProfile: changeProfile
  }