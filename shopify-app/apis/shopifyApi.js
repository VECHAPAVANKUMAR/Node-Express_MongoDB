const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const { buildInstallURL, validateCode, getProducts, addProduct, updateProduct } = require('../services/shopifyService');

const shopifyRouter = express.Router();
shopifyRouter.use(bodyParser.json());

shopifyRouter.route('/')

.get((req, res, next) => {
	const shop = req.query.shop;
	if (shop) {
		const { installUrl, state } = buildInstallURL(shop)
		res.cookie('state', state)
		res.redirect(installUrl)
	} else {
		return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
	}
})

shopifyRouter.route('/callback')

.get( async (req, res, next) => {
	const { shop, hmac, code, state } = req.query;
	const stateCookie = cookie.parse(req.headers.cookie).state;
	if (state !== stateCookie) {
		return res.status(403).send('Request origin cannot be verified');
	}
	try {
		const response = await validateCode(shop, hmac, code, req.query)
		res.status(200)
		res.send(response)
	} catch (error) {
		res.status(400)
		res.send(error)
	}
})

shopifyRouter.route('/products')

.get( async (req, res, next) => {
	const { shop, accessToken } = req.query
	if (shop && accessToken) {
		try {
			const products = await getProducts(shop, accessToken);
			res.status(200)
			res.send(products)
		} catch (error) {
			res.status(400)
			res.send(error)
		}
	} else {
		res.status(400)
		res.send('Missing shop query dstring parameter')
	}
})

.post(async (req, res, next) => {
	const { shop, accessToken, product } = req.body
	if (shop && accessToken && product) {
		try {
			const addedProduct = await addProduct(shop, accessToken, product)
			res.status(200)
			res.send(addedProduct)
		} catch (error) {
			res.status(400)
			res.send(error)			
		}
	} else {
		res.status(200)
		res.send('Missing shop or accesstoken or product')
	}
})

shopifyRouter.route('/products/:productId')
.put(async (req, res, next) => {
	const { shop, accessToken, product } = req.body
	const productId = req.params.productId
	console.log("ID", productId, req.params)
	if (shop && accessToken && product && productId) {
		try {
			const updatedProduct = await updateProduct(productId, shop, accessToken, product)
			res.status(200)
			res.send(updatedProduct)
		} catch (error) {
			console.log('error while updating product 3', error)
			res.status(400)
			res.send(error)			
		}
	} else {
		res.status(400)
		res.send('Missing shop or accesstoken or product or product id')
	}
})
module.exports = shopifyRouter;

// {
//     "product": {
//         "id": 6588745777325,
//         "title": "This is product 10",
//         "body_html": "<strong>Good snowboard!</strong>",
//         "vendor": "Burton",
//         "product_type": "Snowboard",
//         "created_at": "2021-03-24T00:39:44+05:30",
//         "handle": "this-is-product-10",
//         "updated_at": "2021-03-24T00:39:44+05:30",
//         "published_at": "2021-03-24T00:39:44+05:30",
//         "template_suffix": null,
//         "status": "active",
//         "published_scope": "web",
//         "tags": "",
//         "admin_graphql_api_id": "gid://shopify/Product/6588745777325",
//         "variants": [
//             {
//                 "id": 39467182096557,
//                 "product_id": 6588745777325,
//                 "title": "Default Title",
//                 "price": "0.00",
//                 "sku": "",
//                 "position": 1,
//                 "inventory_policy": "deny",
//                 "compare_at_price": null,
//                 "fulfillment_service": "manual",
//                 "inventory_management": null,
//                 "option1": "Default Title",
//                 "option2": null,
//                 "option3": null,
//                 "created_at": "2021-03-24T00:39:44+05:30",
//                 "updated_at": "2021-03-24T00:39:44+05:30",
//                 "taxable": true,
//                 "barcode": null,
//                 "grams": 0,
//                 "image_id": null,
//                 "weight": 0,
//                 "weight_unit": "kg",
//                 "inventory_item_id": 41561371541677,
//                 "inventory_quantity": 0,
//                 "old_inventory_quantity": 0,
//                 "requires_shipping": true,
//                 "admin_graphql_api_id": "gid://shopify/ProductVariant/39467182096557"
//             }
//         ],
//         "options": [
//             {
//                 "id": 8471694704813,
//                 "product_id": 6588745777325,
//                 "name": "Title",
//                 "position": 1,
//                 "values": [
//                     "Default Title"
//                 ]
//             }
//         ],
//         "images": [],
//         "image": null
//     }
// }