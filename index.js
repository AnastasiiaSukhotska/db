let express=require('express');
let app=express();
let addController=require('./note_controller');
addController(app, __dirname);
app.listen(3000);