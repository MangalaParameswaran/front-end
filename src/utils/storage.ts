export const setAuth = (token: string, userId: string, plan_price: number) => {
  sessionStorage.setItem("authToken", token);
  sessionStorage.setItem("userId", userId);
  sessionStorage.setItem('plan_price', plan_price.toString())
};

export const getAuth = () => {
  return {
    token: sessionStorage.getItem("authToken"),
    userId: sessionStorage.getItem("userId"),
  };
};

export const clearAuth = () => {
  sessionStorage.clear();
};
