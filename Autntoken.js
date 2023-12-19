import  jwt  from "jsonwebtoken";
import { editUserById } from "./databaseQueries.js";


export const secretkey="lkjhgfdsaqwertyuiopmnbvcxzlokiju"

export async function generateToken(id){
    try{  
        //let token= jwt.sign({_id:id},secretkey,{expiresIn:"ld"})
        let token = jwt.sign({ _id: id }, secretkey, { expiresIn: "1d" });
         console.log(token)
         await editUserById(id,token)
         return token
    }catch(err){
console.log(err)
    }
}