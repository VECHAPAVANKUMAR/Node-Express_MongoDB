const { getAccessToken, getProducts, addProduct, updateProduct, deleteProduct } = require('../Integrations/shopifyIntegration');

const nonce = require('nonce')();
const crypto = require('crypto');
const querystring = require('querystring');

const apiKey = 'ab03836400ab41bbacbc3e00de222a46';
const apiSecret = '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'
const scopes = 'read_products, write_products';
const forwardingAddress = "https://rotten-husky-49.loca.lt"; // Replace this with your HTTPS Forwarding address

exports.buildInstallURL = (shop) => {
    const state = nonce();
    const redirectUri = forwardingAddress + '/shopify/callback';
    const installUrl = 'https://' + shop +
      '/admin/oauth/authorize?client_id=' + apiKey +
      '&scope=' + scopes +
      '&state=' + state +
      '&redirect_uri=' + redirectUri;
    return { installUrl : installUrl, state : state }
}

exports.validateCode = async (shop, hmac, code, query) => {
    return new Promise(async(resolve, reject) => {
        if (shop && hmac && code) {
            // DONE: Validate request is from Shopify
            const map = Object.assign({}, query);
            delete map['signature'];
            delete map['hmac'];
            const message = querystring.stringify(map);
            const providedHmac = Buffer.from(hmac, 'utf-8');
            const generatedHash = Buffer.from(
              crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
                'utf-8'
              );
    
            let hashEquals = false;
        
            try {
              hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
            } catch (e) {
              hashEquals = false;
            };
        
            if (!hashEquals) {
                return reject('HMAC validation failed')
            } else {
                const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
                const accessTokenPayload = {
                  client_id: apiKey,
                  client_secret: apiSecret,
                  code,
                };            
                try {
                    const shopResponse = await getAccessToken(shop, accessTokenRequestUrl, accessTokenPayload)
                    return resolve(shopResponse)
                } catch (error) {
                    return reject(error)
                }
            }
        }
    })
}

exports.getProducts = async (shop) => {
    return new Promise(async (resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/products.json'
        try {
            const products = await getProducts(url, shop)
            return resolve(products)       
        } catch (error) {
            return reject(error)
        }
    })
}

exports.addProduct = async (shop, product) => {
    return new Promise(async(resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/products.json/'
        try {
            const addedProduct = await addProduct(url, shop, product)
            return resolve(addedProduct)
        } catch (error) {
            return reject(error)
        }
    })
    .catch((err) => {
        console.log('error while adding the product', err.message, err)
    })
}

exports.updateProduct = async (shop, product, productId) => {
    return new Promise(async(resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/products/' + productId + '.json'
        try {
            const updatedProduct = await updateProduct(url, shop, product, productId)
            return resolve(updatedProduct)
        } catch (error) {
            // console.log('error while updating product 2', error)
            return reject(error)
        }
    })
}

exports.deleteProduct = async (shop, productId) => {
    return new Promise(async(resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/products/' + productId + '.json'
        try {
            const deletedProduct = await deleteProduct(url, shop, productId)
            return resolve(deletedProduct)
        } catch (error) {
            return reject(error)
        }
    })
}