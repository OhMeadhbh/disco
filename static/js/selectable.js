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
