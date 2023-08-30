import { createContext, useContext, useEffect, useState } from "react";
import axios from '../api/axios.js';
import { useAuth } from "./AuthContext.js";
import Cookies from 'js-cookie';

export const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within an AuthProvider");
    }
    return context;
}

export const AdminProvider = ({ children }) => {

    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState([]);
    const [user, setUser] = useState([]);

    const {setIsAuthenticated} = useAuth();

    // ===== ADMIN GET user ===== //
    const adminGetUser = async (userId) => {
        try {
            const response = await axios.get(`/users/find/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    // ===== ADMIN UPDATE user ===== //
    const adminUpdateUser = async (userId, data) => {
        try {
            const response = await axios.put(`/users/adminUpdate/${userId}`, data);
            setSuccess(Object.values(response.data));
        } catch (error) {
            setErrors(Object.values(error.response.data));
        }
    }

    // ===== ADMIN DELETE user ===== //
    const adminDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`/users/${userId}`);
            console.log(response.data);
            // We update allUsers state so the user we deleted doesn't show up anymore.
            getAllUsers();
        } catch (error) {
            console.log(error);
        }
    }

    // ===== GET ALL USERS ===== //
    const [allUsers, setAllUsers] = useState([]);
    const getAllUsers = async () => {
        try {
            const response = await axios.get('/users/');
            setAllUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    // ========== FUNCTION TO CREATE A PRODUCT ========== //
    const createProduct = async (data) => {
        try {
            console.log(data);
            const response = await axios.post(`/products`, data);
            setSuccess(Object.values(response.data.message));
            console.log(response.data.newProduct);
        } catch (error) {
            console.log(error);
            setErrors(Object.values(error.response.data));
        }
    }

    // ========== FUNCTION TO MODIIFY A PRODUCT ========== //
    const updateProduct = async (productId, data) => {
        try {
            const response = await axios.put(`/products/${productId}`, data);
            console.log(response.data);
            setSuccess(Object.values(response.data.message));
        } catch (error) {
            console.log(error);
            setErrors(Object.values(error.response.data));
        }
    }

    // ========== FUNCTION TO DELETE A PRODUCT ========== //
    const deleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`/products/${productId}`);
            setSuccess(Object.values(response.data));
        } catch (error) {
            console.log(error);
            setErrors(Object.values(error.response.data));
        }
    }

    // Timeout so the messages don't stay on screen undefinetly. 5000 ms = 5 sec.
    useEffect(() => {
        if (errors.length > 0 || success) {
            const timer = setTimeout(() => {
                setErrors([]);
                setSuccess(undefined);
            }, 5000)
            return () => clearTimeout(timer);
        }
    }, [errors, success])

    return (
        <AdminContext.Provider value={{
            adminGetUser,
            adminUpdateUser,
            adminDeleteUser,
            getAllUsers,

            createProduct,
            updateProduct,
            deleteProduct,

            user,
            setUser,
            allUsers,
            errors,
            success
        }}>
            {children}
        </AdminContext.Provider>
    )
};