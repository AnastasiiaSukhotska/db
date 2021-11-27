let bodyParser=require('body-parser');
let DefaultResponse=require('./dto/default-response');
const pgp=require('pg-promise')();
const db =pgp('postgres://postgres:somePassword@localhost:5432/all_notes');
module.exports=(app, path)=>{
	let controller=new StaticController(path);
	app.post('/add', bodyParser.json(), controller.addNote.bind(controller))
	app.get('/titles', controller.getAllTitles.bind(controller))
	app.get('/', controller.getMainPage.bind(controller))
	
}
class StaticController{
	constructor(path){
		this.path=path;
	}
	getMainPage(req,resp){
		resp.setHeader('Content-Type', 'text/html');
		resp.sendFile(this.path+'/index.html');
	}

	getAllTitles(req,resp){
		resp.setHeader('Content-Type', 'application/json');
		db.any('SELECT * FROM notes')
		.then(notes=>new DefaultResponse('ok', notes))
		.then(r=>r.date)
		.then(r=>resp.send(r));
	}

	addNote(req, resp){
		resp.setHeader('Content-Type', 'application/json');
		let note=req.body;
		console.log(note);
		db.none('INSERT INTO notes (title, content) VALUES (${t}, ${c})',{
			t: note.title,
			c: note.content
		}).then(s=>{
			resp.send(JSON.stringify(new DefaultResponse('ok')));
	}, e=>{
		resp.send(JSON.stringify(new DefaultResponse('error')));
		})
		
		
	}
}
		
		

	















/*

let express=require('express');
let bodyParser=require('body-parser');
let DefaultResponse=require('./dto/default-response');
let app=express();
const pgp=require('pg-promise')();
const db =pgp('postgres://postgres:somePassword@localhost:5432/all_notes');
app.use(bodyParser.json());
app.get('/', (req, resp)=>{
	db.any('SELECT * FROM notes')
	.then(notes=>new DefaultResponse('ok', notes))
	.then(r=>r.date)
	.then(r=>resp.send(r));
});


app.listen(3000);

*/