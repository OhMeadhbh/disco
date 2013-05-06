// disco-http.js
// See https://github.com/OhMeadhbh/disco/blob/master/LICENSE for license

var props   = require( 'node-props' );
var connect = require( 'connect' );
var fs      = require( 'fs' );

var g;
var apps = {};
var _aopts = {
  flags: "a+",
  encoding: "UTF-8",
  mode: 0666
};

read_props();

function read_props( ) {
  props.read( function( properties ) {
    g = properties;

    load_apps();
  } );
}


function load_apps( ) {
  if( ! g.start ) {
    g.start = [];
    for( var i in g.apps ) { g.start.push( i ); }
  }

  for( var i = 0, il = g.start.length; i < il; i ++ ) {
    var element = g.start[ i ];
    var current = g.apps[ element ];
    var app = connect();

    if( current.favicon ) {
      app.use( connect.favicon( current.favicon.path ) );
    }

    app.use( connect.cookieParser() );

    if( current.access ) {
      if( current.access.path ) {
        current.access.stream = fs.createWriteStream( current.access.path, _aopts );
      }
      app.use( connect.logger( current.access ) );
    }

    if( current.source ) {
      require( current.source )( app, element, g );
    }

    if( current.static && current.static.path ) {
      app.use( connect.static( current.static.path, current.static ) );
    }

    if( current.errorHandler ) {
      app.use( connect.errorHandler( current.errorHandler ) );
    }

    if( current.listen && current.listen.port ) {
      app.listen( current.listen.port, current.listen.host );
    }

    apps[ element ] = app;
    
  }
}

