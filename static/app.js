( function () {
  function _$App( options ) {
    options && _$.populate.call( this, options );
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
  };

  _$App.prototype.schedule = function ( ) {
    this.window = new _$Window( {
      name: this.windowName,
      view: this,
      windowClass: this.windowClass?this.windowClass:'window',
      size: this.size?this.size:undefined,
      onclose: this.onclose?this.onclose:undefined
    } );
    this.window.schedule();

    var style = document.createElement( 'style' );
    style.setAttribute( 'type', this.style[ this.id ].type );
    style.textContent = this.style[ this.id ].content.replace( /{id}/gm, this.window.id );
    this.window.inner.appendChild( style );

    var script = document.createElement( 'script' );
    script.setAttribute( 'type', this.script[ this.id ].type );
    script.textContent = this.script[ this.id ].content;
    this.window.inner.appendChild( script );

    var _f = window[ this.id.replace( /\./gm, '_' ) ];
    if( _f ) {
      ( new _f( this.window.id ) ).init();
    }
  };

  _$App.prototype.render = function () {
    return this.template[ this.id ].content;
  };

  _$App.prototype.do = function () {
    this.load( function( err, data ) {
      if( err ) { return; }
      data.schedule();
    } );
  }

  window._$App = _$App;
} ) ();