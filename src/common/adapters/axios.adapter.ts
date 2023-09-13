import { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

export class AxiosAdapter implements HttpAdapter{
    private  axios:AxiosInstance;

    async get<T>(url): Promise<T> {
        try {
            const{data}=await this.axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }
}