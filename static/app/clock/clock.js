( function () {
  _$construct( '_$Clock', {} )
  _$Clock.prototype.message = function( msg ) {
    if( ( ! msg ) || ( ! msg.type ) ) {
      return console.log( "_$Clock app received invalid message" );
    }
    switch( msg.type ) {
    case 'launch':
      this.launch();
    }
  };
  _$Clock.prototype.launch = function () {
    if( _$Clock.window ) {
      return _$Clock.window.select();
    }
    _$Endpoint.get( '/app/clock/clock.html', function( err, data ) {
      if( err ) {
        console.log( "Error: " + err.toString() );
        return;
      } 
      if( ! data ) {
        console.log( "Error: No Data Received" );
        return;
      }
      var current = new _$Window( { overflow: 'hidden', resize: 'none', title: "Clock", app: '_$Clock',
                                    visual: 'accessory', height: 52, width: 150} );
      _$Clock.window = current;
      current.content = data.replace( new RegExp( '%id%', 'g' ), current.id );
      current._deschedule = function () { delete _$Clock.window; }
      current.schedule();
      current.select();
      this.container = current.el.querySelector( ".container" );
      this.clock = this.container.querySelector( ".clock" );
      this.date = this.container.querySelector( ".date" );
      this.time_interval = setInterval( function () {
        this.clock.innerHTML = (new Date()).toTimeString().substr(0,8);
        this.date.innerHTML = (new Date()).toDateString();
      }.bind( this ), 1000 );
    } );
  };
} ) ();