const { request, response } = require( 'express' );
const jwt = require( 'jsonwebtoken' );

const User = require( '../models/user' );

const validateJWT = async( req = request, res = response, next ) => {

    const token = req.header( 'x-token' );

    if( !token ) {

        return res.status(401).json({

            msg: 'no token in request'

        })

    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        //read the user which corresponds to uid
        const user = await User.findById( uid );

        if( !user ) {

            return res.status(401).json({

                msg: 'Token invalid - user not exist in DB'

            })

        }

        //validate if the uid have a status in true
        if( !user.status ) {

            return res.status(401).json({

                msg: 'Token invalid - user status: false'

            })

        }

        req.user = user;

        next();
        
    } catch (error) {
        
        console.log(error);

        res.status(401).json({

            msg: 'Token invalid'

        })
        
    }

}


module.exports = {

    validateJWT

}