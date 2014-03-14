// disco-core.js

( function ( source ) {
  source._$each && source._$each( function( e, i ) {
    if ( 'function' == typeof e ) { this[i] = e; }
  }.bind( this ) );
} )._$punch( Object.prototype, '_$mixin' );

_$construct( '_$', {} );
_$.ready = function ( _f ) { document.addEventListener( 'DOMContentLoaded', _f); };
_$.byId = function ( id, element ) { element || ( element = document ); return element.getElementById( id ); };
_$.qsa = function ( id, element ) { element || ( element = document ); return element.querySelectorAll( id ); };

var disco_counter = Number(5)._$counter( function() {
  _$App.launch( '_$Desktop' );
} );