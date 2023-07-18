const router = require('express').Router();
const { addComment, removeComment,  addReply, removeReply } = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router.route('/:pizzaId')
.post(addComment);

// /api/comments/<pizzaId>/<commentId>
router.route('/:pizzaId/:commentId')
.delete(removeComment);

router
  .route('/:pizzaId/:commentId')
//   this is a put because we're just updating a comment.
  .put(addReply)
  .delete(removeComment)

  /* we're trying to model the routes in a RESTful manner, 
  so as a best practice we should include the ids of the parent resources in the endpoint.*/
  router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;