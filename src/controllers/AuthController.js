import authService from '../services/AuthService.js';

class AuthController {
    async signUp(req, res, next) {
        try {
            const { email, password, name, lastName, phoneNumber, birthdate } = req.body;
            if (!email || !password) 
                return res.status(400).json({ message: 'Email y password requeridos' });
            
            const user = await authService.signUp({ email, password, name, lastName, phoneNumber, birthdate });
            return res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) 
                return res.status(400).json({ message: 'Email y password requeridos' });
            
            const token = await authService.signIn({ email, password });
            return res.status(200).json(token);
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
