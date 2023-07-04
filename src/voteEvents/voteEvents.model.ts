import db from '../db';
import { InternalServerErrorException } from '../utils/exceptions';
interface VoteEventInterface{
  name: string,
  startDate: Date,
  endDate: Date,
}


const saveNewVoteEvent = async (eventDetails: VoteEventInterface) => {
  try {
    // Prepare the SQL statement
    const query = `
      INSERT INTO voting_events (name, startdate, enddate)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    // Execute the query with the user details as parameters
    const result = await db.one(query, [
      eventDetails.name,
      new Date(eventDetails.startDate).toISOString(),
      new Date(eventDetails.endDate).toISOString(),
    ]);

    // save candidate ids in voting_event_candidate array

    return result;
  } catch (error) {
    console.error('Error saving new voting event:', error);
    throw error;
  }
};

const saveVoteEventCandidates = async (
  eventId: number,
  candidateIds: number[]
) => {
  try {
    // Create an array of VotingEventCandidate objects
    const valueList = candidateIds.map(
      (id) => `(${id}, ${eventId})`
    );
    const query = `
      INSERT INTO voting_event_candidates (candidate_id, event_id)
      VALUES
        ${valueList.join(', ')}
      RETURNING *
    `;

    // Execute the query
    return db.any(query);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getVoteEventByName = async (name: string) => {
  try {
    const query = `
      SELECT * FROM voting_events
      WHERE name = $1
    `;

    const result = await db.oneOrNone(query, name);

    return result;
  } catch (error) {
    console.error(`Error fetching vote event by name: ${error}`);
    throw error;
  }
};

const getActiveVoteEvents = async (
  currentDate: Date,
  userId: number
) => {
  try {
    const query = `
      SELECT id, name, startDate, endDate
      FROM voting_events
      WHERE startDate <= $1 AND endDate >= $1
    `;

    const values = [currentDate, userId];

    const result = await db.any(query, values);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const getVoteEventById = async (eventId: number) => {
  try {
    const query1 = `
      SELECT * FROM voting_events WHERE id = $1
    `;
    const query2 = `
      SELECT c.*
      FROM voting_event_candidates vc
      LEFT JOIN candidates c ON vc.candidate_id = c.id
      WHERE vc.event_id = $1
    `;

    const votingEvent = await db.oneOrNone(query1, eventId);
    const candidates = await db.any(query2, eventId);

    return { ...votingEvent, candidates };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const hasUserVoted = async (
  userId: number,
  eventId: number
) => {
  try {
    const query = `
    SELECT * FROM voted_by
    WHERE user_id = ${userId} AND event_id = ${eventId}
  `
  console.log(query)
  const vote = await db.oneOrNone(query);
  console.log({ vote });
  return vote !== null;
  } catch (error) {
    throw new InternalServerErrorException((error as Error).message)
  }
}

const voteCandidate = async (
  userId: number,
  candidateId: number,
  voteEventId: number
) => {
  db.tx(t => {
    // creating a sequence of transaction queries:
    const q1 = t.one(`
      UPDATE voting_event_candidates
      SET vote_count = vote_count + 1
      WHERE candidate_id = $1
      AND event_id = $2
      RETURNING candidate_id
    `, [candidateId, voteEventId]);
    const q2 = t.one(`
      INSERT INTO voted_by (user_id, event_id)
      VALUES ($1, $2)
      RETURNING id
    `, [userId, voteEventId]);

    // returning a promise that determines a successful transaction:
    return t.batch([q1, q2]); // all of the queries are to be resolved;
  })
    .then(data => {
        // success, COMMIT was executed
        console.log(data)
    })
    .catch(error => {
        // failure, ROLLBACK was executed
        throw new InternalServerErrorException(error.message)
    });
};

export {
  saveNewVoteEvent,
  getActiveVoteEvents,
  getVoteEventByName,
  getVoteEventById,
  saveVoteEventCandidates,
  hasUserVoted,
  voteCandidate,
};
