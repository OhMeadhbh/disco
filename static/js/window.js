// window.js

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
  var target = _$App.running[ this.app ].menu ? _$App.running[ this.app ].menu : _$App.running[ '_$Desktop' ].menu;
  this.app && _$MenuBar.render( _$MenuBar.collection[ target.id ] );
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
} );