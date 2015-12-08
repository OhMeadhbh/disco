// error.js

_$construct( '_$Error', { success: false, text: undefined, errno: undefined, severity: undefined, url: undefined } );

_$Error.prototype.toString = function() {
  return ( "%" + this.severity + ( this.errno ? "(" + this.errno + ")" : '' ) + '; ' + ( this.text ? this.text : '' ) );
};

_$Error.prototype.toHTML = function() {
  var output = ( this.text ? this.text : '' ) + ( this.errno ? ' (' + this.errno + ')' : '' );
  if( this.url ) {
    output = '<a href="' + this.url + '">' + output + '</a>';
  }
  return output;
};

_$Error.prototype._severity = function ( s ) {
  var i = s ? s : ( this.severity ? this.severity : 'info' );
  return i.substr(0,1).toUpperCase() + i.substr(1);
};

_$Error.prototype.raise = function () {
  if( _$Error.container && _$Error.template ) {
    var interior = this.text;
    this.errno && ( interior += " (" + this.errno + ")" );
    this.severity && ( interior = this.severity + ": " + interior );
    this.url && ( interior = '<a href="' + this.url + '">' + interior + '</a>' );
    var output = _$Error.template.replace( /{severity}/gm, this.severity );
    output = output.replace( /{text}/gm, interior );
    _$.byId( _$Error.container ).innerHTML = output;
  }
};
