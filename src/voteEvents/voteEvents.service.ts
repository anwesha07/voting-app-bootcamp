import { getCandidateIdsInArray } from '../candidate/candidate.model';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '../utils/exceptions';
import {
  getActiveVoteEvents,
  getVoteEventByName,
  saveNewVoteEvent,
  getVoteEventById,
  voteCandidate,
} from './voteEvents.model';

const getVoteEventsService = async (userId: string) => {
  const currentDate = new Date().getTime();
  return getActiveVoteEvents(currentDate, userId);
};

const createVoteEventService = async (
  name: string,
  startDate: Date,
  endDate: Date,
  candidates: string[]
) => {
  // check whether a voting event with the same name already exists
  const votingEvent = await getVoteEventByName(name);
  if (votingEvent) throw new ConflictException('Voting event already exists!');

  // create a new voting event
  const candidateIds = await getCandidateIdsInArray(candidates);
  if (candidateIds.length !== candidates.length) {
    throw new BadRequestException('Candidate array has invalid candidates');
  }
  const votes: { [key: string]: number } = {};
  candidateIds.forEach((candidate: any) => {
    votes[candidate._id] = 0;
  });
  console.log(candidateIds[0]._id);
  console.log(typeof(candidateIds[0]._id))
  return saveNewVoteEvent({
    name,
    startDate,
    endDate,
    candidates: candidateIds,
    votes,
  });
};

const getVoteEventByIdService = async (eventId: string, userId: string) => {
  const voteEvent = await getVoteEventById(eventId);
  if (!voteEvent) throw new NotFoundException('Vote event does not exist!');

  // check whether the user has already voted
  const hasVotedUser = voteEvent.votedBy.includes(userId);

  return { ...voteEvent.toObject(), hasVotedUser };
};

const voteCandidateService = async (candidateId: string, userId: string, eventId: string) => {
  // check whether eventId is valid
  const voteEvent = await getVoteEventById(eventId);
  if (!voteEvent) throw new NotFoundException('Vote Event Id is invalid');

  // check whether the voting event is active
  const today = new Date().getTime();
  if (voteEvent.startDate > today || voteEvent.endDate < today) {
    throw new ForbiddenException('Voting for this event is not active');
  }

  // check whether the user has casted a vote
  if (voteEvent.votedBy.includes(userId)) {
    throw new ForbiddenException('Vote has already been cast by the user');
  }

  // check whether the candidate id is valid
  const candidateExists = voteEvent.candidates.find(
    (candidate: any) => candidate._id.toString() === candidateId
  );
  if (!candidateExists) {
    throw new BadRequestException('Invalid candidate');
  }

  // add the vote
  await voteCandidate(userId, candidateId, eventId);
};

export {
  getVoteEventsService,
  createVoteEventService,
  getVoteEventByIdService,
  voteCandidateService,
};
