import {Injectable} from '@angular/core';
import {Etudiant, Session} from '../entities/entities';


@Injectable({
  providedIn: 'root'
})
export class AttestationService {
  doc: any;

  constructor() {
  }

  //Attestation de scholarité
  replaceErrors(key, value) {
    if (value instanceof Error) {
      return Object.getOwnPropertyNames(value).reduce(function(error, key) {
        error[key] = value[key];
        return error;
      }, {});
    }
    return value;
  }

  errorHandler(error) {
    console.log(JSON.stringify({error: error}, this.replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
      const errorMessages = error.properties.errors.map(function(error) {
        return error.properties.explanation;
      }).join('\n');
      console.log('errorMessages', errorMessages);
      // errorMessages is a humanly readable message looking like this :
      // 'The tag beginning with "foobar" is unopened'
    }
    throw error;
  }

  async generateAS(session: Session, etudiants: Etudiant[], content) {
    var PizZip = require('pizzip');
    var Docxtemplater = require('docxtemplater');
    var FileSaver = require('file-saver');
    // var fs = require('fs');

//Load the docx file as a binary

    var zip = new PizZip(content);
    try {
      this.doc = new Docxtemplater(zip);
    } catch (error) {
      // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
      this.errorHandler(error);
    }
    let data = {
      annee: session.annee,
      annee_courante: session.annee_courante,
      filiere: session.filiere.description + '(' + session.filiere.libelle  + ')',
      etudiants:[]
    }
    etudiants.forEach(etudiant => {
      data.etudiants.push({
           nom: etudiant.nom,
      prenom: etudiant.prenom,
      date_naissance: etudiant.date_naissance,
      ville_naissance: etudiant.ville_naissance,
      })
    })

//set the templateVariables
    this.doc.setData(data);

    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      this.doc.render();
    } catch (error) {
      // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
      this.errorHandler(error);
    }

    var out = this.doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }); //Output the document using Data-URI
    FileSaver.saveAs(out, 'output.docx');

  }


  async generateDocument(data, content) {
    var PizZip = require('pizzip');
    var Docxtemplater = require('docxtemplater');
    var FileSaver = require('file-saver');
    // var fs = require('fs');

//Load the docx file as a binary

    var zip = new PizZip(content);
    try {
      this.doc = new Docxtemplater(zip);
    } catch (error) {
      // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
      this.errorHandler(error);
    }


//set the templateVariables
    this.doc.setData(data);

    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      this.doc.render();
    } catch (error) {
      // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
      this.errorHandler(error);
    }

    var out = this.doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }); //Output the document using Data-URI
    FileSaver.saveAs(out, 'output.docx');

  }


}
