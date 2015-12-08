( function () {

  function _getScriptsFromData( data ) {
    var output = [ undefined, [] ];
    var doc = document.implementation.createHTMLDocument();
    var body = doc.getElementsByTagName('body')[0];
    body.innerHTML = data;
    var scripts = body.getElementsByTagName('script');
    scripts._$each( function( e ) {
      e && e.getAttribute && output[1].push( e.getAttribute( 'src' ) );
      e && body.removeChild( e );
    } );
    output[0] = body.innerHTML;
    return output;
  }

  var menu = [
    {
      text: "File",
      items: [
        {
          text: "Open",
          key: 'o'
        },
        {
          text: "Close Window",
          key: 'w'
        },
        {
          separator: true
        },
        {
          text: "Quit",
          key: 'q'
        }
      ]
    },
    {
      text: "Edit",
      items: [
        {
          text: "Cut",
          key: 'x'
        },
        {
          text: "Copy",
          key: 'c'
        },
        {
          text: "Paste",
          key: 'v'
        },
        {
          text: "Clear"
        },
        {
          text: "Select All",
          key: 'a'
        },
        {
          separator: true
        },            
        {
          text: "Show Clipboard"
        }
      ]
    }
  ];

  _$construct( '_$HTMLReader', { launched: false } );
  _$HTMLReader.windows = {};
  _$HTMLReader.prototype.message = function( msg ) {
    if( ( ! msg ) || ( ! msg.type ) ) {
      return console.log( "_$HTMLReader app received invalid message" );
    }
    switch( msg.type ) {
    case 'launch':
      if( this.launched ) {
        this.open( msg.args );
      } else {
        this.launch( msg.args );
      }
    }
  };
  _$HTMLReader.prototype.launch = function ( args ) {
    this.menu = new _$MenuBar( { items: menu } );
    _$MenuBar.render( this.menu );
    this.open( args );
  };
  _$HTMLReader.prototype.open = function ( args ) {
    args && args._$each && args._$each( function( e, i ) {
      this.openURL( e );
    }.bind( this ) );
  };
  _$HTMLReader.prototype.openURL = function( url ) {
    var options;
    if( 'object' == typeof url ) {
      options = url;
      url = options.url;
    }
    if( _$HTMLReader.windows[ url ] ) {
      _$HTMLReader.windows[ url ].select();
    } else {
      _$Endpoint.get( url, function( err, data ) {
        if( err ) {
          console.log( "Error: " + err.toString() );
          return;
        } 
        if( ! data ) {
          console.log( "Error: No Data Received" );
          return;
        }

        var items = _getScriptsFromData( data );

        var windowprops = { overflow: 'scroll', resize: 'both', title: "HTML Reader", content: items[0], app: '_$HTMLReader' };
        options && [ 'height', 'width', 'x', 'y', 'title' ]._$each( function ( e, i ) {
          if( 'undefined' != typeof options[ e ] ) { windowprops[ e ] = options[ e ]; }
        } );
        var current = new _$Window( windowprops );
        current._deschedule = function () {
          delete _$HTMLReader.windows[ url ];
        };
        _$HTMLReader.windows[ url ] = current;
        current.schedule();
        items && items[1] && items[1]._$each && items[1]._$each( function( e ) {
          var a = document.createElement( 'script' );
          a.setAttribute( 'type', 'text/javascript' );
          a.setAttribute( 'src', e );
          current.elc.appendChild( a );
        } );
        current.select();
      }.bind( this ) );
    }
    return this;
  };

} ) ();