import db from '../db';
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
    // const query = `
      
    // `;

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


// const voteCandidate = async (
//   userId: string,
//   candidateId: string,
//   voteEventId: string
// ) =>
//   VoteEvents.findOneAndUpdate(
//     { _id: voteEventId },
//     { $inc: { [`votes.${candidateId}`]: 1 }, $push: { votedBy: userId } },
//     { new: true }
//   );

export {
  saveNewVoteEvent,
  getActiveVoteEvents,
  getVoteEventByName,
  getVoteEventById,
  saveVoteEventCandidates
  // voteCandidate,
};
