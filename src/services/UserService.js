import userRepository from '../repositories/UserRepository.js';
import { calculateAge, formatDate, formatDateShort } from '../utils/helpers.js';

class UserService {
    async getAll() {
        const users = await userRepository.getAll();
        return users.map(user => this.formatUserResponse(user));
    }

    async getById(id) {
        if (!id) {
            const err = new Error('ID de usuario requerido');
            err.status = 400;
            throw err;
        }
        
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return this.formatUserResponse(user);
    }

    async updateById(id, updateData) {
        if (!id) {
            const err = new Error('ID de usuario requerido');
            err.status = 400;
            throw err;
        }
        
        const user = await userRepository.updateById(id, updateData);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return this.formatUserResponse(user);
    }

    formatUserResponse(user) {
        const age = calculateAge(user.birthdate);
        const formattedBirthdate = formatDate(user.birthdate);
        const formattedCreatedAt = formatDate(user.createdAt);
        const formattedUpdatedAt = formatDate(user.updatedAt);
        const formattedCreatedAtShort = formatDateShort(user.createdAt);

        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            birthdateFormatted: formattedBirthdate,
            url_profile: user.url_profile,
            address: user.address,
            roles: user.roles.map(r => r.name),
            age: age,
            ageText: age ? `${age} años` : 'No especificada',
            createdAt: user.createdAt,
            createdAtFormatted: formattedCreatedAt,
            createdAtShort: formattedCreatedAtShort,
            updatedAt: user.updatedAt,
            updatedAtFormatted: formattedUpdatedAt
        };
    }
}

export default new UserService();
