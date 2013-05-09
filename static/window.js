( function () {
  var default_values = {
    minSize: [ 150, 52 ],
    size: [ 320, 240 ],
    windowClass: 'window',
    resizeX: false,
    resizeY: false
  };

  function _$Window( options ) {
    options && _$.populate.call( this, options );

    if( ! this.position ) {
      var i =  24 * ( ( _$Window.windowId ) % 5 + 1);
      this.position = [ i, i ];
    }

    for( var i in default_values ) {
      this[ i ] || ( this[ i ] = default_values[ i ] );
    }

    if( ! this.background ) {
      if ( 'window' == this.windowClass ) {
        this.background = 'white';
      } else {
        this.background = 'black';
      }
    }

    this.id = "_" + (_$Window.windowId++);

    _$Window.windows[ this.id ] = this;
  }

  _$Window.windowId = 0;
  _$Window.windows = {};
  _$Window.zindex = 0;
  _$Window.yoffset = 25;

  _$Window.prototype.schedule = function () {
    var uitvoer = 
      '<div id="' + this.id + '" class="' + this.windowClass + '">' +
      '<div class="title"><div class="close"></div>' +
      '<div class="name">' + this.name + '</div></div>' +
      '<div class="inner">' + (this.view?this.view.render():"") +
      '</div></div>';

    _$Window.container.innerHTML += uitvoer;

    this.move()

    var el = document.getElementById( this.id ).children[1];
    el.style.height = this.size[1] + "px";
    el.style.width = this.size[0] + "px";

    if( this.resizeX && this.resizeY ) {
      el.style.resize = 'both';
      el.style.overflow = 'scroll';
    } else if ( this.resizeX ) {
      el.style.resize = 'horizontal';
      el.style.overflowX = 'scroll';
      el.style[ 'overflow-x' ] = 'scroll';
    } else if ( this.resizeY ) {
      el.style.resize = 'vertical';
      el.style.overflowY = 'scroll';
      el.style[ 'overflow-y' ] = 'scroll';
    } else {
      el.style.overflow = 'hidden';
    }

    el.style.background = this.background;
    el.style.minHeight = this.minSize[1] + "px";
    el.style.minWidth = this.minSize[0] + "px";
    if( this.maxSize ) {
      el.style.maxHeight = this.maxSize[1] + "px";
      el.style.maxWidth = this.maxSize[0] + "px";
    }

    this.select();

    this.el = _$.byId( this.id );
    this.inner = this.el.children[1];
  };

  _$Window.prototype.deschedule = function () {
    _$Window.container.removeChild( document.getElementById( this.id ) );
    delete _$Window.windows[ this.id ];
    this.onclose && this.onclose();
  }

  _$Window.prototype.bringToTop = function () {
    var w = document.getElementById( this.id );
    w.style.zIndex = _$Window.zindex++;
  };

  _$Window.prototype.move = function ( position ) {
    if( position ) {
      this.position[0] = position[0];
      this.position[1] = position[1];
    }

    if( this.position[1] < 0 ) {
      this.position[1] = 0;
    } else if ( this.position[1] > ( window.innerHeight - 25 - _$Window.yoffset) ) {
      this.position[1] = window.innerHeight - 25 - _$Window.yoffset;
    }
    
    var el = document.getElementById( this.id );
    el.style.webkitTransform = "translate(" + this.position[0] + "px," + this.position[1] + "px)";
    el.style.MozTransform = "translate(" + this.position[0] + "px," + this.position[1] + "px)";
  }

  _$Window.prototype.select = function() {
    for( var i in _$Window.windows ) {
      var w = _$.byId( _$Window.windows[ i ].id );
      if( w ) {
        if( i == this.id && w.classList.contains( 'window' ) ) {
          w.classList.add( 'selected' );
        } else {
          w.classList.remove( 'selected' );
        }
      }
    }
  };

  function _drag_events( windowId, add ) {
    var tablet = false;
    var moving = { click: [0,0], window: [0,0] };
    var window = document.getElementById( windowId );

    if( window ) {
      if( add ) {
        _$Window.container.addEventListener( 'mousedown', _mouseOrTablet );
        _$Window.container.addEventListener( 'touchstart', _mouseOrTablet );
      } 
    }
    
  }

  _$.ready( function () {
    var _getEvent;
    var tablet;

    function _tabletGetEvent( event ) {
      return event.changedTouches.item(0);
    }

    function _mouseGetEvent( event ) {
      return event;
    }

    function _mouseOrTablet ( event ) {
      _$Window.container.removeEventListener( 'mousedown', _mouseOrTablet );
      _$Window.container.removeEventListener( 'touchstart', _mouseOrTablet );
      
      if( "touchstart" == event.type ) {
        _$Window.container.addEventListener( 'touchstart', _mousedown );
        _getEvent = _tabletGetEvent;
        tablet = true;
      } else {
        _$Window.container.addEventListener( 'mousedown', _mousedown );
        _getEvent = _mouseGetEvent;
        tablet = false;
      }

      _mousedown( event );
    }

    var moving = { click: [0,0], position: [0,0] };

    function _mousedown ( event ) {
      var target;
      var w;
      var e = _getEvent( event );
      var currentClass = e.target.className;

      switch( e.target.className ) {
      case 'title':
      case 'inner':
        target = e.target.parentElement;
        break;
      case 'close':
      case 'name':
        target = e.target.parentElement.parentElement;  
        break;
      }

      if( target ) {
        w = _$Window.windows[ target.id ];
        w.select();

        switch( e.target.className ) {
        case 'close':
          w.deschedule();
          break;
        case 'title':
        case 'name':
          w.bringToTop();
          moving.click[0] = e.pageX;
          moving.click[1] = e.pageY;
          moving.position[0] = w.position[0];
          moving.position[1] = w.position[1];
          moving.window = w;
          if( tablet ) {
            _$Window.container.addEventListener( 'touchmove', _mousemove );
            _$Window.container.addEventListener( 'touchend', _mouseend );
          } else {
            _$Window.container.addEventListener( 'mousemove', _mousemove );
            _$Window.container.addEventListener( 'mouseup', _mouseup );
            _$Window.container.addEventListener( 'mouseover', _mouseover );
          }
          e.preventDefault();
          e.stopPropagation();
        }        
      }
    }

    function _mousemove ( event ) {
      if( moving.window ) {
        var e = _getEvent( event );
        var offsetx = e.pageX - moving.click[0];
        var offsety = e.pageY - moving.click[1];
        moving.window.move( [ offsetx + moving.position[0],offsety + moving.position[1] ] );
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function _mouseup ( event ) {
      if( moving.window ) {
        var e = _getEvent( event );
        _$Window.container.removeEventListener( 'mousemove', _mousemove );
        _$Window.container.removeEventListener( 'mouseup', _mouseup );
        _$Window.container.removeEventListener( 'mouseover', _mouseover );
        e.preventDefault();
        e.stopPropagation();

        moving.window = null;
      }
    }

    function _mouseover ( event ) {
      var e = _getEvent( event );
      if( 0 == e.which ) {
        _mouseup( event );
      }
    };

    _$Window.container = document.getElementById( 'root' );

    _$Window.container.addEventListener( 'mousedown', _mouseOrTablet );
    _$Window.container.addEventListener( 'touchstart', _mouseOrTablet );

    _$Window.fullscreen = function( callback ) {
      var inFullScreen;

      if( 'undefined' != typeof document.webkitIsFullScreen ) {
        inFullScreen = document.webkitIsFullScreen;
      } else if ( 'undefined' != typeof document.mozFullScreen ) {
        inFullScreen = document.mozFullScreen;
      }

      if( 'undefined' != typeof inFullScreen ) {
        if( inFullScreen ) {
          document.webkitCancelFullScreen && document.webkitCancelFullScreen();
          document.mozCancelFullScreen && document.mozCancelFullScreen();
        } else {
          var root = document.getElementsByTagName( 'body' )[0];
          root && root.webkitRequestFullscreen && root.webkitRequestFullscreen();
          root && root.mozRequestFullScreen && root.mozRequestFullScreen();
        }
      }

      callback && callback();
    }
  } );

  function _$HtmlView( options ) {
    options && _$.populate.call( this, options );
  }

  _$HtmlView.prototype.init = function ( callback ) {
    var that = this;
    var r = new XMLHttpRequest();
    r.onreadystatechange = _onreadystatechange;
    r.open("GET",this.url,true);
    r.send();

    function _onreadystatechange ( e ) {
      if( e.target.readyState != 4 ) { return; }
      that.contents = e.target.responseText;
      callback && callback();
    }
  };

  _$HtmlView.prototype.render = function () {
    return this.contents;
  };

  window._$Window = _$Window;
  window._$HtmlView = _$HtmlView;
} ) ();