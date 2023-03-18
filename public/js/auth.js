
const url = 'http://localhost:8080/api/auth/';
const myForm = document.querySelector( 'form' );

myForm.addEventListener( 'submit', ev => {

    ev.preventDefault();

    const formData = {};

    for( let el of myForm.elements ) {

        if ( el.name.length > 0 )

        formData[ el.name ] = el.value

    }

    fetch( url + 'login', {

        method: 'POST',
        body: JSON.stringify( formData ),
        headers: {
            'Content-type':'application/json'
        },

    })
    .then( resp => resp.json() )
    .then( ( { msg, token } ) => {

        if( msg ){

            return console.error( msg );
            
        }

        localStorage.setItem( 'token', token );

        window.location = 'chat.html';

    } )
    .catch( err => {

        console.log( err );

    } )

} )


function handleCredentialResponse(response) {
           
            // console.log( 'id_token', response.credential)
            const body = { id_token: response.credential };

            fetch( url + 'google', {
                method: 'POST',
                headers: {
                    'Content-type':'application/json'
                },
                body: JSON.stringify( body )
            } )
                .then( resp => resp.json() )
                .then( ({ token }) => {
                    localStorage.setItem( 'token', token );
                    window.location = 'chat.html';
                })
                .catch( console.warn );

        }

        const button = document.getElementById('google_signout');

        button.onclick = () => {

            google.accounts.id.disableAutoSelect()
            google.accounts.id.revoke( localStorage.getItem( 'email' ), done => {

                localStorage.clear();
                location.reload();
    
            });

        }