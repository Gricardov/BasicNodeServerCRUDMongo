const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });

        // Verificar si el email existe
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - ema'
            });
        }

        // Verifico si está activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - sta'
            });
        }

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - pwd'
            });
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ok' });
    }

}

const googleSignIn = async (req, res) => {
    const { id_token } = req.body;

    try {
        const { email, name, img } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            // Tengo que crearlo
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            };
            user = new User(data);
            await user.save();
        }

        // Si el usuario está activo
        if (!user.status) {
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no válido'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}