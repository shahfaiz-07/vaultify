export interface ApiResponse<T> {
    message: string;
    data?: T;
    success: boolean;
    errors?: string[];
}