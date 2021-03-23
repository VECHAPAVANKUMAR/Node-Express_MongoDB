const axios = require('axios')
const request = require('request-promise');

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

exports.getProducts = async (url, accessToken) => {
    return new Promise(async (resolve, reject) => {
        const options = {
            method : 'GET',
            headers : {
                'X-Shopify-Access-Token' : accessToken,
                'content-type' : 'application/json',
            },
            url : url,
        }
        try {
            const products = await axios(options)
            console.log('Products 1', products.data)
            return resolve(products.data)
        } catch (error) {
            return reject(error)            
        }
    })
}

exports.addProduct = async (url, accessToken, product) => {
    return new Promise (async (resolve, reject) => {
        try {
            const options = {
                method : "POST",
                headers : {
                    'X-Shopify-Access-Token' : accessToken,
                    'content-type' : 'application/json',
                },
                url : url,
                data : { product : product }
            }
            const productResponse = await axios(options)
            return resolve(productResponse.data)
        } catch (error) {
            return reject(error)
        }
    })
    .catch((err) => {
        console.log('arror while adding the product', err)
    })
}

exports.updateProduct = async (url, accessToken, product) => {
    return new Promise(async (resolve, reject) => {
        const options = {
            method : 'PUT',
            headers : {
                'X-Shopify-Access-Token' : accessToken,
                'content-type' : 'application/json',
            },
            url : url,
            data : product
        }
        try {
            const updatedProductResponse = await axios(options)
            console.log('Updated Product 1', updatedProductResponse.data)
            return resolve(updatedProductResponse.data)
        } catch (error) {
            console.log('error while updating product 1', error)
            return reject(error)            
        }
    })
}