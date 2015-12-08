// Copyright (c) 2013 Smithee, Spelvin, Agnew & Plinge, All Rights Reserved
//
// While there's nothing wrong with other functional programming support libraraies, this one is in a format i prefer.

( function () {

  // _$punch : punches a function into an object's prototype
  if( ! Function.prototype._$punch ) {
    Object.defineProperty( Function.prototype, '_$punch', {
      enumerable: false, configurable: false, writable: false,
      value: function( target, name ) {
        if( ! target[ name ] ) {
          Object.defineProperty( target, name, {
            enumerable: false, configurable: false, writable: false,
            value: this
          } );
        }
      }
    } );
  }

  // _$each : iterates across an array, calling a function on each element. functions are passed the current element and index.
  // 'this' is the object being iterated across.

  ( function( _f ) {
    for( var i in this ) {
      if( _f && this.hasOwnProperty(i) && _f.call( this, this[i], i ) ) { break; };
    }
    return this;
  } )._$punch( Object.prototype, '_$each' );

  ( function( _f ) {
    for( var i = 0, il = this.length; i < il; i++ ) {
      if( _f && _f.call( this, this[i], i ) ) { break; }
    }
    return this;
  } )._$punch( Array.prototype, '_$each' );

  ( function( _f ) {
    for( var i in this ) {
      if( _f && this.hasOwnProperty(i) && _f.call( this, this[i], i ) ) { break; }
    }
    return String( this );
  } )._$punch( String.prototype, '_$each' );

  // _$map : iterates across elements in an object, returning a similar object whose elements are values returned by a function
  // provided. like _$each, functions are passed the current element and index.

  ( function( _f ) {
    var return_value = [];
    _f && this._$each( function( e, i ) {
      return_value.push( _f.call( this, e, i ) );
    } );
    return return_value;
  } )._$punch( Array.prototype, '_$map' );

  ( function( _f ) {
    var return_value = "";
    _f && this._$each( function( e, i ) {
      return_value += _f.call( this, e, i );
    } );
    return return_value;
  } )._$punch( String.prototype, '_$map' );

  ( function( _f ) {
    var return_value = {};
    _f && this._$each( function( e, i ) {
      return_value[i] = _f.call( this, e, i );
    } );
    return return_value;
  } )._$punch( Object.prototype, '_$map' );

  // _$fold : (aka reduce) iterates across elements, using a function provided to reduce the elements of the list into a single
  // scalar value.

  ( function( _f, base ) {
    base = ("undefined" != typeof base)?base:0;
    this._$each( function( e, i ) {
      base = _f.call( this, base, e, i );
    } );
    return base;
  } )._$punch( Object.prototype, '_$fold');

  // _$reverse : reverses the elements in an array, returning a NEW array (i.e. - it does not reverse in place.)

  ( function() {
    return this.slice().reverse();
  } )._$punch( Array.prototype, '_$reverse' );

  // _$negate : returns a function that negates a call to the function it is applied to.

  ( function () {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      return ! this.apply( this, args );
    }.bind( this );
  } )._$punch( Function.prototype, '_$negate' );

  // _$all : returns true if a provided function returns true for all the elements in an array

  ( function ( _f ) {
    return this._$fold( function ( base, e, i ) {
      return base & _f.call( this, e, i );
    }, true );
  } )._$punch( Object.prototype, '_$all' );

  // _$any : returns true if a provided function returns true for any the elements in an array

  ( function ( _f ) {
    return this._$fold( function ( base, e, i ) {
      return base | _f.call( this, e, i );
    }, false );
  } )._$punch( Object.prototype, '_$any' );

  // _$none : returns true if a provided function returns false for all the elements in an array

  Object.prototype._$any._$negate()._$punch( Object.prototype, '_$none' );

  // _$pluck : iterates across an object's elements, returning an array of objects plucked from the reciever's elements

  ( function ( prop ) {
    var return_value = [];
    this._$each( function ( e ) {
      return_value.push( ( 'object' == typeof e ) ? e[ prop ] : undefined );
    } );
    return return_value;
  } )._$punch( Object.prototype, '_$pluck' );

  // _$keys : i was surprised to find a JavaScript environment that didn't implement Object.keys(). this implementation uses
  // it, if it's available, otherwise it uses its own.

  if( "function" == typeof Object.keys ) {
    ( function() { return Object.keys( this ); } )._$punch( Object.prototype, '_$keys' );
  } else {
    ( function() {
      var return_value = [];
      this._$each( function( e, i ) { return_value.push( i ); } );
      return return_value;
    } )._$punch( Object.prototype, '_$keys' );
  }

  // _$shallow : makes a shallow copy of properties from one object to another

  ( function ( source ) {
    source._$each( function( e, i ) {
      this[ i ] = e;
    }.bind( this ) );
    return this;
  } )._$punch( Object.prototype, '_$shallow' );

  // _$merge : merges the contents of one object or array into another.

  ( function ( source ) {
    if( ('object' == typeof this ) && ( 'object' == typeof source ) ) {
      source._$each( function ( e, i ) {
        if( ('object' == typeof this[i] ) && ( 'object' == typeof e ) ) {
          this[ i ]._$merge( e );
        } else {
          if( 'undefined' != typeof e ) {
            this[ i ] = e;
          }
        }
      }.bind( this ) );
    }
    return this;
  } )._$punch( Object.prototype, '_$merge' );

  function _$global() {
    if ( 'undefined' == typeof global ) {
      if( 'undefined' == typeof window ) {
        throw new Error( "cannot find global context" );
      }
      return window;
    }
    return global;
  }

  _$global()._$global = _$global;

  // _$construct : creates a constructor that uses _$shallow to populate a new object's properties from defaults and options
  _$global()._$construct = function( name, defaults, global ) {
    (global?global:_$global())[ name ] = function( options, callback ) {
      this._$shallow( defaults )._$shallow( options?options:{} );
      this._$init && this._$init.call( this );
      this._$initAsync && this._$initAsync.call( this, callback );
    };
  };

  // _$f : default function for callbacks

  _$global()._$f = function() {};

  // _$counter : returns a function that calls another function after N invocations

  ( function ( _after ) {
    var count = this;
    var args = Array.prototype.slice.call( arguments, 1 );
    return function() { --count || _after._$nextTickApply( args ); };
  } )._$punch( Number.prototype, '_$counter' );

  // _$sim : executes a function on all elements of an array, then after all have called back, call a different function.

  ( function ( _do, _after ) {
    var cf = this.length._$counter( Function.prototype._$partial.apply( _after, Array.prototype.slice.call( arguments, 2 ) ) );
    this._$each( function( e, i ) { _do._$nextTick( e, i, cf ); } );
  } )._$punch( Array.prototype, '_$sim' );

  // _$partial : returns a function that partially applies some leading parameters.

  ( function () {
    var args = Array.prototype.slice.call( arguments );
    var _f = this;
    return function() {
      return _f.apply(this, args.concat( Array.prototype.slice.call( arguments ) ) );
    }
  } )._$punch( Function.prototype, '_$partial' );

  // _$compose : returns a function that calls the function provided on the output of the function it is called against.

  ( function ( _g ) {
    var _f = this;
    return function () {
      return _f.call( this, _g.apply( this, Array.prototype.slice.call( arguments ) ) );
    };
  } )._$punch( Function.prototype, '_$compose' );

  // _$flip : returns a function that calls the function it is applied against with parameters reversed.

  ( function () {
    var _f = this;
    return function () {
      return _f.apply( this, Array.prototype.slice.call( arguments ).reverse() );
    };
  } )._$punch( Function.prototype, '_$flip' );

  if( ( 'undefined' != typeof process ) && ( 'function' == typeof process.nextTick ) ) {
    // _$nextTickApply (for node)
    ( function( _params ) {
      var _f = this;
      process.nextTick( function() { _f.apply( this, _params ); } )
    } )._$punch( Function.prototype, '_$nextTickApply' );
  } else if( 'function' == typeof setImmediate ) {
    // _$nextTickApply (for firefox & chrome)
    ( function( _params ) {
      var _f = this;
      setImmediate( function () { _f.apply( this, _params ); } );
    } )._$punch( Function.prototype, '_$nextTickApply' );
  } else {
    // _$nextTickApply (for other environements )
    ( function( _params ) {
      var _f = this;
      setTimeout( function () { _f.apply( this, _params ); } );
    } )._$punch( Function.prototype, '_$nextTickApply' );
  }

  // _$nextTick : executes a function the next time through the event loop
  ( function () {
    this._$nextTickApply( Array.prototype.slice.call(arguments) );
  } )._$punch( Function.prototype, '_$nextTick' );

} ) ();
