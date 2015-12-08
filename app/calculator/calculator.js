( function () {
  var buttons = {
    '0': { x: 10, y: 180, width: 58 },
    '1': { x: 10, y: 146 },
    '2': { x: 44, y: 146 },
    '3': { x: 78, y: 146 },
    'C': { x: 10, y: 44, _f: _clear },
    '^': { x: 44, y: 44, _f: _e },
    '/': { x: 78, y: 44, _f: _divided },
    '*': { x: 112, y: 44, _f: _times },
    '7': { x: 10, y: 78 },
    '8': { x: 44, y: 78 },
    '9': { x: 78, y: 78 },
    '-': { x: 112, y: 78, _f: _minus },
    '4': { x: 10, y: 112 },
    '5': { x: 44, y: 112 },
    '6': { x: 78, y: 112 },
    '+': { x: 112, y: 112, _f: _plus },
    '<-': { x: 112, y: 146, height: 58, _f: _enter },
    '.': { x: 78, y: 180, _f: _point }
  };

  function _key( e ) {
    if( 1 == this.multiplier ) {
      this.value *= 10;
    } else {
      if( 0 == this.multiplier ) {
        this.multiplier = .1;
      } else {
        this.multiplier *= .1;
      }
    }
    this.value += ( this.multiplier * e.target.id );
    this.render();
  }

  function _clear( e ) {
    this.value = 0;
    this.multiplier = 1;
    this.render();
  }

  function _e( e ) {
    if( this.stack.length > 0 ) {
      this.value = this.stack.pop();
    }
    this.render();
  }

  function _divided( e ) {
    if( this.stack.length > 0 ) {
      this.value = ( this.stack.pop() / this.value );
    }
    this.render();
  }

  function _times( e ) {
    if( this.stack.length > 0 ) {
      this.value *= this.stack.pop();
    }
    this.render();
  }

  function _minus( e ) {
    if( this.stack.length > 0 ) {
      this.value = ( this.stack.pop() - this.value );
    }
    this.render();
  }

  function _plus( e ) {
    if( this.stack.length > 0 ) {
      this.value += this.stack.pop();
    }
    this.render();
  }

  function _enter( e ) {
    this.stack.push( this.value );
    _clear.call( this );
  }

  function _point ( e ) {
    if( 1 == this.multiplier ) {
      this.multiplier = 0;
    }
    this.render();
  }

  _$construct( '_$Calculator', {} )
  _$Calculator.prototype._$init = function () {
    this.value = 0;
    this.stack = [];
    this.multiplier = 1;
  };
  _$Calculator.prototype.message = function( msg ) {
    if( ( ! msg ) || ( ! msg.type ) ) {
      return console.log( "_$Calculator app received invalid message" );
    }
    switch( msg.type ) {
    case 'launch':
      this.launch();
    }
  };
  _$Calculator.prototype.launch = function () {
    if( _$Calculator.window ) {
      return _$Calculator.window.select();
    }
    _$Endpoint.get( 'app/calculator/calculator.html', function( err, data ) {
      if( err ) {
        console.log( "Error: " + err.toString() );
        return;
      } 
      if( ! data ) {
        console.log( "Error: No Data Received" );
        return;
      }
      var current = new _$Window( { overflow: 'hidden', resize: 'none', title: "Calculator", app: '_$Calculator',
                                    visual: 'accessory', height: 213, width: 150} );
      _$Calculator.window = current;
      current.content = data.replace( new RegExp( '%id%', 'g' ), current.id );
      current._deschedule = function () { delete _$Calculator.window; }
      current.schedule();
      this.container = current.el.querySelector( ".container" );
      this.res = this.container.querySelector( ".results" );
      this._post_schedule();
      current.select();
    }.bind( this ) );
  };
  _$Calculator.prototype._post_schedule = function ( ) {
    var that = this;

    for( var i in buttons ) {
      var current = buttons[i];
      var n = document.createElement('div');
      n.textContent = i;
      n.id = i;
      n.className = "button"
      n.style.top = current.y + "px";
      n.style.left = current.x + "px";
      current.height && ( n.style.height = current.height + "px" );
      current.width && ( n.style.width = current.width + "px" );
      this.container.appendChild( n );
    }

    this.render();

    _$Calculator.window.el.addEventListener( 'mousedown', _mousedown );
    _$Calculator.window.el.addEventListener( 'mouseup', _mouseup );
    _$Calculator.window.el.addEventListener( 'mouseout', _mouseout );

    function _mouseout ( e ) {
      e.target.classList.remove( 'clicked' );    
    }

    function _mousedown ( e ) {
      var i = e.target.id;
      if( i && buttons[ i ] ) {
        that.down = e.target.id;
        e.target.classList.add( 'clicked' );
      }
    };

    function _mouseup ( e ) {
      var i = e.target.id;
      if( i == that.down ) {
        if( i && buttons[ i ] ) {
          if( buttons[ i ]._f ) {
            buttons[ i ]._f.call( that, e );
          } else {
            _key.call( that, e );
          }
        }
      }
      e.target.classList.remove( 'clicked' );
    }
  };
  _$Calculator.prototype.render = function ( ) {
    var output = "" + this.value;
    if( 0 == this.multiplier ) { output += "."; }
    this.res.textContent = output.substr(0,12);  
  };

} ) ();