import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

app.get('/', (req, res) => res.redirect('/signIn'));
app.get('/signIn', (req, res) => res.render('signIn'));
app.get('/signUp', (req, res) => res.render('signUp'));
app.get('/profile', (req, res) => res.render('profile'));
app.get('/dashboard', (req, res) => res.render('dashboard_user'));
app.get('/admin', (req, res) => res.render('dashboard_admin'));
app.get('/403', (req, res) => res.render('403'));

app.use((req, res) => res.render('404'));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then(async () => {
        console.log('Mongo conectado');
        await seedRoles();
        await seedUsers();
        app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error conectando a Mongo:', err);
        process.exit(1);
    });
