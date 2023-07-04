import mongoose, { Schema, ObjectId, FlattenMaps } from 'mongoose';
import CandidateInterface from '../candidate/candidate.interface';

const voteEventSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 30,
    unique: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  candidates: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
      },
    ],
    required: true,
  },
  votedBy: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  votes: {
    type: Map,
    of: Number,
    default: 0,
    max: 1,
  },
});

const VoteEvents = mongoose.model('VoteEvents', voteEventSchema);

const saveNewVoteEvent = async (eventDetails: {
  name: string,
  startDate: Date,
  endDate: Date,
  candidates: CandidateInterface[],
  votedBy?: ObjectId[],
  votes: { [key: string]: number },
}) => {
  const newEvent = new VoteEvents(eventDetails);
  return newEvent.save();
};

const getActiveVoteEvents = async (
  currentDate: Number,
  userId: string
) => {
  const currentEvents = VoteEvents.find(
    {
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      votedBy: { $ne: userId },
    },
    '_id name startDate endDate'
  );
  return currentEvents;
};

const getVoteEventByName = async (name: string) =>
  VoteEvents.findOne({ name });

const getVoteEventById = async (eventId: string) =>
  VoteEvents.findById(eventId, { votes: 0, __v: 0 }).populate('candidates');

const voteCandidate = async (
  userId: string,
  candidateId: string,
  voteEventId: string
) =>
  VoteEvents.findOneAndUpdate(
    { _id: voteEventId },
    { $inc: { [`votes.${candidateId}`]: 1 }, $push: { votedBy: userId } },
    { new: true }
  );

export {
  saveNewVoteEvent,
  getActiveVoteEvents,
  getVoteEventByName,
  getVoteEventById,
  voteCandidate,
};
