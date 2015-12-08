( function () {

  _$construct( '_$DesktopWindow', {} );
  _$DesktopWindow.prototype = new _$Window( {} );
  delete _$Window.collection[ _$DesktopWindow.prototype.id ];
  _$DesktopWindow.prototype._schedule = function () {
    this.content = '<style type="text/css">.windowframe > .content > .desktopbanner { padding: 1px 4px 1px 12px; ' +
      'border-bottom: 3px double black; } .windowframe > .content > .desktopcontent { position: relative; }' +
      '.desktopbanner > #itemcount { font-family: Caption; font-size: 12px; padding-top: 2px; }</style>' +
      '<div class="desktopbanner"><div id="itemcount"></div></div><div class="desktopcontent"></div>';
    _$Window.prototype._schedule.call( this );
    var oldelc = this.elc;
    this.elc = this.elc.querySelector( '.desktopcontent' );
    [ 'height', 'width', 'offset', 'overflow', 'overflowX', 'overflowY' ]._$each( function( e ) {
      if( oldelc.style[ e ] ) {
        this.elc.style[ e ] = oldelc.style[ e ];
        oldelc.style[ e ] = "";
      }
    }.bind( this ) );
  };

  _$construct( '_$Desktop', { launched: false } );
  _$Desktop.windows = {};
  _$Desktop.prototype.message = function( msg ) {
    if( ( ! msg ) || ( ! msg.type ) ) {
      return console.log( "_$Desktop app received invalid message" );
    }
    switch( msg.type ) {
    case 'launch':
      console.log( "_$Desktop received launch message" );
      if( this.launched ) {
        return console.log( "_$Desktop is already launched" );
      }
      this.launched = true;
      this.el = _$.byId( 'root' );

      var menu_items = { items: [
        {
          text: "File",
          items: [
            {
              text: "New Folder",
              key: 'n',
              handler: function () { console.log( "you clicked the new folder thing." ); }
            },
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
              text: "Get Info",
              key: 'i'
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
        },
        {
          text: "View",
          items: [
            {
              text: "By Small Icon"
            },
            {
              text: "By Icon"
            },
            {
              text: "By Name"
            },
            {
              text: "By Size"
            },
            {
              text: "By Kind"
            },
            {
              text: "By Date"
            }
          ]
        },
        {
          text: "Special",
          items: [
            {
              text: "Clean Up Desktop"
            },
            {
              text: "Empty Trash"
            },
            {
              separator: true
            },            
            {
              text: "Unmount File"
            }
          ]
        }
      ] };

      this.menu = new _$MenuBar( menu_items );
      _$MenuBar.render( this.menu );
    }
  };

  _$Endpoint.get( '/desktop.json', function( err, data ) {
    if( err ) { return console.log( err ); }
    _$Endpoint.model = ( data ? data : {} );
    var posdata = localStorage.getItem( '_$Desktop_position' );
    _$Endpoint.model.position = JSON.parse( posdata ? posdata : "{}" );
    _$Endpoint.model._$each( function( e, i ) {
      if( ! e.icon ) { return; }
      e.icon.position = "absolute";
      var icon = new _$Icon( e.icon );
      _$Endpoint.model.position[ i ] && _$Endpoint.model.position[ i ].x && ( icon.x = _$Endpoint.model.position[ i ].x );
      _$Endpoint.model.position[ i ] && _$Endpoint.model.position[ i ].y && ( icon.y = _$Endpoint.model.position[ i ].y );
      icon._endDrag = function () {
        var posdata = _$Endpoint.model.position ? _$Endpoint.model.position : {};
        if( ! posdata[ i ] ) { posdata[ i ] = {}; }
        posdata[ i ].x = this.x;
        posdata[ i ].y = this.y;
        localStorage.setItem(  '_$Desktop_position', JSON.stringify( posdata ) );
      };
      icon.dblClick = function () {
        if( ! _$Desktop.windows[ i ] ) {
          _$Desktop.windows[ i ] = new _$DesktopWindow( { title: i, overflow: 'scroll', resize: 'both' } );
          _$Desktop.windows[ i ].schedule();          
          _$Desktop.windows[ i ].elb = _$Desktop.windows[ i ].el.querySelector( '.desktopbanner' );
          _$Desktop.windows[ i ].elb_ic = _$Desktop.windows[ i ].elb.querySelector( '#itemcount' );
          if( _$Desktop.windows[ i ].elb_ic ) {
            var ic = "No Items";
            if( e.contents && e.contents.length ) {
              if( 1 == e.contents.length ) {
                ic = "1 Item";
              } else {
                ic = e.contents.length + " Items";
              }
            }
            _$Desktop.windows[ i ].elb_ic.innerHTML = ic;
          }

          var tx = ( e.contents ? Math.ceil( Math.sqrt( e.contents.length ) ) : 1 );
          e.contents && e.contents._$each( function( f, j ) {
            var y = Math.floor( j / tx );
            var x = j % tx;
            var newicon = new _$Icon( { img: f.img, caption: f.name, x: 12 + ( x * 80 ), y: 12 + ( y * 96 ), resize: 'none' } );
            newicon.index = j;
            newicon.dblClick = function () { _$App.launch( '_$HTMLReader', f.path ); };
            newicon.schedule( { parent: _$Desktop.windows[ i ].elc } );
          } );
          _$Desktop.windows[ i ]._deschedule = function () {
            delete _$Desktop.windows[ i ];
          };
        }
        _$Desktop.windows[ i ].select();
      };
      icon.schedule();
    } );
  } );
} ) ();