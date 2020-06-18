export class Entity {
  public createdAt: Date;
  public updatedAt: Date;
  public _links: Links;
  public created_at: Date;
  public updated_at: Date;

}

export class Element extends Entity {
  public id: Number;
  public libelle: String;
  public _links: Links;


  public constructor(libelle: String) {
    super();
  this.libelle = libelle;
  }

}

export class Self extends Entity {
  public href: string;
}

export class Filiere extends Entity {
  public id: Number;
  public libelle: string;
  public description: string;
  public nbr_semestres: number;
  public semestreFilieres: SemestreFiliere[];
  public diplome:Diplome;
  public _links: Links;

}
export class Diplome extends Entity{
  public id:Number;
  public libelle:String = null;
  public description:String = null;
  public nbr_annee:number =1;
}
export class EtudiantSession extends Entity {
  public id: any;

}

export class Session extends Entity {
  public id: Number;
  public annee: number = 2020;
  public nbr_semestre: number;
  public semestreFilieres: SemestreFiliere[];
  public filiere: Filiere = null;
  public _links: Links;
  public done: boolean;

}

export class SemestreEtudiant extends Entity {
  public id: Number;
  public etudiant: Etudiant;
  public session: Session;
  public _links: Links;

}

export class NoteEtudiant {
  etudiant: Etudiant;
  private note: string;

  public constructor(etudiant: Etudiant, note: string) {
    this.etudiant = etudiant;
    this.note = note;
  }
}

export class Examen extends Entity {
  public id: Number;
  noteEtudiants: NoteEtudiant[] = [];
  session: Session;
  numero: number;
  module: Module;
  facteur:number=1;
  element: Element;
  description: string;
  is_ratt: boolean = false;
}

export class SemestreFiliere extends Entity {
  public id: Number;
  public numero: number;
  public filiere: Filiere;
  public session: Session;
  public modules: Module[];
  public _links: Links;
  public selected = false;

}

export class Module extends Entity {
  public id: Number;
  public libelle: string;
  public elements: Element[];
  public _links: Links;
}

export class Links extends Entity {
  public self: Self;

}

export class Etudiant extends Entity {
  public id: number;
  public cin: string;
  public nom: string;
  public prenom: string;
  public password: string;
  public _links: Links;
  disabled: any;

}
