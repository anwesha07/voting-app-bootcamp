import { model, Schema } from 'mongoose';
import CandidateInterface from './candidate.interface';


const candidateSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    minlength: 5,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  age: {
    type: Number,
    min: 18,
    max: 60,
    required: true,
  },
});

const CandidateModel = model('Candidate', candidateSchema);

const saveCandidate = async (candidateDetails: CandidateInterface)=> {
  const newCandidate = new CandidateModel(candidateDetails);
  console.log(newCandidate);
  return newCandidate.save();
};

const getCandidateByEmail = async (email: string) =>
  CandidateModel.findOne({ email });

const getCandidateByCandidateId = async (
  candidateId: string
) => CandidateModel.findById(candidateId);

const getCandidateIdsInArray = async (
  candidateArray: string[]
) =>
  CandidateModel.find({ _id: { $in: candidateArray } }, '_id').lean();

export {
  saveCandidate,
  getCandidateByEmail,
  getCandidateByCandidateId,
  getCandidateIdsInArray,
};
