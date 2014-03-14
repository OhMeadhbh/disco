// icon.js

_$construct( '_$Icon', { img: "/img/logo.png", caption: "Disco!", position: "absolute", overflow: "hidden", corner: 0 } );
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
};
_$.ready( function () {
  _$Icon.template = _$.byId( 'template_icon' ).innerHTML;
  disco_counter && disco_counter();
} );