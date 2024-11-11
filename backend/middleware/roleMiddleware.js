const Role = require('../models/Role');

const authorizeRole = (requiredPermissions) => {
    return async (req, res, next) => {
        const role = await Role.findById(req.user.roleId); // Check the user's role
        if (!role) return res.status(403).json({ message: 'Role not found' });

        const hasPermission = requiredPermissions.every((perm) =>
            role.permissions.includes(perm)
        );

        if (!hasPermission) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = authorizeRole;
