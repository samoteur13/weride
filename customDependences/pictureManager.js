import fs from 'fs';

export class pictureManager {

  static async removePictureWthoutMimeType(directory, name) { //supprime un fichier sans connaitre son extension
     fs.readdirSync(directory, (err, files) => {
       if(err){
         console.log(err);
         return ''
       }
      files.forEach((file) => {
        if (file.split('.')[0] == name){
             fs.unlinkSync(directory +'/' + file);
        } 
      });
    });
  }

  static async getExtensionFile(file) { // permet de retourner l'extension d'un fichier
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    return extension
  }

  static async addPicture(file, directory, name) {//permet d'ajouter un fichier dans un dossier
    let extension = await this.getExtensionFile(file);
     await file.mv(`${directory}/${name}.${extension}`, function (err) {
      if (err) {
        console.log(err);
      }
    });
    return `${name}.${extension}`
  }

  
}

export default pictureManager