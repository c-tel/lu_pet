var fs = require('fs');
var ejs = require('ejs');

exports.Lessons_Map = ejs.compile(fs.readFileSync('./Frontend/templates/Lessons_Map.ejs', "utf8"));

exports.PetCard = ejs.compile(fs.readFileSync('./Frontend/templates/PetCard.ejs', "utf8"));

exports.Dictionary_Lesson = ejs.compile(fs.readFileSync('./Frontend/templates/Dictionary_Lesson.ejs', "utf8"));
exports.Grammar_Test = ejs.compile(fs.readFileSync('./Frontend/templates/Grammar_Test.ejs', "utf8"));
exports.Dictionary_Test = ejs.compile(fs.readFileSync('./Frontend/templates/Dictionary_Test.ejs', "utf8"));
exports.Info = ejs.compile(fs.readFileSync('./Frontend/templates/DayWork.ejs', "utf8"));