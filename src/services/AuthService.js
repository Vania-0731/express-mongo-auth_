import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import { validatePassword, validateEmail } from '../utils/helpers.js';

class AuthService {
    async signUp({ email, password, name, lastName, phoneNumber, birthdate, roles = ['user'] }) {
        if (!validateEmail(email)) {
            const err = new Error('Email inválido');
            err.status = 400;
            throw err;
        }

        if (!validatePassword(password)) {
            const err = new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial (# $ % & * @)');
            err.status = 400;
            throw err;
        }

        const existing = await userRepository.findByEmail(email);
        if (existing) {
            const err = new Error('Email ya en uso');
            err.status = 400;
            throw err;
        }

        const hashed = await bcrypt.hash(password, 10);

        const roleDocs = [];
        for (const r of roles) {
            let roleDoc = await roleRepository.findByName(r);
            if (!roleDoc) roleDoc = await roleRepository.create({ name: r });
            roleDocs.push(roleDoc._id);
        }

        const user = await userRepository.create({ 
            email, password: hashed, name, lastName, phoneNumber, birthdate, roles: roleDocs 
        });

        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName
        };
    }

    async signIn({ email, password }) {
        if (!validateEmail(email)) {
            const err = new Error('Email inválido');
            err.status = 400;
            throw err;
        }

        const user = await userRepository.findByEmail(email);
        if (!user) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const token = jwt.sign({ 
            sub: user._id, 
            roles: user.roles.map(r => r.name) 
        }, process.env.JWT_SECRET, { 
            expiresIn: '1h' 
        });

        return { token };
    }
}

export default new AuthService();
