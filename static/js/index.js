_$.ready( function () {
//  console.log( "index.js loaded. someday it will do something useful." );
  if( ! localStorage.hasOwnProperty( '_$Discovery_intro' ) ) {
    _display_intro();
  }
} );

function _display_intro() {
  var a = setInterval( function () {
    if( _$App.registry[ '_$HTMLReader' ] ) {
      localStorage.setItem( '_$Discovery_intro', 'seen it' );
      _$App.launch( '_$HTMLReader', { url: 'contents/intro.html', height: _$.byId( 'root' ).offsetHeight - 41, width: 600, x: 12, y: 12, title: '¡hola!' } );
    }
    clearInterval( a );
  }, 1000 );

}
