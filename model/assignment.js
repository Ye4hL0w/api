let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var agregatePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentSchema = Schema({
    id: Number,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean
});

AssignmentSchema.plugin(agregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
