import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '../utils/exceptions';
import {
  getCandidateByEmail,
  saveCandidate,
  getCandidateByCandidateId,
} from './candidate.model';

const createNewCandidate = async (user: any, name: string, email: string, age: number, gender: string) => {
  // check whether creator is admin
  if (!user.isadmin) {
    throw new ForbiddenException('Not allowed to register candidates');
  }
  // verify candidate does not exist already
  const candidate = await getCandidateByEmail(email);
  console.log(candidate);
  if (candidate) throw new ConflictException('Candidate already exists!');

  // create new candidate entry
  const newCandidate = await saveCandidate({
    name,
    email,
    age,
    gender,
  });
  return newCandidate;
};

const getCandidate = async (candidateId: number) => {
  const candidate = await getCandidateByCandidateId(candidateId);
  if (!candidate) {
    console.log(candidate);
    throw new NotFoundException('Candidate credentials do not match!');
  }
  return candidate;
};

export { createNewCandidate, getCandidate };
