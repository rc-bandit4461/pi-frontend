export class Entity {
  public createdAt: Date;
  public updatedAt: Date;
  public _links: Links;
  public created_at: Date;
  public updated_at: Date;

}

export class Demande extends Entity {
  done: boolean = false;
}

export class DemandeReleve extends Demande {
  public id: Number;
  semestreEtudiant: SemestreEtudiant;
  public _links: Links;
}

export class Element extends Entity {
  public id: Number;
  public libelle: String;
  public _links: Links;
  public facteur: number = 1;

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
  public diplome: Diplome;
  public _links: Links;
  public modules: Module[];

}

export class Diplome extends Entity {
  public id: Number;
  public libelle: String = null;
  public description: String = null;
  public nbr_annee: number = 1;
}

export class EtudiantSession extends Entity {
  public id = {
    etudiantId: null,
    sessionId: null
  };
  note: number = 0;
  etudiant: Etudiant;
  is_dropped: boolean = false;
  is_passed: boolean = false;

}

export class NoteElementModule extends Entity {
  id: Number;
  noteNormale: number;
  noteExamens: NoteExamen[];
  is_ratt: boolean;
  is_passed: boolean = true;
  noteRatt: number;
  facteur: number = 1;
  noteDeliberation: number;
  element: Element;
  noteModule: NoteModule;
  is_consistent: boolean;
}

export class NoteModule extends Entity {
  id: Number;
  noteNormale: number;
  noteRatt: number;
  is_ratt: boolean;
  noteDeliberation: number;
  noteElementModules: NoteElementModule[] = [];
  is_consistent: boolean;
  module: Module;
  isPassed: boolean;
}

export class Session extends Entity {
  public id: Number;
  public annee: number = 2020;
  public nbr_semestre: number;
  public semestreFilieres: SemestreFiliere[];
  public filiere: Filiere = null;
  public _links: Links;
  public is_done: boolean;
  annee_courante: number;

}

export class SemestreEtudiant extends Entity {
  public id: Number;
  public note: number;
  public is_done: boolean;
  public etudiant: Etudiant;
  public session: Session;
  public _links: Links;

}

export class NoteEtudiant {
  etudiant: Etudiant;
  private note: number = null;

  public constructor(etudiant: Etudiant, note: number) {
    this.etudiant = etudiant;
    this.note = note;
  }
}

export class Examen extends Entity {
  public id: Number;
  noteEtudiants: NoteEtudiant[] = [];
  session: Session;
  numero: number = 1;
  module: Module;

  facteur: number = 1;
  element: Element;
  description: string = '';
  is_ratt: boolean = false;
  noteExamens: NoteExamen[] = [];
}

export class NoteExamen extends Entity {
  id: Number;
  etudiant: Etudiant;
  note: number = null;
  _links: Links;
  examen: Examen;
}

export class SemestreFiliere extends Entity {
  public id: Number;
  public numero: number;
  public filiere: Filiere;
  // public is_done:boolean = false;
  public session: Session;
  public modules: Module[];
  public _links: Links;
  public selected = false;
  done: boolean = false;

}

export class Module extends Entity {
  public id: Number;
  public facteur: number = 1;
  public libelle: string;
  public elements: Element[];
  public _links: Links;
}

export class Links extends Entity {
  public self: Self;

}

export class Etudiant extends Entity {
  public id: number;
  // noteExamens:NoteExamen[] = [];
  // currentNoteExamen:NoteExamen =<NoteExamen> <unknown> {
  //   note: 10,
  //   etudiant: this
  // }
  public noteModules: NoteModule[];
  public cin: string;
  public date_naissance: Date;
  public ville_naissance: string;
  public cne: string;
  public infos: string;
  public email: string;
  public sexe: string;
  public nom: string;
  public prenom: string;
  public password: string;
  public _links: Links;
  public is_examined: boolean = false;
  disabled: any;
  noteModule: NoteModule;
  public etudiantSession: EtudiantSession;
  semestreEtudiant: SemestreEtudiant;

}
