import db from '../db'
import { ForbiddenException } from '../utils/exceptions';
import CandidateInterface from './candidate.interface';

const saveCandidate = async (candidateDetails: CandidateInterface) => {
  try {
    const query = `
      INSERT INTO candidates (name, email, gender, age)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [candidateDetails.name, candidateDetails.email, candidateDetails.gender, candidateDetails.age];

    const result = await db.one(query, values);

    return result;
  } catch (error) {
    console.error('Error saving new candidate:',error);
    throw error;
  }
};


const getCandidateByEmail = async (email: string) => {
  try {
    // Prepare the SQL statement
    const query = `
      SELECT *
      FROM candidates
      WHERE email = $1;
    `;

    // Execute the query with the username as a parameter
    const result = await db.oneOrNone(query, [email]);

    return result;
  } catch (error) {
    console.error('Error getting candidate by email:', error);
    throw error;
  }
};

const getCandidateByCandidateId = async (candidateId: number) => {
  try {
    // Prepare the SQL statement
    const query = `
      SELECT *
      FROM candidates
      WHERE id = $1;
    `;

    // Execute the query with the username as a parameter
    const result = await db.oneOrNone(query, [candidateId]);

    return result;
  } catch (error) {
    console.error('Error getting user by candidateId:', error);
    throw error;
  }
};


const checkCandidateIdsValidity = async (candidateIds: number[]) => {
  try {
    const candidateIdString = candidateIds.join(',');

    const query = `
      SELECT COUNT(*) as count
      FROM candidates
      WHERE id IN (${candidateIdString})
    `;

    const result = await db.one(query);
    const count = parseInt(result.count);

    return count === candidateIds.length;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export {
  saveCandidate,
  getCandidateByEmail,
  getCandidateByCandidateId,
  checkCandidateIdsValidity,
};
