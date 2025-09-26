import { decryptData } from '../utils/common'
import { passKey } from '../api/config'

export const setAuth = async (accessToken: string, refreshToken: string, userData: string,) => {
  const decryptObj = await decryptData(userData, passKey);
  const { userId, plan_price, subscribed } = decryptObj;

  sessionStorage.setItem("accessToken", accessToken);
  sessionStorage.setItem("refreshToken", refreshToken);
  sessionStorage.setItem("userId", userId);
  sessionStorage.setItem('plan_price', plan_price.toString());
  sessionStorage.setItem('subscribed', subscribed);
  sessionStorage.setItem('userData', userData);
};

export const getAuth = () => {
  return {
    token: sessionStorage.getItem("accessToken"),
    userId: sessionStorage.getItem("userId"),
  };
};

export const clearAuth = () => {
  sessionStorage.clear();
};
