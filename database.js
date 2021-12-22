const mongoose = require("mongoose");

let password = 'admin';
let databaseName = 'db';

if (process.env.NODE_ENV  === 'test'){
  databaseName = 'testdb'; 
}

mongoose.connect(
  `mongodb+srv://admin:${password}@cluster0.izku0.mongodb.net/${databaseName}?retryWrites=true&w=majority`
);

