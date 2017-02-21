//importing modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );

function callLeboncoin() {

    var url = 'https://www.leboncoin.fr/ventes_immobilieres/1084457186.htm?ca=12_s'


    request( url, function ( error, response, html ) {

        if ( !error && response.statusCode == 200 ) {

            var $ = cheerio.load( html )

            var lbcDataArray = $( 'section.properties span.value' )

            var lbcData = {

                price: parseInt( $( lbcDataArray.get( 0 ) ).text().replace( /\s/g, '' ), 10 ),

                city: $( lbcDataArray.get( 1 ) ).text().trim().toLowerCase().replace( /\_|\s/g, '-' ),

                type: $( lbcDataArray.get( 2 ) ).text().trim().toLowerCase(),

                surface: parseInt( $( lbcDataArray.get( 4 ) ).text().replace( /\s/g, '' ), 10 )



            }

            var pricem2 = lbcData.price / lbcData.surface;

            console.log( lbcData )
            console.log( "price m2 = " + pricem2 )



        }

        else {

            console.log( error )

        }

    })

}

function callMeilleursAgents() {

    var urlMa = 'https://www.meilleursagents.com/prix-immobilier/poissy-78300/'

    request( urlMa, function ( error, response, html ) {
        if ( !error && response.statusCode == 200 ) {

            const $ = cheerio.load( html )

            const maDataArray = $( 'div.prices-summary div.prices-summary__cell--median' );

            let maData = {
                prixappart: parseInt( $( maDataArray.get( 0 ) ).text().replace( /\s/g, '' ), 10 ),
                prixmaison: parseInt( $( maDataArray.get( 1 ) ).text().replace( /\s/g, '' ), 10 ),
                loyer: parseFloat( $( maDataArray.get( 2 ) ).text().replace( /\s/g, '' ), 10 )

            }
            console.log( maData )

        }

        else {
            console.log( error )
        }
    })
}

//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {

    callLeboncoin();
    callMeilleursAgents();

    res.render( 'home', {
        message: 'The Home Page!'
    });
});

app.get( '/call', function ( req, res ) {

    var url = req.query.urlLBC

    res.render( 'home', {
        message: url
    });
});

//launch the server on the 3000 port
app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});