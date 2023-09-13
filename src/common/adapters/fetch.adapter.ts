import { HttpAdapter } from "../interfaces/http-adapter.interface";

export class FetchAdapter implements HttpAdapter{
    async get<T>(url):Promise<T> {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}