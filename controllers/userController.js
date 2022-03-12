import User from "../models/modelUser.js";
import { cryptPassword } from "../customDependences/password.js";
import { comparePassword } from "../customDependences/password.js";

export class UserController {

    static async subscribe(user) {

        let objectError = {
            errors: []
        }

        user.password = await cryptPassword(user.password) // le mot de passe devient crypté

        const newUser = new User(user)

        //---------------------------- permet de récupérer les erreurs
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

        let objectError = {
            errors: []
        }

        let err = ""

        let user = await User.findOne({ pseudo: login.pseudo })

        if (user) {
            let samePassword = await comparePassword(login.password, user.password)
            if (samePassword) {
                return user._id
            } else {
                err = "le mot de passe n'est pas correct"
                objectError.errors.push(err)
                return objectError;
            }
        } else {
            err = "vous n'êtes pas inscrit"
            objectError.errors.push(err)
            return objectError;
        }
    }

    static async isConnected(id) {
        let user = await User.findOne({ _id: id })
        if (user) {
            return user
        } else {
            return
        }

    }

    static async updateUser(user, modif) {

        let objectError = {
            errors: []
        }
        let err = ""

        let { password } = await User.findOne({ _id: user }) // {permet de récupérer seulement la valeur de l'objet}

        let samePassword = await comparePassword(modif.oldPassword, password)
        modif.password = await cryptPassword(modif.password) // le mot de passe devient crypté
        if (samePassword) {
            User.updateOne({ _id: user }, modif, (error, user) => {    
                
            })
            return "" //pour ne pas returner une valeur vide et créer une erreure
        } else {
            err = "votre ancien mot de passe n'est pas correct"
            objectError.errors.push(err)
            return objectError;
        }

    }


}