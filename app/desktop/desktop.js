( function () {
  
  _$construct( '_$Desktop', { launched: false } );
  _$Desktop.prototype.message = function( msg ) {
    if( ( ! msg ) || ( ! msg.type ) ) {
      return console.log( "_$Desktop app received invalid message" );
    }
    switch( msg.type ) {
    case 'launch':
      console.log( "_$Desktop received launch message" );
      if( this.launched ) {
        return console.log( "_$Desktop is already launched" );
      }
      this.launched = true;
      this.el = _$.byId( 'root' );

      var menu_items = { items: [
        {
          text: "File",
          items: [
            {
              text: "New Folder",
              key: 'n',
              handler: function () { console.log( "you clicked the new folder thing." ); }
            },
            {
              text: "Open",
              key: 'o'
            },
            {
              text: "Close Window",
              key: 'w'
            },
            {
              separator: true
            },
            {
              text: "Get Info",
              key: 'i'
            }
          ]
        },
        {
          text: "Edit",
          items: [
            {
              text: "Cut",
              key: 'x'
            },
            {
              text: "Copy",
              key: 'c'
            },
            {
              text: "Paste",
              key: 'v'
            },
            {
              text: "Clear"
            },
            {
              text: "Select All",
              key: 'a'
            },
            {
              separator: true
            },            
            {
              text: "Show Clipboard"
            }
          ]
        },
        {
          text: "View",
          items: [
            {
              text: "By Small Icon"
            },
            {
              text: "By Icon"
            },
            {
              text: "By Name"
            },
            {
              text: "By Size"
            },
            {
              text: "By Kind"
            },
            {
              text: "By Date"
            }
          ]
        },
        {
          text: "Special",
          items: [
            {
              text: "Clean Up Desktop"
            },
            {
              text: "Empty Trash"
            },
            {
              separator: true
            },            
            {
              text: "Unmount File"
            }
          ]
        }
      ] };

      this.menu = new _$MenuBar( menu_items );
      _$MenuBar.render( this.menu );
    }
  };
} ) ();