import HttpException from './HttpException';

class InternalServerErrorException extends HttpException {
constructor(message: string) {
super(500, message);
}
}
export default InternalServerErrorException;