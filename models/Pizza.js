// create a schema, using the Schema constructor we imported from Mongoose, and define the fields with specific data types
const dateFormat = require('../utils/dateFormat');

const { Schema, model } = require('mongoose');

// Side note: We don't have to define the fields, as MongoDB will allow the data anyway, but for for clarity and usability, we should regulate what the data will look like. 

const PizzaSchema = new Schema ({
    pizzaName: {

        //  Simply instruct the schema that this data will adhere to the built-in JavaScript data types, including strings, Booleans, numbers, and so on.
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // use getters to transform the data by default every time it's queried.
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        default: "Large"
    },
    toppings: [],
    // We need to tell Mongoose to expect an ObjectId and to tell it that its data comes from the Comment model.
    comments: [
        {
            type: Schema.Types.ObjectId,
            // The ref property is especially important because it tells the Pizza model which documents to search to find the right comments.
            ref: 'Comment'
        }
      ]
},


// we need to tell the schema that it can use virtuals.
// To do so, you'll need to add the toJSON property to the schema options.

{
    toJSON: {
      virtuals: true,
      getters: true
    },
    // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    id: false
  }
);

//  Side Note:  Virtuals allow us to add more information to a database response so that we don't have to add in the information manually with a helper before responding to the API request.
// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
  });

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;