import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
        match: [
            /^(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&*@]).{8,}$/,
            "La contraseña debe tener al menos una mayúscula, un número y un caracter especial (# $ % & * @)"
        ]
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    name: String,
    lastName: {
        type: String,
        required: [true, "El apellido es obligatorio"]
    },
    phoneNumber: {
        type: String,
        required: [true, "El número de teléfono es obligatorio"]
    },
    birthdate: {
        type: Date,
        required: [true, "La fecha de nacimiento es obligatoria"]
    },
    url_profile: String,
    address: String
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
