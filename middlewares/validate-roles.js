const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAdmin = async (req, res, next) => {

    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin verificar el token primero'
        })
    }

    const { role } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: 'El usuario no es administrador'
        });
    }

    next();
}

const hasRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin verificar el token primero'
        })
    }

    if (!roles.includes(req.user.role)) {
        return res.status(401).json({
            msg: `El servicio requiere uno de estos roles ${roles}`
        })
    }

    next();
}

module.exports = {
    isAdmin,
    hasRole
}