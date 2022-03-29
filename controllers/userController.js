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

        let user = req.body //stock le req.body dans une variable
        let objectError = {
            "error": true
        }

        user.password = await cryptPassword(user.password) // le mot de passe devient crypté
        user.status = 1

        const newUser = new User(user) //créer un nouvelle objet sur le schema mongoose (modelUser)
        const directory = `${FileUrl}/userImages/${newUser._id}` // chemin qui correspond au dossier de l'image du rider

        //---------------------------- permet de récupérer les erreurs
        let err = await newUser.validateSync() // vérifie s'il y a des erreurs dans le schema mongoose 
        if (err) {
            for (let i = 0; i < Object.values(err.errors).length; i++) {
                let path = Object.values(err.errors)[i].path //nom du champs en erreur
                objectError[path] = Object.values(err.errors)[i].message // insere l'erreur dans l'objet "objectError"
            }
            return objectError;
        }


        if (req.files) {
            let extArray = req.files.image.mimetype.split("/"); //scinde le nom de limage en 2
            let extension = extArray[extArray.length - 1];  //choppe l'extention de l'image
            const allowedExtension = ['png', 'jpg', 'jpeg', 'webp']; // accepte que ces extentions

            if (!allowedExtension.includes(extension)) { // si c'est different des extention dans 'allowedExtention'
               objectError['picture'] = "Veuillez insérer une image" // creer ce message d'erreur
               return objectError // retourne le tableau d'erreur
            }
            let image = await pictureManager.addPicture(req.files.image, directory, newUser._id); //j'ajoute une image dans le dossier specifié
            newUser.picture = image
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
                return user
            } else {
                err = "Le mot de passe n'est pas correct"
                objectError.errors.push(err)
                return objectError;
            }
        } else {
            err = "Vous n'êtes pas inscrit"
            objectError.errors.push(err)
            return objectError;
        }
    }

    static async getUser(id, excludeFields) {
        return await User.findOne({ _id: id }, excludeFields)
    }

    static async updateUser(user, req) {
        let modified = req.body
        let objectError = {
            errors: []
        }
        let err = ""

        let userFind = await User.findOne({ _id: user })
        let password = userFind.password // {permet de récupérer seulement la valeur 'password' de l'objet user}
        let samePassword = await comparePassword(modified.oldPassword, password)
        modified.password = await cryptPassword(modified.password) // le mot de passe devient crypté

        if (samePassword) {

        } else {
            err = "Votre ancien mot de passe incorrect"
            objectError.errors.push(err)
            return objectError;
        }

        if (req.files) {// si un fichier se trouve dans le corps de la requette
            let extArray = req.files.image.mimetype.split("/"); //scinde le nom de limage en 2
            let extension = extArray[extArray.length - 1];  //choppe l'extention de l'image
            const allowedExtension = ['png', 'jpg', 'jpeg', 'webp']; // accepte que ces extentions
            if (!allowedExtension.includes(extension)) { // si c'est different des extention dans 'allowedExtention'
               objectError.errors.push("Veuillez insérer une image") // creer ce message d'erreur
               return objectError // retourne le tableau d'erreur
            }
            const directory = `${FileUrl}/userImages/${req.session.user._id}`// je defini le repertoire 

            if (userFind.picture) {
                await pictureManager.removePictureWthoutMimeType(directory, req.session.user._id)// j'efface l'image precedente
            }
            let ext = await pictureManager.addPicture(req.files.image, directory, req.session.user._id)// et j'ajoute la nouvelle
            modified.picture = ext



        }

        await User.updateOne({ _id: user }, modified)
        return user

    }

    static async eventJoined(user) {
        const listUsers = await User.find({ _id: { $ne: user._id } }) //permet de retiré un élément $ne === ! 

        let authorsEvent = []

        for (let i = 0; i < listUsers.length; i++) {

            let authorEvent = {
                authorEventInfo: listUsers[i],
                userEvent: []
            }

            for (let j = 0; j < listUsers[i].eventUser.length; j++) {


                for (let k = 0; k < listUsers[i].eventUser[j].riderJoin.length; k++) {
                    if (listUsers[i].eventUser[j].riderJoin[k] === user.id) {
                        listUsers[i].eventUser[j].id = listUsers[i].eventUser[j]._id.toString() //créer une nouvelle clef puis la parse
                        authorEvent.userEvent.push(listUsers[i].eventUser[j]) // convertie les objet id en string
                    }

                }

            }
            listUsers[i].id = listUsers[i]._id.toString() //créer une nouvelle clef puis la parse
            authorsEvent.push(authorEvent)
            for (let i = 0; i < authorsEvent.length; i++) {

                if (authorsEvent[i].userEvent.length === 0) {
                    authorsEvent.splice(i, 1)
                }
            }
        }


        return authorsEvent

    }

}