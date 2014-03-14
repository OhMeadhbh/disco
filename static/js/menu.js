// menu.js

_$construct( '_$Dropdown', { id: 'menubar_dropdown' } );
_$Dropdown.prototype._$mixin( _private.positionable );
_$Dropdown.prefix = "dropdown";

_$construct( '_$MenuBar', { items: [] } );
_$MenuBar.prototype._$mixin( _private.collectable );
_$MenuBar.hide = function () {
  var item = _$.byId( 'dropdown_menubar' );
  item && _$.byId('root').removeChild( item );
};
_$MenuBar._render = function ( holder, menubar ) {
  _$MenuBar.last = -1;
  _$MenuBar.hide();
  _$MenuBar.menubars[ holder ] = menubar;
  _$MenuBar.els[ holder ].innerHTML = menubar.items._$fold( function( base, e, i ) {
    return base + '<li id="' + [ 'menubar', menubar.id, i ].join( "_" ) + '"><a>' +
      ( e.img ? ('<img src="' + e.img + '">') : ( e.text ? e.text : '' ) ) + '</a></li>';
  }.bind( this ), "" );
  menubar.items._$each( function( e, i ) {
    var id = [ menubar.id, i ].join("_");
    var item = _$.byId( [ 'menubar', id ].join( "_" ) );
    if( item ) {
      item.onclick = e.handler ? e.handler : function () { _$MenuBar.hide(); menubar.doReveal( i ); };
    }
  }.bind( this ) );
};
_$MenuBar.render = _$MenuBar._render._$partial( 'menuapp' );
_$MenuBar.prototype._$init = function () {
  this.init_collectable();
};
_$MenuBar.prototype.doReveal = function( id ) {
  if( ( _$MenuBar.last < 0 ) || ( ( 256 * this.id + id ) != _$MenuBar.last ) ) {
    _$MenuBar.last = 256 * this.id + id;
    this.reveal( id );
  } else  {
    _$MenuBar.last = -1;
  }
};
_$MenuBar.prototype.reveal = function( id ) {
  var left = _$.byId( [ 'menubar', this.id, id ].join( '_' ) ).offsetLeft;
  console.log( "revealing " + [ this.id, id ].join('_') + " at " + [ left, 21 ] );
  var items = this.items[id].items;
  if( items ) {
    var output = "";
    items._$each( function( e, i ) {
      output += '<tr class="drophandle" id="dropdown_' + i + '">';
      if( e.separator ) {
        output += '<td colspan="3"><hr/></td>';
      } else {
        output += '<td class="dropimg">' + (e.img?('<img src="' + e.img + '">'):"&nbsp;") + '</td>' +
          '<td class="droptext">' + (e.text?e.text:"&nbsp;") + '</td>' +
          '<td class="dropkey">' + (e.key?("⌥&nbsp;" + e.key.toUpperCase()):"&nbsp;") + '</td>';
      }
      output += '</tr>';
//      output += '<li class="drophandle" id="dropdown_' + i + '"><a>';
// ⌥
//      if( e.separator ) {
//        output += '<hr/>'
//      } else {
//        if( e.img ) {
//          output += '<img src="' + e.img + '">';
//        }
//        if( e.text ) {
//          output += e.text;
//        }
//        if( e.key ) {
//          output += "&nbsp;⌥" + e.key.toUpperCase();
//        }
//      }
//      output += "</a></li>";
    } );
    var dropdown = new _$Dropdown( { x: left, y: 0, content: output, id: 'menubar', corner: 0 } );
    dropdown.schedule();
    items._$each( function( e, i ) {
      var id = 'dropdown_' + i;
      var item = _$.byId( id );
      if( item ) {
        item.onclick = ( e.handler ?
                         function () { console.log( id ); _$MenuBar.last = -1; _$MenuBar.hide(); e.handler(); } :
                         function () { console.log( id ); _$MenuBar.last = -1; _$MenuBar.hide(); } );
      }
    } );
  }
};
_$MenuBar.collection = {};
_$MenuBar.menubars = {};
_$MenuBar.els = {};
_$MenuBar.id = 0;
_$MenuBar.defaults = {
  'menuleft' : new _$MenuBar( { items: [ { img: '/img/logo.png', items: [
    { text: 'About Discovery...', handler: function () { _$App.launch( '_$IMGViewer', '/img/disco.png' ); } },
    { separator: true },
    { text: 'Clock', img: "/app/clock/icon_16.png", handler: function () { _$App.launch( '_$Clock' ); } },
    { text: 'Calculator', img: "/app/calculator/icon_16.png", handler: function () { _$App.launch( '_$Calculator' ); } },
    { text: 'Note Pad', img: "/app/notepad/icon_16.png", handler: function () { _$App.launch( '_$NotePad' ); } },
    { text: 'Puzzle', img: "/app/puzzle/icon_16.png", handler: function () { _$App.launch( '_$Puzzle' ); } }
  ] } ] } ),
  'menudesktop': new _$MenuBar( { items: [ { img: '/app/desktop/icon_16.png' } ], corner: 1 } ),
  'menuright': new _$MenuBar( { items: [ { img: '/img/help.png', handler: function () { _$App.launch('_$HTMLReader', '/contents/help.html'); } }, { img: '/img/fullscreen.png', handler: _$Window.toggleFullScreen } ] } )
};

_$.ready( function () {
  _$Dropdown.template = _$.byId( 'template_dropdown' ).innerHTML;

  [ 'menuleft', 'menuapp', 'menudesktop', 'menuright' ]._$each( function( e ) {
    _$MenuBar.els[ e ] = _$.byId( e );
    _$MenuBar.defaults[ e ] && _$MenuBar._render( e, _$MenuBar.defaults[ e ] );
  } );

  disco_counter && disco_counter();
} );