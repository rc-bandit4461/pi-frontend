export class Entity {
  public createdAt: Date;
  public updatedAt: Date;
  public _links: Links;
  public created_at:Date;
  public updated_at:Date;

}

export class Element extends Entity {
  public id: Number;
  public libelle: String;
  public _links: Links;

  public constructor(libelle: string) {
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
  public semestreFilieres: SemestreFiliere[];

  public _links: Links;

}

export class Session extends Entity {
  public id: Number;
  public annee: number;
  public nbr_semestre: number;
  public semestreFilieres: SemestreFiliere[];
  public filiere: Filiere = null;
  public _links: Links;

}

export class SemestreEtudiant extends Entity {
  public id: Number;
  public etudiant: Etudiant;
  public session: Session;
  public _links: Links;

}

export class SemestreFiliere extends Entity {
  public id: Number;
  public numero: number;
  public filiere: Filiere;
  public session: Session;
  public modules: Module[];
  public _links: Links;

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
