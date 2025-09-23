import { api } from "./interceptor";
import { deleteWeather } from "../interfaces/weather";

// Get weather
export const getweather = async (country: string) => {
  try {
    const res = await api.get(`/country/${country}`);
    console.log('res-data-----', res.data);
    
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Country Not Found");
  }
};

// Save weather
export const saveWeather = async (data: any) => {
  try {
    const res = await api.post(`/country/save/user/countries`, { ...data });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};

// Get saved weather
export const getSavedWeather = async (userId: string) => {
  try {
    const res = await api.get(`/country/user/countries/${userId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};

// Delete saved weather
export const deleteSavedWeather = async (data: deleteWeather) => {
  try {
    const res = await api.delete(`/country/user/countries`, { data });
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};
