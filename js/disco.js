( function () { var _private = {};
// disco-core.js

( function ( source ) {
  source._$each && source._$each( function( e, i ) {
    if ( 'function' == typeof e ) { this[i] = e; }
  }.bind( this ) );
} )._$punch( Object.prototype, '_$mixin' );

_$construct( '_$', {} );
_$.ready = function ( _f ) { document.addEventListener( 'DOMContentLoaded', _f); };
_$.byId = function ( id, element ) { element || ( element = document ); return element.getElementById( id ); };
_$.qsa = function ( id, element ) { element || ( element = document ); return element.querySelectorAll( id ); };

var disco_counter = Number(5)._$counter( function() {
  _$App.launch( '_$Desktop' );
} );window._$Prefs = {
  dblClickTimeout: 180,
  minMouseMove: 10,
  snapToGrid: 20
};
// error.js

_$construct( '_$Error', { success: false, text: undefined, errno: undefined, severity: undefined, url: undefined } );

_$Error.prototype.toString = function() {
  return ( "%" + this.severity + ( this.errno ? "(" + this.errno + ")" : '' ) + '; ' + ( this.text ? this.text : '' ) );
};

_$Error.prototype.toHTML = function() {
  var output = ( this.text ? this.text : '' ) + ( this.errno ? ' (' + this.errno + ')' : '' );
  if( this.url ) {
    output = '<a href="' + this.url + '">' + output + '</a>';
  }
  return output;
};

_$Error.prototype._severity = function ( s ) {
  var i = s ? s : ( this.severity ? this.severity : 'info' );
  return i.substr(0,1).toUpperCase() + i.substr(1);
};

_$Error.prototype.raise = function () {
  if( _$Error.container && _$Error.template ) {
    var interior = this.text;
    this.errno && ( interior += " (" + this.errno + ")" );
    this.severity && ( interior = this.severity + ": " + interior );
    this.url && ( interior = '<a href="' + this.url + '">' + interior + '</a>' );
    var output = _$Error.template.replace( /{severity}/gm, this.severity );
    output = output.replace( /{text}/gm, interior );
    _$.byId( _$Error.container ).innerHTML = output;
  }
};
// endpoint.js

_$construct( '_$Endpoint', {url: undefined, parent: undefined, expires: undefined} );
_$Endpoint.prototype._$init = function () {
  _$Endpoint.endpoints[ this.url ] = this;
}

_$Endpoint.endpoints = {};

var dataTypeToContentType = {
  'json': 'application/json',
  'xml': 'application/xml'
};

_$Endpoint.query = function( url, method, body, complete, dataType ) {
  var request = new XMLHttpRequest();
  var responseType, responseLength;

  request.onreadystatechange = _rsc;
  request.open( method, url, true );
  if( body ) {
    dataType || ( dataType = 'json' );
    dataTypeToContentType[ dataType ] || ( dataType = 'json' );
    request.setRequestHeader( 'Content-Length', body.length );
    request.setRequestHeader( 'Content-Type', dataTypeToContentType[ dataType ] );
  }
  request.send( body );

  function _rsc( event ) {
    switch( event.target.readyState ) {
    case 2:
      responseType = event.target.getResponseHeader( 'content-type' );
      responseLength = event.target.getResponseHeader( 'content-length' );
      break;
    case 4:
      if( 200 == event.target.status ) {
        if( 'application/xml' == responseType ) {
          complete( null, event.target.responseXML );
        } else if( 'application/json' == responseType ) {
          complete( null, JSON.parse( event.target.response ) );
        } else {
          complete( null, event.target.response );
        }
      } else {
        complete( new Error( event.target.response ) );
      }
    }
  }
};

_$Endpoint.get = function( url, complete, dataType ) {
  _$Endpoint.query( url, 'GET', null, complete, dataType );
};

_$Endpoint.post = function( url, body, complete, dataType ) {
  _$Endpoint.query( url, 'POST', body, complete, dataType );
};

_$Endpoint.put = function( url, body, complete, dataType ) {
  _$Endpoint.query( url, 'PUT', body, complete, dataType );
};

_$Endpoint.del = function( url, complete, dataType ) {
  _$Endpoint.query( url, 'DELETE', complete, dataType );
};

_$Endpoint.prototype.get = function( complete, dataType ) {
  _$Endpoint.get( this.url, complete, dataType );
};

_$Endpoint.prototype.post = function( body, complete, dataType ) {
  _$Endpoint.post( this.url, body, complete, dataType );
};

_$Endpoint.prototype.put = function( body, complete, dataType ) {
  _$Endpoint.put( this.url, body, complete, dataType );
};

_$Endpoint.prototype.del = function( complete, dataType ) {
  _$Endpoint.del( this.url, complete, dataType );
};

window._$Endpoint = _$Endpoint;// collectable.js

_private.collectable = {
  init_collectable: function () {
    this.id = this.id ? this.id : this.constructor.id++;
    this.constructor.collection[ this.id ] = this;
  }
};
// positionable.js

_private.positionable = {
  _corners: [ [ 'top', 'left', 1, 1 ], [ 'top', 'right', 1, -1 ], [ 'bottom', 'right', -1, -1 ], [ 'bottom', 'left', -1, 1 ] ],
  schedule: function ( props ) {
    if( ! props ) { props = {}; }
    var elid = this._elid();
    var content = ( { id: elid, caption: this.caption, contentid: elid + "_content", title: this.title, content: this.content } )._$fold( function( base, e, i ) {
      return base.replace( '%' + i + '%', e );
    }, this.constructor.template );

    this.parent = props.parent ? props.parent : ( props.parentId ? _$.byId( props.parentId ) : _$.byId( 'root' ) );
    this.parent.insertAdjacentHTML( 'beforeend', content )

    this.updateCorner();

    this.el = this.parent.querySelector( '#' + elid );
    this.elc = this.el.querySelector( '.content' );

    this._schedule && this._schedule( props );

    this._stylize( this, {
      position: [ 'el', '' ], overflow: [ 'elc', '' ], "overflow-x": [ 'elc', '' ], "overflow-y": [ 'elc', '' ],
      resize: [ 'elc', '' ], top: [ 'el', 'px' ], right: [ 'el', 'px' ], bottom: [ 'el', 'px' ], left: [ 'el', 'px' ], 
      maxWidth: [ 'elc', 'px' ], minWidth: [ 'elc', 'px' ], maxHeight: [ 'elc', 'px' ], minHeight: [ 'elc', 'px' ],
      zIndex: [ 'el', '' ], width: [ 'elc', 'px' ], height: [ 'elc', 'px' ]
    } );

    this.move();
  },
  move: function () {    
    this.el.style.webkitTransform = "translate(" + ( this.x * this.x_t ) + "px," + ( this.y * this.y_t ) + "px)";
  },
  moveRelative: function( dx, dy ) {
    this.x += ( dx * this.x_t );
    this.y += ( dy * this.y_t );
    this._adjustXY && this._adjustXY();
    this.move();
  },
  updateCorner: function () {
    this[ _private.positionable._corners[ this.corner ][0] ] = 0;
    this[ _private.positionable._corners[ this.corner ][1] ] = 0;

    this.y_t = _private.positionable._corners[ this.corner ][2];
    this.x_t = _private.positionable._corners[ this.corner ][3];
  },
  _elid: function () { return this.constructor.prefix + "_" + this.id; },
  _stylize: function( target, descriptor ) {
    descriptor._$each( function( e, i ) {
      if( 'undefined' != typeof this[ i ] ) {
        if( target[ e[ 0 ] ] ) { target[ e[ 0 ] ].style[ i ] = this[ i ] + e[ 1 ]; }
      }
    }.bind( this ) );

    this.style &&
      ( 'string' == typeof this.style ? [ this.style ] : this.style )._$each( function( e ) { target.classList.add( e ) }.bind( this ) );
  },
  deschedule: function () {
    this.parent.removeChild( this.el );
    delete this.constructor.collection[ this.id ];
    this._deschedule && this._deschedule();
  }
};
// selectable.js

_private.selectable = {
  _selecting: undefined,
  _moving: false,
  _minimizing: false,
  _closing: false,
  _maximizing: false,
  _root: undefined,
  _timer: undefined,
  _makeSelectable: function () {
    var target,selecting = this;

    if( this.constructor.selectHandle ) {
      target = this[ this.constructor.selectHandle ];
      var mouse_origin, body_height, differential;

      target.addEventListener( 'mousedown', _mousedown_title );
      target.addEventListener( 'touchstart', _mousedown_title );

      selecting.ell && selecting.ell.addEventListener( 'mousedown', _mousedown_close );

      selecting.elx && selecting.elx.addEventListener( 'mousedown', _mousedown_max );

      selecting.eln && selecting.eln.addEventListener( 'mousedown', _mousedown_min );

      function _mousedown_close( event ) {
        _private.selectable._closing = true;
        selecting.parent.addEventListener( 'mouseup', _mouseup );
        event.stopPropagation();
      };

      function _mousedown_max( event ) {
        _private.selectable._maximizing = true;
        selecting.parent.addEventListener( 'mouseup', _mouseup );
        event.stopPropagation();
      } 

      function _mousedown_min( event ) {
        _private.selectable._maximizing = true;
        selecting.parent.addEventListener( 'mouseup', _mouseup );
        event.stopPropagation();
      }

      function _mousedown_title( event ) {
        if( "touchstart" == event.type ) {
          event.stopPropagation();
          event.preventDefault();
          event = event.touches.item(0);
        }

        selecting.parent.addEventListener( 'mouseup', _mouseup );
        selecting.parent.addEventListener( 'touchend', _mouseup );
        selecting.parent.addEventListener( 'mousemove', _mousemove );
        selecting.parent.addEventListener( 'touchmove', _mousemove );
        selecting.parent.addEventListener( 'mouseover', _mouseover );

        mouse_origin = { pageX: event.pageX, pageY: event.pageY };
        body_height = _private.selectable._root.offsetHeight;
        differential = {};
      }

      function _mousemove ( event ) {
        if( "touchmove" == event.type ) {
          event = event.touches.item(0);
        }

        var dx = event.pageX - mouse_origin.pageX;
        var dy = event.pageY - mouse_origin.pageY;
        var d = Math.sqrt( dx * dx + dy * dy );
        if( false == _private.selectable._moving ) {
          if( d > _$Prefs.minMouseMove ) {
            _private.selectable._moving = true;
            selecting.beginDrag && selecting.beginDrag();
          }
        } else {
          selecting.moveRelative( dx, dy );
          mouse_origin.pageX = event.pageX;
          mouse_origin.pageY = event.pageY;
          selecting._moveRelative && selecting._moveRelative( dx, dy, selecting.id );
        }
      }
       
      function _mouseup( event ) {
        if( _private.selectable._moving ) {
          _private.selectable._moving = false;
          selecting.endDrag && selecting.endDrag();
        } else if( _private.selectable._closing ) {
          _private.selectable._closing = false;
          if( event.target == selecting.ell ) {
            selecting.deschedule();
          }
        } else if( _private.selectable._maximizing ) {
          _private.selectable._maximizing = false;
          if( event.target == selecting.elx ) {
            selecting.maximize && selecting.maximize();
          }
        } else if( _private.selectable._minimizing ) {
          _private.selectable._minimizing = false;
          if( event.target == selecting.eln ) {
            selecting.minimize && selecting.minimize();
          }
        } else {
          if( 'undefined' == typeof _private.selectable._timer ) {
            _private.selectable._timer = setTimeout( function () {
              _private.selectable._timer = undefined;
              selecting.click && selecting.click( event );
            }, _$Prefs.dblClickTimeout ? _$Prefs.dblClickTimeout : 200 )
          } else {
            clearTimeout( _private.selectable._timer );
            _private.selectable._timer = undefined;
            selecting.dblClick && selecting.dblClick();              
          }
        }
        selecting.parent.removeEventListener( 'mouseup', _mouseup );
        selecting.parent.removeEventListener( 'touchend', _mouseup );
        selecting.parent.removeEventListener( 'mousemove', _mousemove );
        selecting.parent.removeEventListener( 'touchmove', _mousemove );
        selecting.parent.removeEventListener( 'mouseover', _mouseover );
      }

      function _mouseover ( event ) {
        if( 0 == event.which ) {
          _mouseup( event );
        }
      }
    }
  },
  select: function () {
    this.selected = true;
    this.el.classList.add( 'selected' );
    this._select && this._select();
  },
  deselect: function () {
    this.selected = false;
    this.el.classList.remove( 'selected' );
    this._deselect && this._deselect();
  },
  selectToggle: function () {
    if( this.selected ) { this.deselect(); } else { this.select(); }
  }
};

_$.ready( function () {
  _private.selectable._root = _$.byId( 'root' );
  _private.selectable._root.addEventListener( 'mouseup', _root_mouseup );

  function _root_mouseup( event ) {
    if( _private.selectable._root == event.target ) {
      _$Icon.selected[ _private.selectable._root.id ] && _$Icon.selected[ _private.selectable._root.id ]._$each( function( e, i ) {
        if( e ) {
          _$Icon.collection[ i ] && _$Icon.collection[ i ].deselect();
        }
      } );
      _$Window.collection && _$Window.collection._$each( function( e ) {
        e.deselect();
      } );
      _$MenuBar.render( _$MenuBar.collection[ _$App.running[ '_$Desktop' ].menu.id ] )
    }
  }

  disco_counter && disco_counter();
} );
// style.js

// icon.js

//_$construct( '_$Icon', { img: "/img/logo.png", caption: "Disco!", position: "absolute", overflow: "hidden", corner: 0 } );
_$construct( '_$Icon', { img: "/img/logo.png", caption: "Disco!", overflow: "hidden", corner: 0 } );
_$Icon.prototype._$mixin( _private.collectable );
_$Icon.prototype._$mixin( _private.positionable );
_$Icon.prototype._$mixin( _private.selectable );
_$Icon.collection = {};
_$Icon.selected = {};
_$Icon.id = 0;
_$Icon.selectHandle = 'elc';
_$Icon.prefix = 'icon';
_$Icon.prototype._$init = function () {
  this.init_collectable();
};
_$Icon.prototype._schedule = function () {
  this.elc.style.backgroundImage = "url(" + this.img + ")";
  this._makeSelectable();
  if( 'undefined' == typeof _$Icon.selected[ this.parent.id ] ) {
      _$Icon.selected[ this.parent.id ] = {};
  }
}
_$Icon.prototype._select = function () {
  _$Icon.selected[ this.parent.id ][ this.id ] = true;
};
_$Icon.prototype._deselect = function () {
  _$Icon.selected[ this.parent.id ][ this.id ] = false;
};
_$Icon.prototype.click = function () {
  this.selectToggle();
};
_$Icon.prototype._moveRelative = function ( dx, dy, id ) {
  _$Icon.selected[ this.parent.id ]._$each( function( e, i ) {
    if( ( ! e ) || ( i == id ) ) { return; }
    _$Icon.collection[ i ] && _$Icon.collection[ i ].moveRelative( dx, dy );
  } );
};
_$Icon.prototype.beginDrag = function () {
  if( ! this.moving ) {
    this.oldSelected = this.selected;
    this.select();
    this.moving = true;
  }
  
  _$Icon.selected[ this.parent.id ]._$each( function( e, i ) {
    if( e || ( this.id == i ) ) {
      var icon = _$Icon.collection[ i ];
      if( icon ) {
        icon.oldZIndex = icon.zIndex;
        icon.zIndex = 65534;
        icon._stylize( icon, { zIndex: ['el', '' ] } );
      }
    }
  }.bind( this ) );
};
_$Icon.prototype.endDrag = function () {
  if( ! this.oldSelected ) {
    this.deselect();
  }
  this.moving = false;
  _$Icon.selected[ this.parent.id ]._$each( function( e, i ) {
    if( e || ( this.id == i ) ) {

      var icon = _$Icon.collection[ i ];
      if( icon ) {
        icon.zIndex = ( 'undefined' != typeof icon.oldZIndex ) ? icon.oldZIndex : 0;
        icon._stylize( icon, { zIndex: ['el', '' ] } );
      }

      var fixPosition = false;
      if( icon.x < 1 ) {
        icon.x = 1; fixPosition = true;
      }

      if( icon.y < 1 ) {
        icon.y = 1; fixPosition = true;
      }

      if( icon.x > ( _private.selectable._root.offsetWidth - icon.el.offsetWidth ) ) {
        icon.x = _private.selectable._root.offsetWidth - icon.el.offsetWidth; fixPosition = true;
      }

      if( icon.y > ( _private.selectable._root.offsetHeight - icon.el.offsetHeight ) ) {
        icon.y = _private.selectable._root.offsetHeight - icon.el.offsetHeight; fixPosition = true;
      }

      if( fixPosition ) {
        icon.move();
      }
    }
  }.bind( this ) );

  this._endDrag && this._endDrag();
};
  _$Icon.prototype._moveToRoot = function () {
    console.log( "moving icon " + this.id + " to root" );
    var xy = [this.x, this.y];
    var current = this.parent;
    do {
      if( current.style.webkitTransform ) {
        var t = current.style.webkitTransform;
        var items = t.substring(10, t.length -1 ).split(", ");
        xy[0] += Number( items[0].substring(0, items[0].length -2) );
        xy[1] += Number( items[1].substring(0, items[1].length -2) );
      } else {
        xy[0] += current.offsetLeft;
        xy[1] += current.offsetTop;
      }

      current = current.parentElement;
    } while( current != document.body );

    

  };
  _$Icon.prototype._moveFromRoot = function () {
    console.log( "moving icon " + this.id + " from root" );
  };
_$.ready( function () {
  _$Icon.template = _$.byId( 'template_icon' ).innerHTML;
  disco_counter && disco_counter();
} );// window.js

_$construct( '_$Windowless', {} );
_$Windowless.prototype._$init = function () {
  this.id = _$Window.id++;
  _$Window.collection[ this.id ] = this;
  this.el = _$.byId( this.parentId );
};

_$construct( '_$Window', { height: 240, width: 320, overflow: 'hidden', corner: 0 } );
_$Window.prototype._$mixin( _private.collectable );
_$Window.prototype._$mixin( _private.positionable );
_$Window.prototype._$mixin( _private.selectable );
_$Window.selectHandle = 'elt';
_$Window.collection = {};
_$Window.id = 0;
_$Window.defaultContent = '';
_$Window.prefix = 'window';
_$Window.toggleFullScreen = function () {
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
}
_$Window.prototype._$init = function () {
  this.init_collectable();
  if( ! this.zIndex ) { this.zIndex = _$Window.collection._$keys().length; }
  if( ! this.x ) { this.x = ( this.id % 15 ) * 20 + 148; }
  if( ! this.y ) { this.y = ( this.id % 5 ) * 20 + 20; }
  if( ! this.title ) { this.title = "Window " + this.id; }
  if( ! this.content ) { this.content = _$Window.defaultContent };
};
_$Window.prototype._schedule = function () {
  if( this.el && this.visual ) {
    this.el.classList.add( this.visual );
  }

  this.elt = this.el.querySelector( '.windowtitle' );
  this.ell = this.elt.querySelector( '.windowclose' );
  this.elx = this.elt.querySelector( '.windowmax' );
  this.eln = this.elt.querySelector( '.windowmin' );

  this.elc.insertAdjacentHTML( 'beforeend', ( 'function' != this.content ? this.content : this.content() ) );
  this._makeSelectable();
};
_$Window.prototype.click = function ( event ) {
  _$Window.collection._$each( function ( e, i ) {
    if( this.id != e.id ) {
      e.deselect();
    }
  }.bind( this ) );
  this.select();
};
_$Window.prototype._select = function () {
  _$Window.collection._$each( function( e, i ) {
    if( this.id != e.id ) {
      e.deselect();
    }
  }.bind( this ) );
  this.bringToTop();
  var targetName = this.app ? this.app : '_$Desktop';
  var targetMenu = _$App.running[ targetName ].menu ? _$App.running[ targetName ].menu : _$App.running[ '_$Desktop' ].menu;
  _$MenuBar.render( _$MenuBar.collection[ targetMenu.id ] );
};
_$Window.prototype.bringToTop = function () {
  _$Window.collection._$each( function( e, i ) {
    if( e.zIndex > this.zIndex ) {
      e.zIndex--;
      e._stylize( e, { zIndex: [ 'el', '' ] } );
    }
  }.bind( this ) );
  this.zIndex = _$Window.collection._$keys().length;
  this._stylize( this, { zIndex: [ 'el', '' ] } );
};
_$Window.prototype.maximize = function() {
  console.log( 'maximize ' + this.id );
};
_$Window.prototype.minimize = function() {
  console.log( 'minimize ' + this.id );
};
_$Window.prototype.endDrag = function () {
  this.click();
};
_$Window.prototype._adjustXY = function () {
  var height = this.parent.offsetHeight;
  switch( this.corner ) {
  case 0:
  case 1:
    if( this.y < 0 ) { this.y = 0; }
    if( this.y > ( height - 21 ) ) { this.y = height - 21; }
    break;
  case 2:
  case 3:
    if( this.y > ( height - this.height - 22 ) ) { this.y = height - this.height - 22; }
    if( this.y < ( - this.height - 1 ) ) { this.y = - this.height - 1; }
    break;
  }
};
_$.ready( function () {
  _$Window.template = _$.byId( 'template_window' ).innerHTML;
  disco_counter && disco_counter();
} );// menu.js

_$construct( '_$Dropdown', { id: 'menubar_dropdown' } );
_$Dropdown.prototype._$mixin( _private.positionable );
_$Dropdown.prefix = "dropdown";

_$construct( '_$MenuBar', { items: [] } );
_$MenuBar.prototype._$mixin( _private.collectable );
_$MenuBar.hide = function () {
  var item = _$.byId( 'dropdown_menubar' );
  item && _$.byId('root').removeChild( item );
};
_$MenuBar._render = function ( holder, menubar ) {
  _$MenuBar.last = -1;
  _$MenuBar.hide();
  _$MenuBar.menubars[ holder ] = menubar;
  _$MenuBar.els[ holder ].innerHTML = menubar.items._$fold( function( base, e, i ) {
    return base + '<li id="' + [ 'menubar', menubar.id, i ].join( "_" ) + '"><a>' +
      ( e.img ? ('<img src="' + e.img + '">') : ( e.text ? e.text : '' ) ) + '</a></li>';
  }.bind( this ), "" );
  menubar.items._$each( function( e, i ) {
    var id = [ menubar.id, i ].join("_");
    var item = _$.byId( [ 'menubar', id ].join( "_" ) );
    if( item ) {
      item.onclick = e.handler ? e.handler : function () { _$MenuBar.hide(); menubar.doReveal( i ); };
    }
  }.bind( this ) );
};
_$MenuBar.render = _$MenuBar._render._$partial( 'menuapp' );
_$MenuBar.prototype._$init = function () {
  this.init_collectable();
};
_$MenuBar.prototype.doReveal = function( id ) {
  if( ( _$MenuBar.last < 0 ) || ( ( 256 * this.id + id ) != _$MenuBar.last ) ) {
    _$MenuBar.last = 256 * this.id + id;
    this.reveal( id );
  } else  {
    _$MenuBar.last = -1;
  }
};
_$MenuBar.prototype.reveal = function( id ) {
  var left = _$.byId( [ 'menubar', this.id, id ].join( '_' ) ).offsetLeft;
  console.log( "revealing " + [ this.id, id ].join('_') + " at " + [ left, 21 ] );
  var items = this.items[id].items;
  if( items ) {
    var output = "";
    items._$each( function( e, i ) {
      output += '<tr class="drophandle" id="dropdown_' + i + '">';
      if( e.separator ) {
        output += '<td colspan="3"><hr/></td>';
      } else {
        output += '<td class="dropimg">' + (e.img?('<img src="' + e.img + '">'):"&nbsp;") + '</td>' +
          '<td class="droptext">' + (e.text?e.text:"&nbsp;") + '</td>' +
          '<td class="dropkey">' + (e.key?("⌥&nbsp;" + e.key.toUpperCase()):"&nbsp;") + '</td>';
      }
      output += '</tr>';
//      output += '<li class="drophandle" id="dropdown_' + i + '"><a>';
// ⌥
//      if( e.separator ) {
//        output += '<hr/>'
//      } else {
//        if( e.img ) {
//          output += '<img src="' + e.img + '">';
//        }
//        if( e.text ) {
//          output += e.text;
//        }
//        if( e.key ) {
//          output += "&nbsp;⌥" + e.key.toUpperCase();
//        }
//      }
//      output += "</a></li>";
    } );
    var dropdown = new _$Dropdown( { x: left, y: 0, content: output, id: 'menubar', corner: 0 } );
    dropdown.schedule();
    items._$each( function( e, i ) {
      var id = 'dropdown_' + i;
      var item = _$.byId( id );
      if( item ) {
        item.onclick = ( e.handler ?
                         function () { console.log( id ); _$MenuBar.last = -1; _$MenuBar.hide(); e.handler(); } :
                         function () { console.log( id ); _$MenuBar.last = -1; _$MenuBar.hide(); } );
      }
    } );
  }
};
_$MenuBar.collection = {};
_$MenuBar.menubars = {};
_$MenuBar.els = {};
_$MenuBar.id = 0;
_$MenuBar.defaults = {
  'menuleft' : new _$MenuBar( { items: [ { img: '/img/logo.png', items: [
    { text: 'About Discovery...', handler: function () { _$App.launch( '_$IMGViewer', '/img/disco.png' ); } },
    { separator: true },
    { text: 'Clock', img: "/app/clock/icon_16.png", handler: function () { _$App.launch( '_$Clock' ); } },
    { text: 'Calculator', img: "/app/calculator/icon_16.png", handler: function () { _$App.launch( '_$Calculator' ); } },
    { text: 'Note Pad', img: "/app/notepad/icon_16.png", handler: function () { _$App.launch( '_$NotePad' ); } },
    { text: 'Puzzle', img: "/app/puzzle/icon_16.png", handler: function () { _$App.launch( '_$Puzzle' ); } }
  ] } ] } ),
  'menudesktop': new _$MenuBar( { items: [ { img: '/app/desktop/icon_16.png' } ], corner: 1 } ),
  'menuright': new _$MenuBar( { items: [ { img: '/img/help.png', handler: function () { _$App.launch('_$HTMLReader', '/contents/help.html'); } }, { img: '/img/fullscreen.png', handler: _$Window.toggleFullScreen } ] } )
};

_$.ready( function () {
  _$Dropdown.template = _$.byId( 'template_dropdown' ).innerHTML;

  [ 'menuleft', 'menuapp', 'menudesktop', 'menuright' ]._$each( function( e ) {
    _$MenuBar.els[ e ] = _$.byId( e );
    _$MenuBar.defaults[ e ] && _$MenuBar._render( e, _$MenuBar.defaults[ e ] );
  } );

  disco_counter && disco_counter();
} );// app.js

_$construct( '_$App', {} );
_$App.registry = {};
_$App.running = {};
_$App.launch = function( id ) {
  console.log( "Launch request: " + id );

  var appref = _$App.registry[ id ];
  if( ! appref ) {
    return console.log( "Application (" + id + ") is not registered"  );
  }

  if( ( ! appref.id ) || ( ! appref.script ) ) {
    return console.log( "Application (" + id + ") registry entry missing id or script reference" );
  }

  var args = Array.prototype.slice.call( arguments, 1 );

  var instance = _$App.running[ id ];
  if( instance ) {
    instance.message( { type: "launch", args: args } );
  } else {
    var script = document.createElement( 'script' );
    script.setAttribute( 'id', 'script_' + appref.id );
    script.setAttribute( 'type', 'text/javascript' );
    script.setAttribute( 'src', appref.script );
    var onload = "_$App.running['" + appref.id + "'] = new " + appref.id + "(); _$App.message( '" + appref.id +
      "', { type: 'launch', args: " + JSON.stringify( args ) + " } );";
    script.setAttribute( 'onload', onload );
    document.body.appendChild( script );
  }
};
_$App.deorbit = function( id ) {
};
_$App.message = function( id, msg ) {
  var instance = _$App.running[ id ];
  if( ! instance ) {
    return console.log( "Application (" + id + ") is not running"  );
  }
  instance.message( msg );
};
_$.ready( function () {
  _$Endpoint.get( '/app/registry.json', function( err, data ) {
    if( ! err ) {
      data && data._$each && data._$each( function( e ) {
        if( ! e.id ) { return };
        _$App.registry[ e.id ] = e;
      } );
    }
    disco_counter && disco_counter();
  } );
} );} ) ();
