const { response } = require( 'express' );
const bcryptjs = require('bcrypt');

const User = require( '../models/user' );

const { generarJWT } = require('../helpers/generar-jwt');
const { goolgeVerify } = require('../helpers/google-verify');



const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        //Verificar si el email existe
        const user = await User.findOne({ email });
        if( !user ) {

            return res.status( 400 ).json({
                msg: 'User / Password not correct - email'
            });

        }

        //Si el usuario está activo
        if( !user.status ) {

            return res.status( 400 ).json({
                msg: 'User / Password not correct - status: false'
            });

        }

        // Verifivar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            
            return res.status( 400 ).json({
                msg: 'User / Password not correct - password'
            })
        }

        //Generar JWT
        const token = await generarJWT( user.id );

        res.json({
            user,
            token
        })    
        
    } catch (error) {

        console.log(error)

        return res.status( 500 ).json({
            msg: 'Talk to the administrator'
        })
        
    }

}

const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;

    try {

        const { name, img, email } = await goolgeVerify( id_token );

        let user = await User.findOne({ email });

        if ( !user ){

            const data = {

                name,
                email,
                password: ':PO',
                img,
                google: true

            };

            user = new User( data );
            await user.save();

        }

        // if user is in DB
        if( !user.status ){

            return res.status( 401 ).json({

                msg: 'Call the administrator, user blocked'

            });

        }

        //Generar JWT
        const token = await generarJWT( user.id );
        
        res.json({
            user,
            token
        })

    } catch (error) {

        json.status( 400 ).json({

            ok: false,
            msg: 'Token not verified'

        })

        
    }


}

const renewToken = async( req, res = response ) => {

    const { user } = req;
    
    //Generar JWT
    const token = await generarJWT( user.id );

    res.json({

        user,
        token

    })

}

module.exports = {

    login,
    googleSignIn,
    renewToken

}