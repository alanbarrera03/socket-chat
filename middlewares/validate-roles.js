const { response } = require("express");




const isAdminRole = ( req, res = response, next ) => {

    if( !req.user ) {

        return res.status(500).json({

            msg: 'Require validete the role without first validate the token'

        });

    }

    const { role, name } = req.user;

    if( role ==! 'ADMIN_ROLE' ) {

        return res.status(401).json({

            msg: `${ name } not is administrator - can not do this`

        });

    }

    next();

}

    const hasRole = ( ...roles ) => {

        return ( req, res = response, next ) => {

            if( !req.user ) {

                return res.status(500).json({
        
                    msg: 'Require validete the role without first validate the token'
        
                });
        
            }

            if ( !roles.includes( req.user.role ) ) {

                return res.status( 401 ).json({

                    msg: `Service require one this roles ${ roles }`

                })

            }

            next();

        }

    }

module.exports = {

    isAdminRole,
    hasRole

}