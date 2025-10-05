import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcrypt';

export default async function seedUsers() {
    const existingAdmin = await userRepository.findByEmail('admin@example.com');
    if (!existingAdmin) {
        const adminRole = await roleRepository.findByName('admin');
        if (!adminRole) {
            console.log('Error: Rol admin no encontrado');
            return;
        }

        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        
        await userRepository.create({
            name: 'Administrador',
            lastName: 'Sistema',
            email: 'admin@example.com',
            password: hashedPassword,
            phoneNumber: '999999999',
            birthdate: new Date('1990-01-01'),
            roles: [adminRole._id]
        });

        console.log('Usuario admin creado: admin@example.com / Admin123!');
    } else {
        console.log('Usuario admin ya existe');
    }
}

