// models.js

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/' + 'test');

console.log('cargando models ###');

module.exports = mongoose;
