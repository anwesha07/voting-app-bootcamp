// create a base http exception class inheriting the Error class

class HttpException extends Error {
  body: {
    status: string,
    statusCode: number,
    message: string,
  };
  
  constructor(statusCode: number, message: string) {
  super(message);
  this.body = {
  status: 'failure',
  statusCode,
  message,
  };
  }
}
  
export default HttpException;