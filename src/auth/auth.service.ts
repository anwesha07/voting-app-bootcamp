/* eslint-disable no-underscore-dangle */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
UnauthorisedException,
ConflictException,
} from '../utils/exceptions';

import {
saveNewUser,
getUserByEmail,
getUserByAadhaar,
updateToken,
resetTokenByUserId,
} from './auth.model';

const saltRounds = 10;

const registerUserService = async (
userName: string,
password: string,
email: string,
aadhaar: string
) => {
// check whether email is unique or not
const userByEmail = await getUserByEmail(email);
if (userByEmail) throw new ConflictException('User already exists!');

// check whether aadhaar is unique or not
const userByAadhaar = await getUserByAadhaar(aadhaar);

if (userByAadhaar) throw new ConflictException('User already exists!');

// hash password using bcrypt
const hashedPassword = await bcrypt.hash(password, saltRounds);
const newUser = await saveNewUser({
userName,
password: hashedPassword,
email,
aadhaar,
});

console.log(newUser);
const token = jwt.sign(
{
userId: newUser.id.toString(),
},
process.env.TOKEN_KEY as string,
{
expiresIn: '6h',
},
);

const loggedInUser = await updateToken(newUser.id, token);
return loggedInUser;
};

const loginUserService = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user) throw new UnauthorisedException('Incorrect credentials');
  
  // compare passwords using bcrypt
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    // create token
    const token = jwt.sign(
    {
    userId: user.id.toString(),
    },
    process.env.TOKEN_KEY as string,
    {
    expiresIn: '24h',
    }
    );
    const loggedInUser = await updateToken(user.id, token);
    return loggedInUser;
  }
  throw new UnauthorisedException('incorrect credentials');
};

const logoutUserService = async (userId: number) =>
resetTokenByUserId(userId);


export {
  registerUserService,
  loginUserService,
  logoutUserService,
};
