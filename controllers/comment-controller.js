const { Comment, Pizza } = require("../models");
const { db } = require('../models/Comment');

const commentController = {


  // add comment to pizza
    addComment({ params, body }, res) {
        // console.log(body);
        Comment.create(body)
          .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
              { _id: params.pizzaId },
              /* Note here that we're using the $push method to add the comment's _id to the specific pizza we want to update.
               The $push method works just the same way that it works in JavaScript—it adds data to an array */
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


      // add reply (because it exists inside commendt. )
      addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
          // add the reply to the correct comment
          { _id: params.commentId },
          // push the body of the reply to the empty reply array can also use $addToSet (works the same as push except avoids duplicates) to avoid duplicates
          { $push: { replies: body } },
          { new: true }
        )
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      },

      // remove reply

      // remove reply
removeReply({ params }, res) {
  Comment.findOneAndUpdate(
    { _id: params.commentId },
    /* using the MongoDB $pull operator to remove the specific reply from the replies array 
    where the replyId matches the value of params.replyId passed in from the route.*/
    { $pull: { replies: { replyId: params.replyId } } },
    { new: true }
  )
    .then(dbPizzaData => res.json(dbPizzaData))
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

