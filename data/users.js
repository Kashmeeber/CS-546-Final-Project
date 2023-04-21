import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const createUser = async (firstName, lastName, email, password) => {
    if(!firstName) {
        throw `Error: Must enter first name`
    }
    if(!lastName) {
        throw `Error: Must enter last name`
    }
    if(!email) {
        throw `Error: Must enter email`
    }
    if(!password) {
        throw `Error: Must enter password`
    }
    if(typeof firstName != "string") {
        throw `Error: First name must be in string format`
    }
    if(typeof lastName != "string") {
        throw `Error: Last name must be in string format`
    }
    if(typeof email != "string") {
        throw `Error: Email must be in string format`
    }
    if(typeof password != "string") {
        throw `Error: Password must be in string format`
    }
    for(let i = 0; i < firstName.length; i++) {
        if(firstName.charCodeAt(i) < 58 || firstName.charCodeAt(i) > 47) {
            throw `Error: First Name cannot include numbers`
        }
    }
    for(let i = 0; i < lastName.length; i++) {
        if(lastName.charCodeAt(i) < 58 || lastName.charCodeAt(i) > 47) {
            throw `Error: Last Name cannot include numbers`
        }
    }
    let checkEmail = email.split("@");
    if(checkEmail.length != 2 || checkEmail[1].includes(".com") == false) {
        throw `Error: Email must be in format ____@____.com`
    }
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    password = password.trim();
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    return await this.getUserById(newInsertInformation.insertedId.toString());
};
const getAllUsers = async () => {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
};

const getUserById = async (id) => {
    if(!id) {
        throw `Error: Id must be inputed`
    }
    if(typeof id != "string") {
        throw `Error: Id must be a string`
    }
    if(id.length == 0 || id.trim().length == 0) {
        throw `Error: Id must not be an empty string or only include empty spaces`
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) {
        throw 'Error: Invalid Object Id'
    } 
    const userCollection = await users();
    const user = await userCollection.findOne({_id: ObjectId(id)});
    if (!user) throw 'Error: User not found';
    return user;
};

const removeUser = async (id) => {
    if(!id) {
        throw `Error: Id must be inputed`
    }
    if(typeof id != "string") {
        throw `Error: Id must be a string`
    }
    if(id.length == 0 || id.trim().length == 0) {
        throw `Error: Id must not be an empty string or only include empty spaces`
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) {
        throw 'Error: Invalid Object Id'
    } 
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
      _id: ObjectId(id)
    });
    if (deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete user with id of ${id}`;

    return {...deletionInfo.value, deleted: true};
};

const updateUser = async(id, firstName, lastName, password, email) => {
    if(!id) {
        throw `Error: Must enter ID`
    }
    if(typeof id != "string") {
        throw `Error: Id must be a string`
    }
    if(id.length == 0 || id.trim().length == 0) {
        throw `Error: Id must not be an empty string or only include empty spaces`
    }
    if(!firstName) {
        throw `Error: Must enter first name`
    }
    if(!lastName) {
        throw `Error: Must enter last name`
    }
    if(!email) {
        throw `Error: Must enter email`
    }
    if(!password) {
        throw `Error: Must enter password`
    }
    if(typeof firstName != "string") {
        throw `Error: First name must be in string format`
    }
    if(typeof lastName != "string") {
        throw `Error: Last name must be in string format`
    }
    if(typeof email != "string") {
        throw `Error: Email must be in string format`
    }
    if(typeof password != "string") {
        throw `Error: Password must be in string format`
    }
    for(let i = 0; i < firstName.length; i++) {
        if(firstName.charCodeAt(i) < 58 || firstName.charCodeAt(i) > 47) {
            throw `Error: First Name cannot include numbers`
        }
    }
    for(let i = 0; i < lastName.length; i++) {
        if(lastName.charCodeAt(i) < 58 || lastName.charCodeAt(i) > 47) {
            throw `Error: Last Name cannot include numbers`
        }
    }
    let checkEmail = email.split("@");
    if(checkEmail.length != 2 || checkEmail[1].includes(".com") == false) {
        throw `Error: Email must be in format ____@____.com`
    }
    id = id.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    password = password.trim();
    email = email.trim();
    const oldUser = getUserById(id);
    if(oldUser.firstName == firstName) {
        throw `Error: Updated first name cannot equal old last name`
    }
    if(oldUser.lastName == lastName) {
        throw `Error: Updated last name cannot equal old last name`
    }
    if(oldUser.email == email) {
        throw `Error: Updated email cannot equal old last name`
    }
    if(oldUser.password == password) {
        throw `Error: Updated password cannot equal old last name`
    }
    const userUpdateInfo = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password

    };
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
      {_id: ObjectId(id)},
      {$set: userUpdateInfo},
      {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0) throw 'Error: Update failed';

    return await updateInfo.value;
};

export {
    createUser,
    updateUser,
    removeUser,
    getAllUsers,
    getUserById
}

