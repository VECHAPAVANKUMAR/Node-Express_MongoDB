const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    "id": {
        type : String,
    },
    "title": {
        type : String,
    },
    "body_html": {
        type : String,
    },
    "vendor": {
        type : String,
    },
    "product_type": {
        type : String,
    },
    "created_at": {
        type : String,
    },
    "handle": {
        type : String,
    },
    "updated_at": {
        type : String,
    },
    "published_at": {
        type : Object,
    },
    "template_suffix": {
        type : String,
    },
    "status": {
        type : String,
    },
    "published_scope": {
        type : String,
    },
    "tags": {
        type : String,
    },
    "admin_graphql_api_id": {
        type : String,
    },
    "variants": {
        type : Array,
    },
    "options":   {
        type : Array,
    },              
})

const productSchema = new Schema(
    {
        product : product,
        _id : {
            type : String
        }
    },
    {
        timestamps : true,
        _id : false,
    }
)

let Products = mongoose.model('Product', productSchema);
module.exports = Products;