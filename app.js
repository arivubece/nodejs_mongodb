const express = require('express');
const app = express();
const bodyparser =require('body-parser');
const exhbs = require('express-handlebars');
const fileupload = require('express-fileupload');
const dbo = require('./db');
const ObjectID = dbo.ObjectID;
const root_path = __dirname;

app.engine('hbs', exhbs.engine({layoutsDir:'views/', defaultLayout:'main',extname:'hbs'}));
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(bodyparser.urlencoded({extended: true}));
app.use(fileupload());
app.use(express.static("uploads"));

app.get('/', async(req,res)=> {
    let database = await dbo.getDataBase();
    const collection = database.collection('details');
    const cursor = collection.find({});
    let userlist = await cursor.toArray();
    let edit_user;
    let edit_id;

    if(req.query.delete) {
        await collection.deleteOne({_id: new ObjectID(req.query.delete)})
        return res.redirect('/?response=3');
    }

    if(req.query.edit) {
        edit_id = req.query.edit;
        edit_user = await collection.findOne({_id: new ObjectID(edit_id)})
    }

    let msg;
    if(req.query.response == 1) {
        msg = "Insert Successfully";
    } else if(req.query.response == 2) {
        msg = "Update Successfully";
    } else if(req.query.response == 3) {
        msg = "Delete Successfully";
    }    
    
    res.render('main', {msg, userlist, edit_user, edit_id, root_path})
});

app.post('/add_user', async(req, res)=> {
    let database = await dbo.getDataBase();
    const collection = database.collection('details');

    let user;
    if(req.files) {
        const input_image = req.files.photo;
        const photo_path = input_image.name;
        input_image.mv('uploads/'+photo_path);
        user = {name: req.body.user_name, age: req.body.user_age, photo_path: photo_path}
    } else {
        user = {name: req.body.user_name, age: req.body.user_age}
    }

    await collection.insertOne(user);
    return res.redirect('/?response=1')
});

app.post('/edit_user', async(req, res)=> {
    let database = await dbo.getDataBase();
    const collection = database.collection('details');

    let user;
    if(req.files) {
        const input_image = req.files.photo;
        const photo_path = input_image.name;
        input_image.mv('uploads/'+photo_path);
        user = {name: req.body.user_name, age: req.body.user_age, photo_path: photo_path}
    } else {
        user = {name: req.body.user_name, age: req.body.user_age}
    }
    
    await collection.updateOne({_id: new ObjectID(req.body.user_id) }, {$set:user});
    return res.redirect('/?response=2')
});

app.listen(8000, ()=>console.log("running"));