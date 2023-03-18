const { Router } = require('express');
const { check }  = require('express-validator');

const { createProduct,
          getProducts,
           getProduct,
        updateProduct, 
        deleteProduct }     = require( '../controllers/products' );

const { existCategoryById,
         existProductById } = require('../helpers/db-validators');

const {    validateJWT,
        validateFields,
           isAdminRole }    = require('../middlewares');



const router = Router();

    router.get( '/', getProducts );

    router.get( '/:id', [
        check( 'id', 'No es un Id de Mongo válido' ).isMongoId(),
        check( 'id' ).custom( existProductById ),
        validateFields,
    ], getProduct );

    // Create categories - private - any person with a validate token 
    router.post( '/', [
        validateJWT,
        check( 'name', 'Name is required' ).not().isEmpty(),
        check( 'category', 'No es un Id de Mongo válido' ).isMongoId(),
        check( 'category' ).custom( existCategoryById ),
        validateFields
    ], createProduct );

    router.put( '/:id', [
        validateJWT,
        // check( 'category', 'No es un Id de Mongo válido' ).isMongoId(),
        check( 'id' ).custom( existProductById ),
        validateFields
    ], updateProduct );

    router.delete( '/:id', [
        validateJWT,
        isAdminRole,
        check( 'id', 'No es un Id de Mongo válido' ).isMongoId(),
        check( 'id' ).custom( existProductById ),
        validateFields
    ], deleteProduct );




module.exports = router;