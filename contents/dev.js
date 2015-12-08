console.log( 'loaded dev' );
var items = _$.byId( 'container' ).querySelectorAll( 'dt' );
Array.prototype.slice.call( items )._$each( function( e, i ) {
  var attr = e.getAttribute( 'data-source' );
  attr && ( e.onclick = function () { _loadText( attr ); } );
} );
_loadText( '__0' );
function _loadText( source ) {
  _$.byId( 'container_content' ).innerHTML = _$.byId( source ).innerHTML;
}