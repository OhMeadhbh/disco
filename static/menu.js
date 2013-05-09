( function () {
  var app_windows = {};

  function _$Menu( options ) {
    _$.populate.call( this, options );
  }

  _$Menu.schedule = function () {
    var el = document.createElement( 'ul' );
    _$Menu.menus.left.renderTop( el );
    _$Menu.menus.app.renderTop( el );
    _$Menu.containers.left.appendChild( el );

    _$Menu.menus.left.renderMenus( _$Menu.containers.left );
    _$Menu.menus.app.renderMenus( _$Menu.containers.left );

    var el = document.createElement( 'ul' );
    _$Menu.menus.right.renderTop( el )
    _$Menu.containers.right.appendChild( el );

    _$Menu.menus.right.renderMenus( _$Menu.containers.right );
  };

  _$Menu.selected = { menu: null, index: 0 };
  _$Menu.select = function ( menu, index ) {
    if( _$Menu.menus[ menu ] ) {
      _$Menu.topSelect( menu, index );
    } else if ( _$Menu.selected.menu ) {
      var foo = _$Menu.menus[ _$Menu.selected.menu ];
      foo.dispatch( menu.split(':'), function () {
        _$Menu.selected.menu = null;
        foo.deselect( _$Menu.selected.index )
      } );
    }
  }

  _$Menu.topSelect = function ( menu, index ) {
    if( menu == _$Menu.selected.menu ) {
      if( index != _$Menu.selected.index ) {
        _$Menu.menus[ _$Menu.selected.menu ].deselect( _$Menu.selected.index );
      }
    } else if( _$Menu.selected.menu != null ) {
        _$Menu.menus[ _$Menu.selected.menu ].deselect( _$Menu.selected.index );
    }

    if( ( _$Menu.selected.menu == menu ) && 
        ( _$Menu.selected.index == index ) ) {
      _$Menu.menus[ menu ].deselect( index );
      _$Menu.selected.menu = null;
    } else {
      _$Menu.menus[ menu ].select( index );
      _$Menu.selected.menu = menu;
      _$Menu.selected.index = index;
    }

  };

  _$Menu.prototype.renderTop = function ( renderUnto ) {
    for( var i = 0, il = this.descriptor.length; i < il; i++ ) {
      var el = document.createElement( 'li' );
      var current = this.descriptor[i];
      el.id = current.id;
      el.setAttribute( 'name', this.name );
      el.setAttribute( 'index', i );
      el.classList.add( 'menu-unselected' );

      if( current.img ) {
        var img = document.createElement( 'img' );
        img.classList.add( 'menu-logo' );
        img.setAttribute( 'src', current.img );
        el.appendChild( img );
        el.appendChild( document.createTextNode( '\u00A0' ) );
      } else if( current.text ){
        el.appendChild( document.createTextNode( current.text ) );
      }

      current.el = el;
      renderUnto.appendChild( el );
    }
  };

  _$Menu.prototype.renderMenus = function ( renderUnto ) {
    for( var i = 0, il = this.descriptor.length; i < il; i++ ) {
      var current = this.descriptor[ i ];
      if( ! current.contents ) { break; }
      var el = document.createElement( 'div' );
      el.classList.add( 'menumenu' );
      el.classList.add( 'hidden' );
      el.id = current.id + "_menu";

      var el2 = document.createElement( 'ul' );
      el.appendChild( el2 );

      if( current.contents ) {
        for( var j = 0, jl = current.contents.length; j < jl; j++ ) {
          var current2 = current.contents[j];
          var el3 = document.createElement( 'li' );
          if( 'separator' == current2.type ) {
            el3.appendChild( document.createElement( 'hr' ) );
          } else {
            el3.textContent = current.contents[ j ].text;
            el3.setAttribute( 'name', current.id + ':' + current2.id );
            el3.setAttribute( 'index', j );
          }
          el2.appendChild( el3 );
        }
      }
       
      renderUnto.appendChild( el );
      current.elmenu = el;
    }
  };

  _$Menu.prototype.select = function( index ) {
    var that = this;

    this.descriptor[index].el.classList.remove( 'menu-unselected' );
    this.descriptor[index].el.classList.add( 'menu-selected' );

    if( this.descriptor[ index ].elmenu ) {
      this.descriptor[index].elmenu.style.left = ( this.descriptor[index].el.offsetLeft ) + "px";
      this.descriptor[index].elmenu.classList.remove( 'hidden' );
    } else {
      this.dispatch( [ this.descriptor[ index ].id ], function () {
        that.deselect( index );
      } );      
    }
  };

  _$Menu.prototype.deselect = function( index ) {
    this.descriptor[index].el.classList.remove( 'menu-selected' );
    this.descriptor[index].el.classList.add( 'menu-unselected' );
    if( this.descriptor[ index ].elmenu ) {
      this.descriptor[index].elmenu.classList.add( 'hidden' );
    }
  };

  _$Menu.prototype.dispatch = function( idlist, callback ) {
    var selector = idlist.join(':');
    if( this.actions && this.actions[ selector ] ) {
      this.actions[ selector ]( callback );
    } else {
      setTimeout( callback, 250 );
    }
  };

  var left_menu = [
    {
      id: "control",
      img: "img/logo.png",
      contents: [
        {
          id: "about",
          text: "About Discovery..."
        },
        {
          type: "separator"
        },
        {
          id: "clock",
          text: "Clock"
        },
        {
          id: "calc",
          text: "Calculator"
        },
        {
          id: "notes",
          text: "Note Pad"
        },
        {
          id: "puzzle",
          text: "Puzzle"
        }
      ]
    }
  ];

  var left_actions = {
    'control:about': function ( callback ) {
      if( ! app_windows.about ) {
        var view = new _$HtmlView( { url: 'contents/about.html' } );
        return view.init( function () {
          app_windows.about = new _$Window( {
            name: "About Disco",
            windowClass: 'accessory',
            size: [384, 182],
            onclose: function () { delete app_windows.about; },
            view: view
          } );
          app_windows.about.schedule();
          return callback();
        } );
      }
      callback();
    },
    'control:clock': function( callback ) {
      if( ! app_windows.clock ) {
        app_windows.clock = new _$App( {
          url: '/contents/app_clock.xml',
          windowName: 'clock',
          windowClass: 'accessory',
          size:[150,52],
          onclose: function () { delete app_windows.clock; }
        } );
        app_windows.clock.do();
      }
      callback();
    }
    
  };

  var disco_menu = [
    {
      id: "file",
      text: "File",
      contents: [
        {
          id: "open",
          text: "Open",
          disabled: true
        },
        {
          id: "duplicate",
          text: "Duplicate",
          key: "d",
          disabled: true
        },
        {
          id: "info",
          text: "Get Info",
          key: "i",
          disabled: true
        },
        {
          type: "separator"
        },
        {
          id: "close",
          text: "Close",
          disabled: true
        },
        {
          id: "closeall",
          text: "Close All",
          disabled: true
        },
        {
          id: "print",
          text: "Print",
          disabled: true
        }
      ]
    },
    {
      id: "edit",
      text: "Edit",
      contents: [
        {
          id: "undo",
          text: "Undo",
          disabled: true
        },
        {
          type: "separator"
        },
        {
          id: "cut",
          text: "Cut"
        },
        {
          id: "copy",
          text: "Copy"
        },
        {
          id: "past",
          text: "Paste"
        },
        {
          id: "clear",
          text: "Clear"
        },
        {
          id: "selectall",
          text: "Select All"
        },
        {
          type: "separator"
        },
        {
          id: "showclip",
          text: "Show Clipboard",
          disabled: true
        }
      ]
    },
    {
      id: "view",
      text: "View",
      contents: [
        {
          id: "icon",
          text: "by Icon",
          selected: true
        },
        {
          id: "name",
          text: "by Name",
        },
        {
          id: "date",
          text: "by Date",
        },
        {
          id: "size",
          text: "by Size",
        },
        {
          id: "kind",
          text: "by Kind",
        }
      ]
    },
    {
      id: "special",
      text: "Special",
      contents: [
        {
          id: "cleanup",
          text: "Clean Up"
        },
        {
          id: "emptytrash",
          text: "Empty Trash",
          disabled: true
        },
        {
          id: "startup",
          text: "Set Startup",
          disabled: true
        }
      ]
    }
  ];


  var right_menu = [
    {
      id: "help",
      img: "img/help.png"
    },
    {
      id: "fullscreen",
      img: "img/fullscreen.png"
    }
  ];

  var right_actions = {
    help: function( callback ) {
      if( ! app_windows.help ) {
        var view = new _$HtmlView( { url: 'contents/help.html' } );
        view.init( function () {
          app_windows.help = new _$Window( {
            name: "Help",
            resizeY: true,
            resizeX: true,
            size: [384, 176],
            onclose: function () { delete app_windows.help; },
            view: view
          } );
          app_windows.help.schedule();
          return callback();
        } );
      }
      callback();
    },
    fullscreen: function( callback ) {
      _$Window.fullscreen( callback );
    }
  };

  _$.ready( function () {
    _$Menu.containers = {
      menu: _$.byId( 'menu' ),
      left: _$.qsa('#menu #left')[0],
      right: _$.qsa('#menu #right')[0],
    };
    _$Menu.menus = {
      left: new _$Menu( {descriptor: left_menu, name: 'left', actions: left_actions } ),
      app: new _$Menu( {descriptor: disco_menu, name: 'app' } ),
      right: new _$Menu( {descriptor: right_menu, name: 'right', actions: right_actions } )
    };
    _$Menu.schedule();
    _$Menu.containers.menu.addEventListener( 'click', function( e ) {
      var el = e.target;
      while( 'li' != el.localName.toLowerCase() ) {
        el = el.parentElement;
      }
      var name = el.getAttribute('name');
      var index = el.getAttribute('index');
      if( name ) {
        _$Menu.select( name, index );
      }
    } );

  } );

  window._$Menu = _$Menu;

} ) ();
