import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        email: '',
        roles: [],
        permissions: {},
    });

    const transformPermissions = (permissionsArray) => {
        const permissionsObject = {};

        // Check if permissionsArray is an array before using .forEach
        if (Array.isArray(permissionsArray)) {
            permissionsArray.forEach((permission) => {
                const [menu, action] = permission.split(':');
                if (!permissionsObject[menu]) {
                    permissionsObject[menu] = {};
                }
                permissionsObject[menu][action] = true;
            });
        } else {
            console.warn("Permissions are not an array:", permissionsArray);
        }

        return permissionsObject;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            console.log("Decoded Token:", decoded);

            // Check if decoded.permissions is an array before using transformPermissions
            const permissions = Array.isArray(decoded.permissions) ? transformPermissions(decoded.permissions) : {};
            
            setUser({
                email: decoded.email,  // Ensure email is set from token
                permissions: permissions,
                roles: decoded.roles || [],  // Ensure roles are also updated
            });
        }
    }, []); // The empty dependency array ensures this runs once when the component mounts

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
