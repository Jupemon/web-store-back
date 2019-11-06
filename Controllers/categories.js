const addCategory = (req, res, db) => { // add a category to database
    const {name, items} = req.body;
    console.log("workning")
    console.log(items)


    db.schema.alterTable('products', function(t) {
        t.text(name) // create a new text column, with name
      }).then(() => {
        db('categories').where('name', name).then(data => {
            console.log(data[0]);
            if (data.length > 0) {  // name already exists
                res.status(404);
                res.json("already exists");
            }
            else {
                db('categories')
                .insert({name : name, items : items})
                .then(() => {
                    res.status(200);
                    res.json("added");
                })
            }
        })
      })
      .catch(err => {
          res.json("category already exists")
      })
    
}/*
db.schema.table('test', function(t) {
    t.dropColumn(name);
})
.then(() => {
    res.json("category removed")
})
.catch(() => {
    res.status(400);
    res.json("category doesnt exist")
})*/
const removeCategory = (req, res, db) => {
    db.schema.table('products', function(t) {
        t.dropColumn(name);
      }).then(() => {
        db('categories').where('name', name)
        .del()
        .then( () => {
            res.status(200);
            res.json("category removed")
        })
      })
      .catch(err => {
          res.status(400);
          res.json("failed to delete category")
      })
}

const getCategories = (req, res, db) => { // send all categories to frontend GET

    db.select('*').from('categories').then(data => {
        console.log(data, "DATA SENT")
        res.json(data)
    })
}

module.exports = { // export the signin function
    getCategories: getCategories,
    addCategory : addCategory,
    removeCategory : removeCategory
  }