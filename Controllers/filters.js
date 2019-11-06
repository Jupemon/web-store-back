const addFilter = (req, res, db) => {
    const {name, items} = req.body;

    db('categories').where('name', name)
    .then(data => {
        const dbData = data[0];
        items.map(i => {
            if (!dbData.items.includes(i)) { // if filter doesnt exist in database, push it to it
                dbData.items.push(i)
            }
        })
        db('categories').where('name', name)
        .update({items : dbData.items})
        .then(() => {
            res.status(200);
            res.json(dbData.items)
        })
    })

}


module.exports = {
    addFilter: addFilter
  }