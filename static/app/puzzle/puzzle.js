( function () {

  var offsets = [
    [ 0, -1 ],
    [ 1, 0 ],
    [ 0, 1 ],
    [ -1, 0 ]
  ];

  _$construct( '_$Puzzle', {} )
  _$Puzzle.prototype._$init = function () {
    this.model = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  };
  _$Puzzle.prototype.message = function( msg ) {
    if( ( ! msg ) || ( ! msg.type ) ) {
      return console.log( "_$Puzzle app received invalid message" );
    }
    switch( msg.type ) {
    case 'launch':
      this.launch();
    }
  };
  _$Puzzle.prototype.launch = function () {
    if( _$Puzzle.window ) {
      return _$Puzzle.window.select();
    }
    _$Endpoint.get( 'app/puzzle/puzzle.html', function( err, data ) {
      if( err ) {
        console.log( "Error: " + err.toString() );
        return;
      } 
      if( ! data ) {
        console.log( "Error: No Data Received" );
        return;
      }
      var current = new _$Window( { overflow: 'hidden', resize: 'none', title: "Puzzle", app: '_$Puzzle',
                                    visual: 'accessory', height: 145, width: 150} );
      _$Puzzle.window = current;
      current.content = data.replace( new RegExp( '%id%', 'g' ), current.id );
      current._deschedule = function () { delete _$Puzzle.window; }
      current.schedule();
      this.post_schedule();
      current.select();
    }.bind( this ) );
  };

  _$Puzzle.prototype.post_schedule = function () {
    this.el = _$Puzzle.window.el;
    this.puzzle = this.el.querySelector( '#puzzle' );

    for( var i = 0; i < 200; i++ ) {
      this.click( Math.floor( Math.random() * 4 ), Math.floor( Math.random() * 4 ) );
    }

    for( var i = 0, il = this.model.length; i < il; i++ ) {
      var index = this.model[i];
      if( index < 15 ) {
        var piece = document.createElement('div');
        piece.id = "_" + index;
        var y = ( Math.floor( i / 4 ) * 32 );
        var x = ( i % 4 ) * 32;
        piece.style.top = y + "px";
        piece.style.left = x + "px";
        y = ( Math.floor( index / 4 ) * 32 );
        x = ( index % 4 ) * 32;
        piece.style.backgroundPosition = "-" + x + "px -" + y + "px";
        piece.classList.add( 'piece' );
        this.puzzle.appendChild( piece );
      }
    }

    this.puzzle.addEventListener( 'click', this );
  };

  _$Puzzle.prototype.handleEvent = function( e ) {
    console.log( e );
    if( "_" == e.target.id.substr(0,1) ) {
      var x = e.target.offsetLeft / 32;
      var y = e.target.offsetTop / 32;
      this.click( x, y, e.target );
    }
  };

  _$Puzzle.prototype.click = function( x, y, target ) {
    var index = y * 4 + x;

    for( var i = 0; i < 4; i++ ) {
      var tx = x + offsets[i][0];
      var ty = y + offsets[i][1];
      if( ( tx < 0 ) || ( tx > 3 ) || ( ty < 0 ) || ( ty > 3 ) ) {
        continue;
      }
      if( 15 == this.model[ ty * 4 + tx ] ) {
        break;
      }
    }

    if( i < 4 ) {
      this.model[ ty * 4 + tx ] = this.model[ index ];
      this.model[ index ] = 15;

      if( target ) {
        target.style.top = ( 32 * ty ) + "px";
        target.style.left = ( 32 * tx ) + "px";
      }
    }
  };

} ) ();