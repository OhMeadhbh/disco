// endpoint.js

_$construct( '_$Endpoint', {url: undefined, parent: undefined, expires: undefined} );
_$Endpoint.prototype._$init = function () {
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