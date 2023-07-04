import { checkCandidateIdsValidity } from '../candidate/candidate.model';
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
  saveVoteEventCandidates,
  hasUserVoted,
  voteCandidate,
} from './voteEvents.model';

const getVoteEventsService = async (userId: number) => {
  const currentDate = new Date();
  return getActiveVoteEvents(currentDate, userId);
};

const createVoteEventService = async (
  name: string,
  startDate: Date,
  endDate: Date,
  candidates: number[]
) => {
  // check whether a voting event with the same name already exists
  const votingEvent = await getVoteEventByName(name);
  if (votingEvent) throw new ConflictException('Voting event already exists!');

  // check candidates are valid 
  if (!await checkCandidateIdsValidity(candidates)) throw new BadRequestException('Candidates are not valid!');

  // create a new voting event
  const voteEvent = await saveNewVoteEvent({
    name,
    startDate,
    endDate,
  });

  // save the candidates of the event
  const voteEventId = voteEvent.id;
  const eventCandidates = await saveVoteEventCandidates(voteEventId, candidates);

  return {...voteEvent, candidates: eventCandidates}
};

const getVoteEventByIdService = async (eventId: number) => {
  const voteEvent = await getVoteEventById(eventId);
  if (!voteEvent) throw new NotFoundException('Vote event does not exist!');

  return voteEvent;
};

const voteCandidateService = async (candidateId: number, userId: number, eventId: number) => {
  // check whether eventId is valid
  const voteEvent = await getVoteEventById(eventId);
  if (!voteEvent) throw new NotFoundException('Vote Event Id is invalid');

  // check whether the voting event is active
  const today = new Date().getTime();
  if (new Date(voteEvent.startDate).getTime() > today || new Date(voteEvent.endDate).getTime() < today) {
    throw new ForbiddenException('Voting for this event is not active');
  }

  // check whether the user has casted a vote
  if(await hasUserVoted(userId, eventId)) throw new ForbiddenException('User has already voted!');

  // check whether the candidate id is valid
  const candidateExists = voteEvent.candidates.find(
    (candidate: any) => candidate.id === candidateId
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
