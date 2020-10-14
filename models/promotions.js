const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// It will add the currency type to the mongoose data types. 
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const PromotionSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
            unique : true
        },
        image :  {
            type : String,
            required : true
        },
        label : {
            type : String,
            default : ''
        },
        price : {
            type : Currency,
            required : true,
            min : 0
        },
        description : {
            type : String,
            required : true
        },
        featured : {
            type : Boolean,
            default : false
        }
    }
)

var Promotions = mongoose.model('promotion', PromotionSchema)
module.exports = Promotions;