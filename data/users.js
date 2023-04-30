import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { type } from 'os';
const saltRounds = 8;

const createUser = async (firstName, lastName, email, password) => {
  if (!firstName) {
    throw `Error: Must enter first name`;
  }
  if (!lastName) {
    throw `Error: Must enter last name`;
  }
  if (!email) {
    throw `Error: Must enter email`;
  }
  if (!password) {
    throw `Error: Must enter password`;
  }
  if (typeof firstName != 'string') {
    throw `Error: First name must be in string format`;
  }
  if (typeof lastName != 'string') {
    throw `Error: Last name must be in string format`;
  }
  if (typeof email != 'string') {
    throw `Error: Email must be in string format`;
  }
  if (typeof password != 'string') {
    throw `Error: Password must be in string format`;
  }
  for (let i = 0; i < firstName.length; i++) {
    if (firstName.charCodeAt(i) < 58 && firstName.charCodeAt(i) > 47) {
      throw `Error: First Name cannot include numbers`;
    }
  }
  for (let i = 0; i < lastName.length; i++) {
    if (lastName.charCodeAt(i) < 58 && lastName.charCodeAt(i) > 47) {
      throw `Error: Last Name cannot include numbers`;
    }
  }
  let checkEmail = email.split('@');
  if (checkEmail.length != 2 || checkEmail[1].split('.')[1].length != 3) {
    throw `Error: Email must be in format ____@____.com`;
  }
  if (password.length > 8 && password.trim().length != 0) {
    let num = 0;
    let upperCase = 0;
    for (let i = 0; i < password.length; i++) {
      if (password.charAt(i) == ' ') {
        throw `Error: Password cannot have empty spaces`;
      }
      if (password.charCodeAt(i) > 47 && password.charCodeAt(i) < 58) {
        num = num + 1;
      }
      if (password.charCodeAt(i) > 64 && password.charCodeAt(i) < 91) {
        upperCase = upperCase + 1;
      }
    }
    if (!(num >= 1 && upperCase >= 1)) {
      throw `Error: Password must have at least one capital letter and one number`;
    }
  } else {
    throw `Error: Password must be a string of at least 8 characters with at least 1 one capital letter and 1 number`;
  }
  const hashed = await bcrypt.hash(password, saltRounds);
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  email = email.toLowerCase();
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashed
  };
  const userCollection = await users();
  const foundUser = await userCollection.findOne({ email: email });
  if (foundUser) {
    throw `Error: User with that email address already exists`;
  }
  const newInsertInformation = await userCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw 'Insert failed!';
  return await getUserById(newInsertInformation.insertedId.toString());
};
const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  return userList;
};

const getUserById = async (id) => {
  if (!id) {
    throw `Error: Id must be inputed`;
  }
  if (typeof id != 'string') {
    throw `Error: Id must be a string`;
  }
  if (id.length == 0 || id.trim().length == 0) {
    throw `Error: Id must not be an empty string or only include empty spaces`;
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw 'Error: Invalid Object Id';
  }
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) throw 'Error: User not found';
  user._id = user._id.toString();
  return user;
};

const removeUser = async (id) => {
  if (!id) {
    throw `Error: Id must be inputed`;
  }
  if (typeof id != 'string') {
    throw `Error: Id must be a string`;
  }
  if (id.length == 0 || id.trim().length == 0) {
    throw `Error: Id must not be an empty string or only include empty spaces`;
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw 'Error: Invalid Object Id';
  }
  const userCollection = await users();
  const deletionInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(id)
  });
  if (deletionInfo.lastErrorObject.n === 0) throw `Error: Could not delete user with id of ${id}`;

  return { ...deletionInfo.value, deleted: true };
};

const updateUser = async (id, firstName, lastName, email, password) => {
  if (!id) {
    throw `Error: Must enter ID`;
  }
  if (typeof id != 'string') {
    throw `Error: Id must be a string`;
  }
  if (id.length == 0 || id.trim().length == 0) {
    throw `Error: Id must not be an empty string or only include empty spaces`;
  }
  if (!firstName) {
    throw `Error: Must enter first name`;
  }
  if (!lastName) {
    throw `Error: Must enter last name`;
  }
  if (!email) {
    throw `Error: Must enter email`;
  }
  if (!password) {
    throw `Error: Must enter password`;
  }
  if (typeof firstName != 'string') {
    throw `Error: First name must be in string format`;
  }
  if (typeof lastName != 'string') {
    throw `Error: Last name must be in string format`;
  }
  if (typeof email != 'string') {
    throw `Error: Email must be in string format`;
  }
  if (typeof password != 'string') {
    throw `Error: Password must be in string format`;
  }
  for (let i = 0; i < firstName.length; i++) {
    if (firstName.charCodeAt(i) < 58 && firstName.charCodeAt(i) > 47) {
      throw `Error: First name cannot include numbers`;
    }
  }
  for (let i = 0; i < lastName.length; i++) {
    if (lastName.charCodeAt(i) < 58 && lastName.charCodeAt(i) > 47) {
      throw `Error: Last Name cannot include numbers`;
    }
  }
  let checkEmail = email.split('@');
  if (checkEmail.length != 2 || checkEmail[1].split('.')[1].length != 3) {
    throw `Error: Email must be in format ____@____.com`;
  }
  if (password.length > 8 && password.trim().length != 0) {
    let num = 0;
    let upperCase = 0;
    for (let i = 0; i < password.length; i++) {
      if (password.charAt(i) == ' ') {
        throw `Error: Password cannot have empty spaces`;
      }
      if (password.charCodeAt(i) > 47 && password.charCodeAt(i) < 58) {
        num = num + 1;
      }
      if (password.charCodeAt(i) > 64 && password.charCodeAt(i) < 91) {
        upperCase = upperCase + 1;
      }
    }
    if (!(num >= 1 && upperCase >= 1)) {
      throw `Error: Password must have at least one capital letter and one number`;
    }
  } else {
    throw `Error: Password must be a string of at least 8 characters with at least 1 one capital letter and 1 number`;
  }
  id = id.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  email = email.toLowerCase();
  const userUpdateInfo = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  };
  const userCollection = await users();
  const updateInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: userUpdateInfo },
    { returnDocument: 'after' }
  );
  if (updateInfo.modifiedCount === 0) {
    throw `At least one field must be different to successfully update user`;
  }
  if (updateInfo.lastErrorObject.n === 0) throw 'Error: Update failed';

  return updateInfo.value;
};

const checkUser = async (emailAddress, password) => {
  if (!emailAddress || !password) {
    throw 'All fields must be supplied';
  }
  emailAddress = emailAddress.toLowerCase();
  if (typeof emailAddress !== 'string') {
    throw 'Email address must be a valid string';
  }
  if (emailAddress.trim().length === 0) {
    throw 'Email address cannot be empty';
  }
  if (!/\S+@\S+\.\S+/.test(emailAddress)) {
    throw 'Email address must be a valid email address';
  }
  if (typeof password !== 'string') {
    throw 'Password must be a valid string';
  }
  if (password.trim().length === 0) {
    throw 'Password cannot be empty';
  }
  if (password.includes(' ')) {
    throw 'Password cannot contain spaces';
  }
  if (password.trim().length <= 8) {
    throw 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    throw 'Password must contain at least one uppercase letter';
  }
  if (!/\d/.test(password)) {
    throw 'Password must contain at least one number';
  }
  if (!/[!@#$%^&*]/.test(password)) {
    throw 'Password must contain at least one special character';
  }
  const userCollection = await users();
  const userByEmail = await userCollection.findOne({ emailAddress: emailAddress.trim() });
  if (!userByEmail) {
    throw 'Either the email address or password is invalid';
  } else {
    const compare = await bcrypt.compare(password, userByEmail.password);
    if (!compare) {
      throw 'Either the email address or password is invalid';
    } else {
      return {
        firstName: userByEmail.firstName,
        lastName: userByEmail.lastName,
        emailAddress: userByEmail.emailAddress,
        role: userByEmail.role
      };
    }
  }
};

export { createUser, updateUser, removeUser, getAllUsers, getUserById, checkUser };
