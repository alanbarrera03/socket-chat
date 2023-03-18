const { Router } = require('express');
const { check } = require('express-validator');

const { createCategory,
        getCategories,
        getCategory,
        updateCategory, 
        deleteCategory } = require('../controllers/categories');
const { existCategoryById } = require('../helpers/db-validators');

const { validateJWT,
        validateFields,
        isAdminRole } = require('../middlewares');



const router = Router();

    router.get( '/', getCategories );

    router.get( '/:id', [
        check( 'id', 'No es un Id de Mongo válido' ).isMongoId(),
        check( 'id' ).custom( existCategoryById ),
        validateFields,
    ], getCategory );

    // Create categories - private - any person with a validate token 
    router.post( '/', [
        validateJWT,
        check( 'name', 'Name is required' ).not().isEmpty(),
        validateFields
    ], createCategory );

    router.put( '/:id', [
        validateJWT,
        check( 'name', 'Name required' ).not().isEmpty(),
        check( 'id' ).custom( existCategoryById ),
        validateFields
    ] ,updateCategory );

    router.delete( '/:id', [
        validateJWT,
        isAdminRole,
        check( 'id', 'No es un Id de Mongo válido' ).isMongoId(),
        check( 'id' ).custom( existCategoryById ),
        validateFields
    ], deleteCategory );




module.exports = router;