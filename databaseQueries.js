/* eslint-disable no-unused-vars */
import { client } from "./createConnection.js"
import {ObjectId} from "mongodb"
import bcrypt from "bcrypt"
export async function insertNewUser(name, email, password) {
    return await client.db("pwreset").collection("pwdata").insertOne({ name: name, email: email, password: password })
}

export async function checkIfEmailAlreadyExists(email) {
    const allEmails = await client.db("pwreset").collection("pwdata").find({ email: email }).toArray()
    if (allEmails.length!==0) {
        return true
    } else {
        return false
    }

} 

export async function checkIfPasswordMatch(email,password){
    const user=await client.db("pwreset").collection("pwdata").findOne({ email: email })
    const pass= await bcrypt.compare(password,user.password)
    return {id:user._id,pass: pass}
}

/*export async function editUserById(id,payload){
    // eslint-disable-next-line no-unused-vars
    const user= await client.db("pwreset").collection("pwdata").updateOne({ _id: new ObjectId(id)},{$set:{token:payload}})
}*/


export async function editUserById(id, payload) {
  try {
    const result = await client
      .db("pwreset")
      .collection("pwdata")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { token: payload } },
        { returnDocument: 'after' } // Return the updated document
      );

    if (!result.value) {
      throw new Error(`User with ID ${id} not found`);
    }

    console.log(`User with ID ${id} updated successfully`);
    console.log('Updated User:', result.value);
    
    // You can return the updated user or any specific data if needed
    return result.value;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Propagate the error to the caller
  }
}

export async function getUserById(id){
    const user = await client.db("pwreset").collection("pwdata").findOne({ _id: new ObjectId(id)})
    return user
}

export async function getUserByEmail(email){
    const user = await client.db("pwreset").collection("pwdata").findOne({email:email})
    return user
}

export async function enterPasswordVerifyToken(id,payload){
    const user= await client.db("pwreset").collection("pwdata").updateOne({ _id: new ObjectId(id)},{$set:{passwordVerifyToken:payload}})   
}

export async function deleteTokenAfterVerification(id){
    await client.db("pwreset").collection("pwdata").updateOne({_id:new ObjectId(id)},{$unset:{passwordVerifyToken:""}})
}

export async function setnewpassword(id,password){
    await client.db("pwreset").collection("pwdata").updateOne({_id:new ObjectId(id)},{$set:{password:password}})
}