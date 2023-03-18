const { Router } = require( 'express' );
const { check }  = require( 'express-validator' );

const { validateFields, validateLoadFile } = require( '../middlewares' );
const { loadFile, updateImageCloudinary, showImage } = require( '../controllers/uploads' );
const { permittedCollections }             = require( '../helpers' );

const router = Router();

router.post( '/', validateLoadFile, loadFile );

router.put( '/:collection/:id', [
    validateLoadFile,
    check( 'id', 'Id must be from Mongo' ).isMongoId(),
    check( 'collection' ).custom( c => permittedCollections( c, [ 'users', 'products' ] ) ),
    validateFields
], updateImageCloudinary );

router.get( '/:collection/:id', [
    check( 'id', 'Id must be from Mongo' ).isMongoId(),
    check( 'collection' ).custom( c => permittedCollections( c, [ 'users', 'products' ] ) ),
    validateFields
], showImage )

module.exports = router;