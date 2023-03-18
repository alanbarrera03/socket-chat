const Role = require('../models/role');
const { User, Category, Product} = require('../models');
const { collection } = require('../models/role');

const isRoleValided = async( role = '' ) => {

    const existRole = await Role.findOne({ role });
    if( !existRole ){
        throw new Error( `The role ${ role } not is registered in the DB` )
    }

};

const isEmailValid = async ( email = '') => {

    const existEmail = await User.findOne({ email });
    if( existEmail ) {
        throw new Error( `The email: ${ email }, is registered in DB` )
        }
    }

const existUserById = async ( id ) => {

    const existUser = await User.findById( id );
    if( !existUser ) {
        throw new Error( `The ID not exist: ${ id }` )
        }
    }

const  existCategoryById = async( id ) => {

    const existCategory = await Category.findById( id );
    if( !existCategory ){

        throw new Error( `El ID no existe ${ id }` );

    }

}

const  existProductById = async( id ) => {

    const existProduct = await Product.findById( id );
    if( !existProduct ){

        throw new Error( `El ID no existe ${ id }` );

    }

}

const permittedCollections = ( collection = '', collections = [] ) => {

    const include = collections.includes( collection );

    if( !include ) {

        throw new Error( `The collection ${ collection } not is permitted, ${ collections }` );

    }

    return true;

}

module.exports = {
    isRoleValided,
    isEmailValid,
    existUserById,
    existCategoryById,
    existProductById,
    permittedCollections
}