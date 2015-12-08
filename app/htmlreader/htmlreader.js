( function () {
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
        var current = new _$Window( { overflow: 'scroll', resize: 'both', title: "HTML Reader", content: data, app: '_$HTMLReader' } );
        current._deschedule = function () {
          delete _$HTMLReader.windows[ url ];
        };
        _$HTMLReader.windows[ url ] = current;
        current.schedule();
        current.select();
      }.bind( this ) );
    }
    return this;
  };

} ) ();