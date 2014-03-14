// app.js

_$construct( '_$App', {} );
_$App.registry = {};
_$App.running = {};
_$App.launch = function( id ) {
  console.log( "Launch request: " + id );

  var appref = _$App.registry[ id ];
  if( ! appref ) {
    return console.log( "Application (" + id + ") is not registered"  );
  }

  if( ( ! appref.id ) || ( ! appref.script ) ) {
    return console.log( "Application (" + id + ") registry entry missing id or script reference" );
  }

  var args = Array.prototype.slice.call( arguments, 1 );

  var instance = _$App.running[ id ];
  if( instance ) {
    instance.message( { type: "launch", args: args } );
  } else {
    var script = document.createElement( 'script' );
    script.setAttribute( 'id', 'script_' + appref.id );
    script.setAttribute( 'type', 'text/javascript' );
    script.setAttribute( 'src', appref.script );
    var onload = "_$App.running['" + appref.id + "'] = new " + appref.id + "(); _$App.message( '" + appref.id +
      "', { type: 'launch', args: " + JSON.stringify( args ) + " } );";
    script.setAttribute( 'onload', onload );
    document.body.appendChild( script );
  }
};
_$App.deorbit = function( id ) {
};
_$App.message = function( id, msg ) {
  var instance = _$App.running[ id ];
  if( ! instance ) {
    return console.log( "Application (" + id + ") is not running"  );
  }
  instance.message( msg );
};
_$.ready( function () {
  _$Endpoint.get( '/app/registry.json', function( err, data ) {
    if( ! err ) {
      data && data._$each && data._$each( function( e ) {
        if( ! e.id ) { return };
        _$App.registry[ e.id ] = e;
      } );
    }
    disco_counter && disco_counter();
  } );
} );