# Back-end application for Online shop

## AuthController

### Description:
The AuthController class provides endpoints for user authentication and registration.

### Endpoints

## Endpoint			Method		Description	Response
	/demo			GET		Returns a simple message "working".	200 OK
	/register		POST		Registers a new user.	200 OK on success, 409 Conflict if user already exists
	/authenticate		POST			Authenticates a user and returns an authentication token.	200 OK on success, 401 Unauthorized if authentication fails

## ProductControllers

### Description:
The ProductControllers class provides endpoints for managing products.

### Endpoints

## Endpoint					Method		DescriptionResponse
	/products				GET		Retrieves a list of all products.	200 OK on success, 404 Not Found if no products exist
	/products/{productId}			GET		Retrieves a specific product by its ID.	200 OK on success, 404 Not Found if product not found
	/products				POST		Creates a new product.	201 Created on success, 400 Bad Request if invalid data is provided
	/products/{productId}			PUT		Updates a specific product by its ID.	200 OK on success, 404 Not Found if product not found, 400 Bad Request if invalid data is provided
	/products/{productId}			DELETE		Deletes a specific product by its ID.	204 No Content on success, 404 Not Found if product not found
 ## Request					Parameters
	product (POST): 			The product data, represented as a ProductEntity object.
	productId (GET, PUT, DELETE): 		The ID of the product to retrieve, update, or delete.
	imageFile (POST): 			The image file to associate with the product, represented as a MultipartFile object.
 ## Response Data
	product (GET, POST, PUT): 		The product data, represented as a ProductEntity object.
	authenticationToken (POST,
 			    PATCH): 		The authentication token, represented as a JSON object containing the token value and expiration time.
 ### Examples

## Registering a new user:
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "mypassword"
}
Response:

200 OK
## Authenticating a user:
POST /auth/authenticate
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "mypassword"
}
Response:

200 OK
JSON
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJleHAiOjE1ODk3OTk2NzYsImlkIjoyMjM0NTYifQ.sSyt-955347-5678-4567-8-90AB-CDEF"
}
Use code with caution.
## Retrieving a list of all products:
GET /products
Response:

200 OK
JSON
[
  {
    "id": 1,
    "title": "Product 1",
    "subtext": "This is a product description.",
    "price": "10.00",
    "available": true
  },
  {
    "id": 2,
    "title": "Product 2",
    "subtext": "This is another product description.",
    "price": "20.00",
    "available": false
  }
]
Use code with caution. 
## Retrieving a specific product by ID:
GET /products/1
Response:

200 OK
JSON
{
  "id": 1,
  "title": "Product 1",
  "subtext": "This is a product
Use code with caution. 
