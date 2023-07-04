import db from '../db'
const saveNewUser = async (userDetails: {
  userName: string,
  password: string,
  email: string,
  aadhaar: string,
  token?: string,
  isAdmin?: boolean,
}) => {
  try {
    // Prepare the SQL statement
    const query = `
      INSERT INTO users (username, password, email, aadhaar, token, isadmin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    // Execute the query with the user details as parameters
    const result = await db.one(query, [
      userDetails.userName,
      userDetails.password,
      userDetails.email,
      userDetails.aadhaar,
      userDetails.token || null,
      userDetails.isAdmin || false,
    ]);

    return result;
  } catch (error) {
    console.error('Error saving new user:', error);
    throw error;
  }
};

const getUserByUserId = async (userId: number) => {
  try {
    // Prepare the SQL statement
    const query = `
      SELECT *
      FROM users
      WHERE id = $1;
    `;

    // Execute the query with the username as a parameter
    const result = await db.oneOrNone(query, [userId]);

    return result;
  } catch (error) {
    console.error('Error getting user by userId:', error);
    throw error;
  }
};

const getUserByEmail = async (email: string) => {
  try {
    // Prepare the SQL statement
    const query = `
      SELECT *
      FROM users
      WHERE email = $1;
    `;

    // Execute the query with the username as a parameter
    const result = await db.oneOrNone(query, [email]);

    return result;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

const getUserByAadhaar = async (aadhaar: string) => {
  try {
    // Prepare the SQL statement
    const query = `
      SELECT *
      FROM users
      WHERE aadhaar = $1;
    `;

    // Execute the query with the username as a parameter
    const result = await db.oneOrNone(query, [aadhaar]);

    return result;
  } catch (error) {
    console.error('Error getting user by aadhaar:', error);
    throw error;
  }
};

const updateToken = async (id: number, token: string) => {
  try {
    // Prepare the SQL statement
    const query = `
      UPDATE users
      SET token = $1
      WHERE id = $2
      RETURNING *;
    `;

    // Execute the query with the token and id as parameters
    const result = await db.one(query, [token, id]);

    return result;
  } catch (error) {
    console.error('Error updating token:', error);
    throw error;
  }
};

const resetTokenByUserId = async (id: number) => {
  try {
    // Prepare the SQL statement
    const query = `
      UPDATE users
      SET token = null
      WHERE id = $1
      RETURNING *;
    `;

    // Execute the query with the token and id as parameters
    const result = await db.one(query, [id]);

    return result;
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};


export {
  saveNewUser,
  getUserByEmail,
  getUserByAadhaar,
  updateToken,
  getUserByUserId,
  resetTokenByUserId,
};
