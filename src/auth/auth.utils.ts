import { getUserByUserId } from './auth.model';

const validateToken = async (token: any, userId: string) => {
const user = await getUserByUserId(userId);
if (user && user.token === token) return user;
throw new Error('Token expired!');
};

export { validateToken };