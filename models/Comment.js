const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


// need a unique identifier instead of the default _id field that is created, so we'll add a custom replyId field. 
const ReplySchema = new Schema(
    
    {
        // set custom id to avoid confusion with parent comment _id
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
        replyBody: {
            type: String,
            required: true,
            trim: true
        },
        writtenBy: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
          getters: true
        }
    }
);

const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    replies: [ReplySchema]
    
},
{
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
  );
/* add a virtual for CommentSchema to get the total reply count. 
We'll use this later to combine the reply count with the comment count
 so that users can get a full picture of the discussion around a pizza.*/
  CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
  });

const Comment = model('Comment', CommentSchema);

module.exports = Comment;