( function () {
  function populate ( from, keys ) {
    if( keys ) {
      for( var i = 0, il = keys.length; i < il; i++ ) {
        this[ keys[ i ] ] = from[ keys[ i ] ];
        delete[ keys[i] ];
      }
    } else {
      for( var i in from ) { this[i] = from[i]; delete from[i]; }        
    }
  }

  function ready ( _f ) {
    document.addEventListener( 'DOMContentLoaded', _f);
  }

  function byId( id, element ) {
    element || ( element = document );
    return element.getElementById( id );
  }

  function qsa( id, element ) {
    element || ( element = document );
    return element.querySelectorAll( id );
  }

  function nil () { }

  function _$Error( text, errno, severity, url ) {
    this.text = text;
    this.errno = errno;
    this.severity = severity;
    this.url = url;
    this.success = false;
  }

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
      console.log( output );
      _$.byId( _$Error.container ).innerHTML = output;
    }
  };

  window._$Error = _$Error;

  function _$Endpoint( url, parent, expires ) {
    this.url = url;
    this.parent = parent;
    this.expires = expires;
    _$Endpoint.endpoints[ this.url ] = this;
  }

  _$Endpoint.endpoints = {};

  var dataTypeToContentType = {
    'json': 'application/json',
    'xml': 'application/xml'
  };

  _$Endpoint.query = function( url, method, body, complete, dataType ) {
    var request = new XMLHttpRequest();
    var responseType, responseLength;

    request.onreadystatechange = _rsc;
    request.open( method, url, true );
    if( body ) {
      dataType || ( dataType = 'json' );
      dataTypeToContentType[ dataType ] || ( dataType = 'json' );
      request.setRequestHeader( 'Content-Length', body.length );
      request.setRequestHeader( 'Content-Type', dataTypeToContentType[ dataType ] );
    }
    request.send( body );

    function _rsc( event ) {
      switch( event.target.readyState ) {
      case 2:
        responseType = event.target.getResponseHeader( 'content-type' );
        responseLength = event.target.getResponseHeader( 'content-length' );
        break;
      case 4:
        if( 200 == event.target.status ) {
          if( 'application/xml' == responseType ) {
            complete( null, event.target.responseXML );
          } else if( 'application/json' == responseType ) {
            complete( null, JSON.parse( event.target.response ) );
          } else {
            complete( null, event.target.response );
          }
        } else {
          complete( new Error( event.target.response ) );
        }
      }
    }
  };

  _$Endpoint.get = function( url, complete, dataType ) {
    _$Endpoint.query( url, 'GET', null, complete, dataType );
  };

  _$Endpoint.post = function( url, body, complete, dataType ) {
    _$Endpoint.query( url, 'POST', body, complete, dataType );
  };

  _$Endpoint.put = function( url, body, complete, dataType ) {
    _$Endpoint.query( url, 'PUT', body, complete, dataType );
  };

  _$Endpoint.del = function( url, complete, dataType ) {
    _$Endpoint.query( url, 'DELETE', complete, dataType );
  };

  _$Endpoint.prototype.get = function( complete, dataType ) {
    _$Endpoint.get( this.url, complete, dataType );
  };

  _$Endpoint.prototype.post = function( body, complete, dataType ) {
    _$Endpoint.post( this.url, body, complete, dataType );
  };

  _$Endpoint.prototype.put = function( body, complete, dataType ) {
    _$Endpoint.put( this.url, body, complete, dataType );
  };

  _$Endpoint.prototype.del = function( complete, dataType ) {
    _$Endpoint.del( this.url, complete, dataType );
  };

  window._$Endpoint = _$Endpoint;

  window._$ = {
    populate: populate,
    ready: ready,
    byId: byId,
    qsa: qsa,
    nil: nil
  };
} ) ();
