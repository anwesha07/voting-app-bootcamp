import HttpException from './HttpException';

class UnauthorisedException extends HttpException {
constructor(message: string) {
super(401, message);
}
}
export default UnauthorisedException;