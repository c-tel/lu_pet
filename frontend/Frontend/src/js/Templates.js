var fs = require('fs');
var ejs = require('ejs');

exports.Lost = ejs.compile(fs.readFileSync('./Frontend/templates/Lost.ejs', "utf8"));
exports.Card = ejs.compile(fs.readFileSync('./Frontend/templates/Card.ejs', "utf8"));

exports.Dictionary_Lesson = ejs.compile(fs.readFileSync('./Frontend/templates/Dictionary_Lesson.ejs', "utf8"));
