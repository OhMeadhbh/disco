( function () {
  function populate ( from, keys ) {
    if( keys ) {
      for( var i = 0, il = keys.length; i < il; i++ ) {
        this[ keys[ i ] ] = from[ keys[ i ] ];
        delete[ keys[i] ];
      }
    } else {
      for( var i in from ) { this[i] = from[i]; delete from[i]; }        
    }
  }

  function ready ( _f ) {
    document.addEventListener( 'DOMContentLoaded', _f);
  }

  function byId( id, element ) {
    element || ( element = document );
    return element.getElementById( id );
  }

  function qsa( id, element ) {
    element || ( element = document );
    return element.querySelectorAll( id );
  }

  function nil () { }

  window._$ = {
    populate: populate,
    ready: ready,
    byId: byId,
    qsa: qsa,
    nil: nil
  };
} ) ();
