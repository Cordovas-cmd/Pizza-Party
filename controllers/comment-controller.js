const { Comment, Pizza } = require("../models");
const { db } = require('../models/Comment');

const commentController = {


    // add comment to a pizza
    // addComment({ params, body }, res) {
    //     // console.log(body);
    //     Comment.create(body)
    //         .then(({ _id }) => {
    //             return Pizza.findOneAndUpdate(
    //                 { _id: params.pizzaId },

    //                 /* Note here that we're using the $push method to add the comment's _id to the specific pizza we want to update. The $push method works just the same way that it works in JavaScript—it adds data to an array */
    //                 { $push: { comments: _id } },
    //                 { new: true}
    //             );
    //         })
    //         .then(dbPizzaData => {
    //             if(!dbPizzaData){
    //                 res.status(404).json({ message: 'No pizza found with this id!' });
    //                 return;
    //             }
    //             res.json(dbPizzaData);
    //         })
    //         .catch(err => res.json(err));
    // }
    
    addComment({ params, body }, res) {
        // console.log(body);
        Comment.create(body)
          .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
              { _id: params.pizzaId },
              { $push: { comments: _id } },
              { new: true }
            );
          })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      },

    //delete comment from pizza it’s associated with
    removeComment({ params }, res) {

        // .findOneAndDelete(), works a lot like .findOneAndUpdate() it deletes and returns the data
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if(!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id!' });
            }
                //  take that data and use it to identify and remove it from the associated pizza using the Mongo $pull operation.
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId} },
                { new: true }
            );
        })
        .then(dbPizzaData => {

            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = commentController;

