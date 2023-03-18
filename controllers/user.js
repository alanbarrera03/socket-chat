const { response, request } = require( 'express' );
const bcyptjs = require('bcrypt');

const User = require('../models/user');

const usersGet = async( req = request, res = response ) => {

    const { limit = 5, from = 0 } = req.query;
    const state = { status: true };

    // const users = await User.find( state )
    //     .skip( Number( from ) )
    //     .limit( Number( limit ) );

    // const total = await User.countDocuments( state );

    const [ total, usuarios ] = await Promise.all([
        User.countDocuments( state ),
        User.find( state )
            .skip( Number( from ) )
            .limit( Number( limit ) )
    ])
    
res.json({
    total,
    usuarios    
});

}

const usersPost = async ( req, res = response ) => { 

    const { name, email, password, role } = req.body;
    const user = new User( { name, email, password, role } );

    // Verify if the mail exists


    // Encrypt password
    const salt = bcyptjs.genSaltSync();
    user.password = bcyptjs.hashSync( password, salt );

    await user.save();

    res.json({

        msg: 'post API - Controller',
        user
        
    });
}
const usersPut = async( req, res = response ) => {

    const { id } = req.params.id;
    const { _id, email, password, google, ...resto } = req.body

    //TODO validate against DB
    if( password ) {
    // Encrypt password
    const salt = bcyptjs.genSaltSync();
    resto.password = bcyptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, restyo ); 

    res.json( user );
}
const usersPatch = (req, res = response) => {
    res.json({

        msg: 'patch API - Controller'
        
    });
}
const usersDelete = async (req, res = response) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, { status: false} );

    const userAuth = req.user;


    res.json( { user, userAuth } );
}

module.exports = {

    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete

}