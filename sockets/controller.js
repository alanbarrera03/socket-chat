const { Socket }      = require('socket.io');
const { verifyJWT }   = require('../helpers');
const { ChatMessage } = require('../models');

const chatMessages = new ChatMessage();


const socketController = async( socket = new Socket(), io ) => {

    // console.log( 'cliente conectado', socket.id );

    const user = await verifyJWT ( socket.handshake.headers[ 'x-token' ] );

    if( !user ) {

        return socket.disconnect();

    }

    //Add user connected
    chatMessages.connectUser( user );
    io.emit( 'users-active', chatMessages.usersArr );
    socket.emit( 'receive-message', chatMessages.last10 );

    // console.log ( 'Connected', user.name );

    // connect to a special room
    socket.join( user.id );

    //Clear when someone that disconnect
    socket.on( 'disconnect', () => {

        chatMessages.desconnectUser( user.id );
        io.emit( 'users-active', chatMessages.usersArr );

     } );

    socket.on( 'send-message', ( payload ) => {

        if( uid ) {

            //Message private
            socket.to( uid ).emit( 'message-private', { from: user.name, message } );

        } else {

            chatMessages.sendMessage( user.id, user.name, message );
            
            io.emit( 'receive-message', chatMessages.last10 );
    
            // console.log( payload )

        }

    
    } )
}


module.exports = {

    socketController

}