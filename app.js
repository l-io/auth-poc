import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = [];
const userLogged = null;

const app = express();

app
    .use(express.static('public'))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())

    .post('/profile', async (req, res) => {

        console.log(users);
        var email = req.body.email;
        var password = req.body.password;
        
        const user = users.find( user => {
            return user.email === email;
        });

        if ( user == null){
            return;
        }
        try {
            if (await bcrypt.compare(password, user.password)){
                return res.redirect(`/profile/?email=${user.email}&name=${user.name}`);
                userLogged = user;
            }
        } catch { return; }
    })

    .get('/signup', (req, res) => {
        console.log(req);
        res.sendFile('public/signUp.html', { root: __dirname });
    })

    .get('/profile', (req, res) => {
        res.sendFile('public/profile.html', { root: __dirname });
    })

    .get('/', (req, res) => {
        userLogged = null;
        res.sendFile('public/index.html', { root: __dirname})
    })

    .post('/', async (req, res) => {

        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            var user = {
                email: req.body.email,
                name: req.body.name,
                password: hashedPassword
            };
            users.push(user);
            console.log(users);
        } catch {
            res.status(500).send();
        }
        return res.redirect('/');
    })

    .listen(3000);
