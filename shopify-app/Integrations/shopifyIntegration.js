const axios = require('axios')
const request = require('request-promise');
const Shopify = require('../models/shopify')

exports.getAccessToken = async (shop, accessTokenRequestUrl, accessTokenPayload) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accessTokenResponse = await request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            const accessToken = accessTokenResponse.access_token;
            const shopRequestUrl = 'https://' + shop + '/admin/api/2021-01/shop.json';
            const shopRequestHeaders = {
              'X-Shopify-Access-Token': accessToken,
            };
            console.log('A', accessToken)
            const obj = new Shopify({
                shopName : shop,
                accessToken : accessToken
            })
            try {
                const res = await obj.save();
                // console.log("Added the access token", res)
            } catch (error) {
                // console.log('Error while adding the access token', error)
                return reject(error)                
            }
            options = {
                method : 'GET',
                headers : shopRequestHeaders, 
                url : shopRequestUrl,
            }
            const shopResponse = await axios(options)
            return resolve(shopResponse.data)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.getProducts = async (url, shop) => {
    return new Promise(async (resolve, reject) => {
        let document;
        try {
            document = await Shopify.findOne({shopName : shop}) 
        } catch (error) {
            return reject("Invalid shop name")
        }
        // console.log("Get AccessToken", document['accessToken'], document)
        const options = {
            method : 'GET',
            headers : {
                'X-Shopify-Access-Token' : document['accessToken'],
                'content-type' : 'application/json',
            },
            url : url,
        }
        try {
            const products = await axios(options)
            // console.log('Products 1', products.data)
            return resolve(products.data)
        } catch (error) {
            return reject(error.message)            
        }
    })
}

exports.addProduct = async (url, shop, product) => {
    return new Promise (async (resolve, reject) => {
        let document;
        try {
            document = await Shopify.findOne({shopName : shop}) 
        } catch (error) {
            return reject("Invalid shop name")
        }
        try {
            const options = {
                method : "POST",
                headers : {
                    'X-Shopify-Access-Token' : document['accessToken'],
                    'content-type' : 'application/json',
                },
                url : url,
                data : { product : product }
            }
            const productResponse = await axios(options)
            // console.log('Added Product', productResponse.data)
            return resolve(productResponse.data)
        } catch (error) {
            return reject(error.message)
        }
    })
    .catch((err) => {
        console.log('error while adding the product', err.message, err)
    })
}

exports.updateProduct = async (url, shop, product) => {
    return new Promise(async (resolve, reject) => {
        let document;
        try {
            document = await Shopify.findOne({shopName : shop}) 
        } catch (error) {
            return reject("Invalid shop name")
        }
        const options = {
            method : 'PUT',
            headers : {
                'X-Shopify-Access-Token' : document['accessToken'],
                'content-type' : 'application/json',
            },
            url : url,
            data : { product : product }
        }
        try {
            const updatedProductResponse = await axios(options)
            // console.log('Updated Product 1', updatedProductResponse.data)
            return resolve(updatedProductResponse.data)
        } catch (error) {
            console.log('error while updating product 1', error)
            return reject(error.message)            
        }
    })
    .catch((error) => {
        console.log('Error while updating the product', error.message, error);
    })
}

exports.deleteProduct = async (url, shop) => {
    return new Promise(async (resolve, reject) => {
        let document;
        try {
            document = await Shopify.findOne({shopName : shop})
            // console.log('document', document)
        } catch (error) {
            return reject(error)
        }
        
        const options = {
            method : 'DELETE',
            headers : {
                'X-Shopify-Access-Token' : document['accessToken'],
                'content-type' : 'application/json',
            },
            url : url,
        }
        try {
            const deletedProductResponse = await axios(options)
            // console.log('Deleted Product', deletedProductResponse.data)
            return resolve(deletedProductResponse.data)
        } catch (error) {
            // console.log('Error while deleting product', error.message, error)
            return reject(error.message)
        }
    })
    .catch((error) => {
        console.log('Error deleting product', error.message, error)
    })
}