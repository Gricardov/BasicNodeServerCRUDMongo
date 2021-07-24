const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async (role = "") => {
    const existsRole = await Role.findOne({ role });
    if (!existsRole) {
        throw new Error(`El rol ${role} no es válido`);
    }
};

const existsEmail = async (email = "") => {
    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
        throw new Error(`El email ${email} ya está registrado`);
    }
}

const existsUserBydId = async (id = "") => {
    const existsUser = await User.findById(id);
    if (!existsUser) {
        throw new Error(`El usuario ${id} no existe`);
    }
}

module.exports = {
    isValidRole,
    existsEmail,
    existsUserBydId
}