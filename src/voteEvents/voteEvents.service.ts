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
  // voteCandidate,
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

// const voteCandidateService = async (candidateId: string, userId: string, eventId: string) => {
//   // check whether eventId is valid
//   const voteEvent = await getVoteEventById(eventId);
//   if (!voteEvent) throw new NotFoundException('Vote Event Id is invalid');

//   // check whether the voting event is active
//   const today = new Date().getTime();
//   if (voteEvent.startDate > today || voteEvent.endDate < today) {
//     throw new ForbiddenException('Voting for this event is not active');
//   }

//   // check whether the user has casted a vote
//   if (voteEvent.votedBy.includes(userId)) {
//     throw new ForbiddenException('Vote has already been cast by the user');
//   }

//   // check whether the candidate id is valid
//   const candidateExists = voteEvent.candidates.find(
//     (candidate: any) => candidate._id.toString() === candidateId
//   );
//   if (!candidateExists) {
//     throw new BadRequestException('Invalid candidate');
//   }

//   // add the vote
//   await voteCandidate(userId, candidateId, eventId);
// };

export {
  getVoteEventsService,
  createVoteEventService,
  getVoteEventByIdService,
  // voteCandidateService,
};
