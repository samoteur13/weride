import User from "../models/modelUser.js";
import { cryptPassword } from "../customDependences/password.js";
import { comparePassword } from "../customDependences/password.js";
import path from 'path';
import { fileURLToPath } from 'url'; //pour pouvoir utiliser les chemin absolu
import pictureManager from "../customDependences/pictureManager.js";

const __filename = fileURLToPath(import.meta.url); //retourne le chemin absolu du fichier en cours
const __dirname = path.dirname(__filename); //retourne le chemin absolu de la racine du projet
const FileUrl = path.join(__dirname, '..', 'assets/images/')//Je créé le chemin absolu qui me permetra d'enregistrer mes fichiers (image)

export class UserController {

    static async subscribe(req) {
        let user = req.body
        let objectError = {
            errors: []
        }

        user.password = await cryptPassword(user.password) // le mot de passe devient crypté
        user.status = 1

        const newUser = new User(user)
        const directory = `${FileUrl}/userImages/${newUser._id}` // chemin qui correspond au dossier de l'image du pokemon
        //---------------------------- permet de récupérer les erreurs
        let err = await newUser.validateSync()
        if (err) {
            for (let i = 0; i < Object.values(err.errors).length; i++) {
                objectError.errors.push(Object.values(err.errors)[i].message);
            }
            return objectError;
        }


        let image = await pictureManager.addPicture(req.files.image, directory, newUser._id); //j'ajoute une image dans le dossier specifié
        newUser.picture = image
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
                return user
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

    static async getUser(id, excludeFields) {
        return await User.findOne({ _id: id }, excludeFields)
    }

    static async updateUser(user, req) {
        let modify = req.body
        let objectError = {
            errors: []
        }
        let err = ""

        let { password } = await User.findOne({ _id: user }) // {permet de récupérer seulement la valeur 'password' de l'objet user}

        let samePassword = await comparePassword(modify.oldPassword, password)
        modify.password = await cryptPassword(modify.password) // le mot de passe devient crypté
        if (samePassword) {

        } else {
            err = "votre ancien mot de passe n'est pas correct"
            objectError.errors.push(err)
            return objectError;
        }
        if (req.files) {// si un fichier se trouve dans le corps de la requette
            const directory = `${FileUrl}/userImages/${req.session.user._id}`// je defini le repertoire 
            await pictureManager.removePictureWthoutMimeType(directory, req.session.user._id)// j'efface l'image precedente
            let ext = await pictureManager.addPicture(req.files.image, directory, req.session.user._id)// et j'ajoute la nouvelle
            modify.picture = ext


        }
        await User.updateOne({ _id: user }, modify)
        return user

    }

    static async eventJoined(user) {
        const listUsers = await User.find({ _id: { $ne: user._id } }) //permet de retiré un élément $ne === ! 

        let users = []

        for (let i = 0; i < listUsers.length; i++) {

            let userEvent = {
                userId: listUsers[i].id,
                eventId: []
            }
            for (let j = 0; j < listUsers[i].eventUser.length; j++) {


                for (let k = 0; k < listUsers[i].eventUser[j].riderJoin.length; k++) {
                    if (listUsers[i].eventUser[j].riderJoin[k] === user.id) {
                        userEvent.eventId.push(listUsers[i].eventUser[j]._id.toString()) // convertie les objet id en string
                    }

                }

            }
            users.push(userEvent)
            for (let i = 0; i < users.length; i++) {

                if (users[i].eventId.length === 0) {
                    users.splice(i, 1)
                }
            }
        }


        return users

    }

}