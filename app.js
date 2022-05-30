import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = [];

const app = express();

app
    .use(express.static('public'))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())

    .post('/profile', (req, res) => {

        console.log(users);
        var email = req.body.email;
        var password = req.body.password;
        
        var user = users.find( user => {
            return user.email === email;
        });

        if (user !== undefined && user.password === password){
            return res.redirect(`/profile/?email=${user.email}&name=${user.name}`);

        }
    })

    .get('/signup', (req, res) => {
        console.log(req);
        res.sendFile('public/signUp.html', { root: __dirname });
    })

    .get('/profile', (req, res) => {
        res.sendFile('public/profile.html', { root: __dirname });
    })

    .post('/', (req, res) => {
        var user = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        };
        users.push(user);
        console.log(users);
        return res.redirect('/');
    })

    .listen(3000);
