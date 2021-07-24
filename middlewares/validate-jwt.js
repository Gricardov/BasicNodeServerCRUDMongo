const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);

        // Verifico si existe
        if (!user) {
            return res.status(401).json({ msg: 'Usuario no existe' });
        }

        // Verificar si el estado es true
        if (!user.status) {
            return res.status(401).json({ msg: 'Usuario eliminado' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'Token no válido' });
    }
}

module.exports = {
    validateJWT
}