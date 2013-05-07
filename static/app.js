( function () {
  function _$App( options ) {
    _$.populate.call( this, options );
    this.script = {};
    this.template = {};
    this.style = {};
  }

  _$App.prototype.load = function ( complete ) {
    if( this.url ) {
      var that = this;
      _$Endpoint.get( this.url, function( err, data ) {
        if( err ) { return ( complete && complete( err ) ); }
        var apps = data.getElementsByTagName( 'app' );
        if( ( ! apps ) || ( 0 == apps.length ) ) {
          return ( complete && complete( new _$Error( "Couldn't find app tag in response" ) ) );
        }
        that.id = apps[0].attributes.getNamedItem('id').value;
        var sibling = apps[0].firstElementChild;
        var target;
        do {
          // todo: this code makes security bear grumpy. please fix.
          target = that[ sibling.tagName ];
          target[ sibling.attributes.getNamedItem( 'id' ).value ] = {
            'type': sibling.attributes.getNamedItem( 'type' ).value,
            'content': sibling.textContent
          };
          sibling = sibling.nextElementSibling;
        } while( sibling );

        return complete && complete( null, that );
      } );
    }
  }

  window._$App = _$App;
} ) ();