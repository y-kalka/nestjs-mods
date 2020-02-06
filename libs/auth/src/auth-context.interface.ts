export interface AuthContext<T = any> {
    token: string;
    payload: T;
}
