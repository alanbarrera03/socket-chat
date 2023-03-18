const url = 'http://localhost:8080/api/auth/';

let user   = null;
let socket = null;

const txtUid     = document.querySelector( '#txtUid' );
const txtMessage = document.querySelector( '#txtMessage' );
const ulUsuarios = document.querySelector( '#ulUsuarios' );
const ulMessage  = document.querySelector( '#ulMessage' );
const btnExit    = document.querySelector( '#btnExit' );

// validate token of localstorage
const validateJWT = async() => {

    const token = localStorage.getItem( 'token' ) || '';

    if( token.length <= 10 ) {

        window.location = 'index.html';

        throw new Error( 'No hay token en el server' );

    }

    const resp = await fetch( url, {

        headers: { 'x-token': token }

    });

    const { user: userDB, token: tokenDB } = await resp.json();

    // console.log( userDB, tokenDB );

    localStorage.setItem( 'token', tokenDB );

    user = userDB;

    document.title = user.name;

    await connectSocket();

}

const connectSocket = async() => {

    socket = io({

        'extraHeaders': {
            'x-token': localStorage.getItem( 'token' )
        }

    });

    socket.on( 'connect', () => {

        console.log( 'Socket online' )

    } );

    socket.on( 'disconnect', () => {

        console.log( 'Socket offline' )

    } );

    socket.on( 'receive-message', drawMessages );

    socket.on( 'users-active', drawUsers );

    socket.on( 'message-private', () => {

    } );

}

const drawUsers = ( users = [] ) => {

    let usersHtml = '';

    users.forEach( ( { name, uid } ) => {

        usersHtml += `
        
            <li>
            
                <p>
                
                    <h5 class="text-success"> ${ name }: </h5>
                    <span class="fs-6 text-muted"> ${ uid } </span>

                </p>
            
            </li>
        
        `;

    } );

    ulUsuarios.innerHTML = usersHtml;

}

const drawMessages = ( messages = [] ) => {

    let messagesHtml = '';

    messages.forEach( ( { name, message } ) => {

        messagesHtml += `
        
            <li>
            
                <p>
                
                    <span class="text-primary"> ${ name }: </span>
                    <span> ${ message } </span>

                </p>
            
            </li>
        
        `;

    } );

    ulMessage.innerHTML = messagesHtml;

}

txtMessage.addEventListener( 'keyup', ( { keyCode } ) => {

    const message = txtMessage.value;
    const uid     = txtUid.value;

    if( keyCode !== 13 ) { return; }

    if( message.length === 0 ) { return; }

    socket.emit( 'send-message', { message, uid } );

} )

const main = async() => {

    //Validete JWT
    await validateJWT();

}

main();