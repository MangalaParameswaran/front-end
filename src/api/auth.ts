import axios from "axios";
const API_URL = "http://localhost:3000";
import { createUser, loginUser } from './../interfaces/user';

export const register = async(data: createUser) => {
      try {
            const response = await axios.post(`${API_URL}/auth/register`, data);
            return response;
      } catch (error) {
            console.log('err----', error)
            throw new Error("Register failed")
      }
}

export const login = async(data: loginUser) => {
      try {
           const response = await axios.post(`${API_URL}/auth/login`, data);
           return response; 
      } catch (error) {
            console.log('err---', error);
            throw new Error('Login failed')
            
      }
}
