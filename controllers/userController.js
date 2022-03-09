import User from "../models/modelUser.js";
import { cryptPassword } from "../customDependences/password.js";
import { comparePassword } from "../customDependences/password.js";

export class UserController {

    static async subscribe(user) {

        let objectError = {
            errors: []
        }

        user.password = await cryptPassword(user.password)

        const newUser = new User(user)

        //---------------------------- permet de récupérer les erreures
        let err = await newUser.validateSync()
        if (err) {
            for (let i = 0; i < Object.values(err.errors).length; i++) {
                objectError.errors.push(Object.values(err.errors)[i].message);
            }
            return objectError;
        }
        newUser.save()
        return newUser
    }

    static async login(login) {
        let user = await User.findOne({pseudo: login.pseudo})
        let memeMotDePasse = await comparePassword(login.password, user.password)
        
        if(memeMotDePasse){
            console.log("jbnb");
        }
       
        
         
    }


}