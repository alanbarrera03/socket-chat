const path = require( 'path' );
const   fs = require(  'fs'  );

const cloudinary = require( 'cloudinary' ).v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const      { response } = require( "express" );
const    { uploadFile } = require( "../helpers/" );

const { User, Product } = require( '../models/');


const loadFile = async( req, res = response ) => {

    try {

        // const name = await uploadFile( req.files, [ 'txt', 'md' ] );
        const name = await uploadFile( req.files, undefined, 'imgs' );

        res.json({ name })
        
    } catch ( msg ) {

        res.status( 400 ).json({ msg });
        
    }

}

const updateImage = async( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':

            model = await User.findById( id );
            
            if( !model ) {

                return res.status( 400 ).json({

                    msg: `Not exist an user with this id ${ id }`

                });

            }

            break;

        case 'products':

            model = await Product.findById( id );
            
            if( !model ) {

                return res.status( 400 ).json({

                    msg: `Not exist an product with this id ${ id }`

                });

            }

            break;


    
        default:
            return res.status( 500 ).json({ msg: 'I forgot validate this'});
    }

    //Clean preview image
    if( model.img ) {

        //the server image must be deleted
        const pathImage = path.join( __dirname, '../upload', collection, model.img );
        if( fs.existsSync( pathImage ) ){

            fs.unlinkSync( pathImage );

        }

    }

    const name = await uploadFile( req.files, undefined, collection );
    model.img = name;

    await model.save();

    res.json( model );

}

const updateImageCloudinary = async( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':

            model = await User.findById( id );
            
            if( !model ) {

                return res.status( 400 ).json({

                    msg: `Not exist an user with this id ${ id }`

                });

            }

            break;

        case 'products':

            model = await Product.findById( id );
            
            if( !model ) {

                return res.status( 400 ).json({

                    msg: `Not exist an product with this id ${ id }`

                });

            }

            break;


    
        default:
            return res.status( 500 ).json({ msg: 'I forgot validate this'});
    }

    //Clean preview image
    if( model.img ) {

        const nameArr = model.img.split( '/' );

        const name = nameArr[ nameArr.length - 1 ];
        
        const [ public_id ] = name.split( '.' );

        cloudinary.uploader.destroy( public_id );
        //the server image must be deleted
        // const pathImage = path.join( __dirname, '../upload', collection, model.img );
        // if( fs.existsSync( pathImage ) ){

        //     fs.unlinkSync( pathImage );

        // }

    }

    const { tempFilePath } = req.files.file;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    model.img = secure_url;

    // const name = await uploadFile( req.files, undefined, collection );
    // model.img = secure_url;

    await model.save();

    res.json( model );

}

const showImage = async( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':

            model = await User.findById( id );
            
            if( !model ) {

                return res.status( 400 ).json({

                    msg: `Not exist an user with this id ${ id }`

                });

            }

            break;

        case 'products':

            model = await Product.findById( id );
            
            if( !model ) {

                return res.status( 400 ).json({

                    msg: `Not exist an product with this id ${ id }`

                });

            }

            break;


    
        default:
            return res.status( 500 ).json({ msg: 'I forgot validate this'});
    }

    //Clean preview image
    if( model.img ) {

        //the server image must be deleted
        const pathImage = path.join( __dirname, '../upload', collection, model.img );
        if( fs.existsSync( pathImage ) ){

            return res.sendFile( pathImage )

        }

    }

    const pathNoImage = path.join( __dirname, '../assets/no-image.jpg' );
         res.sendFile( pathNoImage );

}

module.exports = {

    loadFile,
    updateImage,
    showImage,
    updateImageCloudinary

}