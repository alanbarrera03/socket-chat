const { Router } = require('express');
const { check } = require('express-validator');

// const { isAdminRole, hasRole } = require('../middlewares/validate-roles');
// const { validateFields }       = require('../middlewares/validate-fields');
// const { validateJWT }          = require('../middlewares/validate-jwt');

const { isAdminRole,
        hasRole,
        validateFields,
        validateJWT
      } = require( '../middlewares')

const { isRoleValided, isEmailValid, existUserById } = require('../helpers/db-validators');

const { usersGet,
        usersPut,
        usersPost,
        usersDelete,
        usersPatch } = require('../controllers/user');

const router = Router();

router.get('/', usersGet );

router.post('/', [
    check( 'name', 'name is required' ).not().isEmpty(),
    // check( 'email', 'This email is invalid' ).isEmail(),
    check( 'password', 'password must be longer than 6 letters' ).isLength({ min: 6 }),
    // check( 'role', 'role is invalid' ).isIn(['ADMIN_ROLE','USER_ROLE']),
    check('email').custom( isEmailValid ),
    check('role').custom( isRoleValided ),
    validateFields
], usersPost);

router.put( '/:id', [
    check( 'id', 'Not valid ID' ).isMongoId(),
    check( 'id' ).custom( existUserById ),
    check( 'role' ).custom( isRoleValided ),
    validateFields
], usersPut );

router.delete('/:id', [
    // isAdminRole,
    validateJWT,
    hasRole( 'ADMIN_ROLE', 'SALES_ROLE' ),
    check( 'id', 'Not valid ID' ).isMongoId(),
    check( 'id' ).custom( existUserById ),
    validateFields
] ,usersDelete);

router.patch('/', usersPatch);

module.exports = router;