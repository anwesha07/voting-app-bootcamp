import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    min: 3,
    max: 30,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  email: {
    type: String,
    min: 5,
    required: true,
    unique: true,
  },
  aadhaar: {
    type: String,
    minlength: 12,
    maxlength: 12,
    required: true,
    validate: {
      validator(value: string) {
        return /^[0-9]+$/.test(value);
      },
      message: 'Field should contain exactly 12 digits',
    },
    unique: true,
  },
  token: {
    type: String,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', userSchema);

const saveNewUser = async (userDetails: {
  userName: string,
  password: string,
  email: string,
  aadhaar: string,
  token?: string,
  isAdmin?: boolean,
}) => {
  const newUser = new User(userDetails);
  return newUser.save();
};

const getUserByUserName = async (userName: string) => User.findOne({ userName });
const getUserByEmail = async (email: string) => User.findOne({ email });
const getUserByAadhaar = async (aadhaar: string) => User.findOne({ aadhaar });

const getUserByUserId = async (userId: string) => User.findById(userId);

const updateToken = (id: mongoose.Types.ObjectId, token: string) =>
  User.findByIdAndUpdate(id, { token }, { new: true });

const resetTokenByUserId = (id: string) =>
  User.findByIdAndUpdate(id, { token: null }, { new: true });

export {
  saveNewUser,
  getUserByUserName,
  getUserByEmail,
  getUserByAadhaar,
  updateToken,
  getUserByUserId,
  resetTokenByUserId,
};
