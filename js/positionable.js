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
