const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// It will add the currency type to the mongoose data types. 
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema(
    {
        rating : {
            type : Number,
            min : 1,
            max : 5,
            required : true
        },
        comment : {
            type : String,
            required : true
        },
        author : {
            type : String,
            required : true
        }
    },
    // We can also have a mongoose automatically timestamps inserted into our model
    // By enabling this timestamps it will automaticall adds two timestamps created at
    //  and updated at for each document stored in our model.
    {
        timestamps : true
    }
)

const dishSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
            unique : true
        },
        description : {
            type : String,
            required : true
        },
        image : {
            type : String,
            required : true
        },
        category : {
            type : String,
            required : true
        },
        label : {
            type : String,
            default:  ''
        },
        price : {
            type : Currency,
            required : true,
            min : 0
        },
        featured : {
            type : Boolean,
            default : false
        },
        comments : [commentSchema]
    }, 
    // We can also have a mongoose automatically timestamps inserted into our model
    // By enabling this timestamps it will automaticall adds two timestamps created at
    //  and updated at for each document stored in our model.
    {
        timestamps : true
    }
)

let Dishes = mongoose.model('dish', dishSchema);
module.exports = Dishes;