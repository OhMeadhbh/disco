// collectable.js

_private.collectable = {
  init_collectable: function () {
    this.id = this.id ? this.id : this.constructor.id++;
    this.constructor.collection[ this.id ] = this;
  }
};
