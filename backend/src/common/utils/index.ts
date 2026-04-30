export interface SuccessResponse<T> {
  data: T;
  statusCode: number;
  message?: string;
}

export const handleResponse = <T>(
  data: T,
  statusCode: number = 200,
  message: string = 'Success',
): SuccessResponse<T> => {
  return {
    statusCode,
    message,
    data,
  };
};
