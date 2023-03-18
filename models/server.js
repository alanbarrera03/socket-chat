const express    = require('express');
const cors       = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection }     = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor(){

        this.app    = express();
        this.port   = process.env.PORT || 3000;
        this.server = require( 'http' ).createServer( this.app );
        this.io     = require( 'socket.io' )( this.server );

        this.paths = {

            auth:       '/api/auth',
            categories: '/api/categories',
            products:   '/api/products',
            search:     '/api/search',
            uploads:    '/api/uploads',
            user:       '/api/users',

        }

        this.userPath = '/api/users';
        this.authPath = '/api/auth';

        //connect to database
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();

        //sockets
        this.sockets();

    }

    async connectDB(){

        await dbConnection();

    }

    middlewares(){

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio público
        this.app.use( express.static( 'public' ) );

        this.app.use( fileUpload({
            useTempFiles:     true,
            tempFileDir :     '/temp',
            createParentPath: true
        }) )

    }

    routes(){

        this.app.use( this.paths.auth,       require( '../routes/auth' ) );
        this.app.use( this.paths.categories, require( '../routes/categories' ) );
        this.app.use( this.paths.products,   require( '../routes/products' ) );
        this.app.use( this.paths.search,     require( '../routes/search' ) );
        this.app.use( this.paths.uploads,    require( '../routes/uploads' ) );
        this.app.use( this.paths.user,       require( '../routes/user' ) );
    }

    sockets() {

        this.io.on( 'connection', ( socket ) => socketController( socket, this.io ) );

    }

    listen(){

        this.server.listen( this.port, () => {
            console.log( 'Servidor corriendo en el puerto', this.port );
        } );

    }

}

module.exports = Server;

