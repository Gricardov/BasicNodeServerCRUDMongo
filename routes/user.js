const { Router } = require('express');
const { check } = require('express-validator');

// Controladores
const { userGet, userPut, userPost, userDelete } = require('../controllers/user');

// Validadores db
const { isValidRole, existsEmail, existsUserBydId } = require('../helpers/db-validators');

// Validadores de entrada
// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { isAdmin, hasRole } = require('../middlewares/validate-roles');
const { validateFields, validateJWT, isAdmin, hasRole } = require('../middlewares');

const router = Router();

router.get('/', userGet);
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existsUserBydId),
    check('role').custom(isValidRole),
    validateFields
], userPut);
router.post('/', [
    check('email', 'El correo no es válido').isEmail(), // Envía los errores al req
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 letras').isLength({ min: 6 }),
    check('email').custom(existsEmail),
    //check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isValidRole),
    validateFields
], userPost);
router.delete('/:id', [
    validateJWT,
    //isAdmin, // Fuerza que solo sea admin
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existsUserBydId),
    validateFields
], userDelete);

module.exports = router;