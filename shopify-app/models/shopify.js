const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopifySchema = new Schema(
    {
        shopName : {
            type : String,
            required : true
        },
        accessToken : {
            type : String,
            required : true
        },
    },
    {
        timestamps : true
    }
)

let ShopifyUser = mongoose.model('shop', shopifySchema);
module.exports = ShopifyUser;