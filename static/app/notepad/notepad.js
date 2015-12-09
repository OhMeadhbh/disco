( function () {
  var default_pages = [ "Welcome to the notepad.\n\nJust start typing notes here and if your browser supports HTML5 localStorage, they'll persist between browser sessions.\n\nPress the 'new page' icon in the lower left to create a new page. Ctrl-Up and Ctrl-Down move between pages." ];

  _$construct( '_$NotePad', {} )
  _$NotePad.prototype._$init = function () {
    var item = localStorage["_$NotePad_contents"];
    this.pages = item?JSON.parse(item):default_pages;
    item = localStorage["_$NotePad_page"];
    this.currentPage = 1 * (item?item:"0");
  };
  _$NotePad.prototype.message = function( msg ) {
    if( ( ! msg ) || ( ! msg.type ) ) {
      return console.log( "_$NotePad app received invalid message" );
    }
    switch( msg.type ) {
    case 'launch':
      this.launch();
    }
  };
  _$NotePad.prototype.launch = function () {
    if( _$NotePad.window ) {
      return _$NotePad.window.select();
    }
    _$Endpoint.get( 'app/notepad/notepad.html', function( err, data ) {
      if( err ) {
        console.log( "Error: " + err.toString() );
        return;
      } 
      if( ! data ) {
        console.log( "Error: No Data Received" );
        return;
      }
      var current = new _$Window( { overflow: 'hidden', resize: 'none', title: "Note Pad", app: '_$NotePad',
                                    visual: 'accessory', height: 233, width: 233} );
      _$NotePad.window = current;
      current.content = data.replace( new RegExp( '%id%', 'g' ), current.id );
      current._deschedule = function () { delete _$NotePad.window; }
      current.schedule();
      this.el = current.el.querySelector( '.contents' );
      this.corner = current.el.querySelector( '.corner' );
      this.page = current.el.querySelector( '.page' );
      this.post_schedule();
      current.select();
    }.bind( this ) );
  };

  _$NotePad.prototype.post_schedule = function () {
    var that = this;

    this.corner.addEventListener( 'click', function( e ) {
      that.save();
      if( "" != that.pages[ that.pages.length - 1 ] ) {
        that.pages.push( "" );
      }
      that.currentPage = that.pages.length - 1;
      that.renderPage();
      localStorage["_$NotePad_page"] =  that.currentPage;
      e.stopPropagation();
      e.preventDefault();
    } );

    this.el.addEventListener( 'keydown', function ( e ) {

      if( e.ctrlKey == true ) {
        if( 40 == e.keyCode ) {
          e.preventDefault();
          clearTimeout( that.timeout );
          that.save();
          return that.pageDown();
        } else if( 38 == e.keyCode ) {
          e.preventDefault();
          clearTimeout( that.timeout );
          that.save();
          return that.pageUp();
        }
      }

      if( that.timeout ) {
        clearTimeout( that.timeout );
      }

      that.timeout = setTimeout ( function () {
        that.save();
        that.timeout = null;
      }, 2000 );
    } );

    this.renderPage();
  };

  _$NotePad.prototype.pageUp = function () {
    this.currentPage--;
    if( this.currentPage < 0 ) {
      this.currentPage = 0;
    }
    localStorage["_$NotePad_page"] =  this.currentPage;
    this.renderPage();
  };

  _$NotePad.prototype.pageDown = function () {
    this.currentPage++;
    if( ( this.currentPage >= this.pages.length ) && ( 0 == this.pages[ this.pages.length - 1 ].length ) ) {
      this.currentPage = this.pages.length - 1;
    }
    localStorage["_$NotePad_page"] =  this.currentPage;
    this.renderPage();
  };

  _$NotePad.prototype.save = function () {
    this.pages[ this.currentPage ] = this.el.value;
    localStorage["_$NotePad_contents"] = JSON.stringify( this.pages );
  };

  _$NotePad.prototype.renderPage = function () {
    this.page.textContent = ( this.currentPage + 1 );
    this.el.value = this.pages[ this.currentPage ] ? this.pages[ this.currentPage ] : '';
  };

} ) ();