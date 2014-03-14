( function () {

  _$construct( '_$IMGViewer', { launched: false } );
  _$IMGViewer.windows = {};
  _$IMGViewer.prototype.message = function( msg ) {
    if( ( ! msg ) || ( ! msg.type ) ) {
      return console.log( "_$IMGViewer app received invalid message" );
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
  _$IMGViewer.prototype.launch = function ( args ) {
    this.open( args );
  };
  _$IMGViewer.prototype.open = function ( args ) {
    args && args._$each && args._$each( function( e, i ) {
      this.openURL( e );
    }.bind( this ) );
  };
  _$IMGViewer.prototype.openURL = function( url ) {
    if( _$IMGViewer.windows[ url ] ) {
      _$IMGViewer.windows[ url ].select();
    } else {
      var data = '<img src="' + url + '">';
      var current = new _$Window( { overflow: 'hidden', resize: 'none', title: "About Discovery", content: data,
                                    app: '_$IMGViewer', height: 182, width: 384, visual: 'accessory' } );
      current._deschedule = function () {
        delete _$IMGViewer.windows[ url ];
      };
      _$IMGViewer.windows[ url ] = current;
      current.schedule();
      current.select();
    }
    return this;
  };

} ) ();