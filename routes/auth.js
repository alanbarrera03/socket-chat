const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT } = require('../middlewares');

const { login, googleSignIn, renewToken } = require('../controllers/auth');

const router = Router();


router.post('/login', [
    check( 'email', 'email is required' ).isEmail(),
    check( 'password', 'password is required' ).not().isEmpty(),
    validateFields
], login );

router.post('/google', [
    check( 'id_token', 'Token of google is required' ).not().isEmpty(),
    validateFields
], googleSignIn );

router.get( '/', validateJWT, renewToken );

module.exports = router;