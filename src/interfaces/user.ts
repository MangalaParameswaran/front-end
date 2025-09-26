export interface createUser {
    name: string,
    email: string,
    password: string,
    subscription: boolean,
    plan_price: number;
    image?: string, 
}

export interface loginUser {
    email: string,
    password: string
}