import 'dotenv/config';

import express, { Router } from 'express';

import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const upload = multer({ dest: 'static/images/items/' });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('static'));
app.use((req, res, next) => { console.log(req.body); next(); });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/account', (req, res) => {
	res.render('test');
});
const r = new Router({ mergeParams: true });
app.post('/account/api/sign-in', upload.none(), (req, res) => {
	console.log(req.body);
	res.end();
});

app.use((err, req, res, next) => {
	console.error(err);
	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(err.message);
});


app.listen(9999);
