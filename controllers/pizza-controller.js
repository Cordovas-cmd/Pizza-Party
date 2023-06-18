const { Pizza } = require('../models');
const { db } = require('../models/Pizza');


/*   Side note : In MongoDB, the methods for adding data to a collection are 
 .insertOne() or .insertMany(). But in Mongoose, we use the .create() method, 
 which will actually handle either one or multiple inserts!
*/
const pizzaController = {
      // the functions will go in here as methods

      // get all pizzas (callback function for the GET /api/pizzas)
      getAllPizza(req, res) {
        Pizza.find({})
        .then(dbPizzaData => res.json (dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
      },

    //   get one pizza by id 
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id})
        .then(dbPizzaData => {
            // if no pizza is found, send a 404
            if(!dbPizzaData) {
                console.log(err);
                res.status(404).json({message: 'No pizza found with this id' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //Create custom Pizza

    // we destructure the body out of the Express.js req object 
    createPizza({ body }, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
    },


    // Update pizza by id


    /*Side Note:
    With this .findOneAndUpdate() method, Mongoose finds a single document we want to update, then updates it and returns the updated document. 
    If we don't set that third parameter, { new: true }, it will return the original document.
     By setting the parameter to true, we're instructing Mongoose to return the new version of the document. */



    updatePizza({ params, body }, res) { //method for updating a pizza when we make a request to PUT /api/pizzas/:id
        Pizza.findOneAndUpdate({_id: params.id }, body, { new: true})
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id, BUMMER!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    },




    // method to delete a pizza from the database when we make a request to DELETE /api/pizzas/:id
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.status(400).json(err));
      }
}


module.exports = pizzaController;