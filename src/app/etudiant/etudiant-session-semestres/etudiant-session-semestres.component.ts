import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {DataTableDirective} from 'angular-datatables';
import {Etudiant, EtudiantSession, Filiere, SemestreEtudiant, Session} from '../../entities/entities';
import {Subject} from 'rxjs';
import {EtudiantServiceService} from '../../services/etudiant-service.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-etudiant-session-semestres',
  templateUrl: './etudiant-session-semestres.component.html',
  styleUrls: ['./etudiant-session-semestres.component.css']
})
export class EtudiantSessionSemestresComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  isError: boolean = false;
  isLoaded: boolean = false;
  etudiantSessions: EtudiantSession[] = [];
  dtTrigger: any = new Subject();
  etudiant: Etudiant;
  dtOptions = {
    'language': {
      url: 'assets/French.json'
    },
    order: [[0, 'asc']],
    'columnDefs': [
      {
        'targets': [-1, -2],
        'orderable': false
      }
    ]
  };
  public idSession: number;
  public etudiantSession: EtudiantSession;
  public semestreEtudiants: SemestreEtudiant[];
  public session: Session;

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    try{

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
    }catch (e) {
      console.log(e);
    }
  }

  constructor(private httpClient: HttpClient,private authService:AuthService, private common: CommonService, private activatedRoute: ActivatedRoute,public etudiantService:EtudiantServiceService) {


  }

  ngOnInit(): void {
    this.idSession = this.activatedRoute.snapshot.params.id;
    this.initData();
  }

  private async initData() {
    try {
   if (!this.etudiantService.etudiant) {
        this.etudiantService.etudiant = await this.httpClient.get<Etudiant>(this.common.url + '/etudiants/2').toPromise();
      }
         this.etudiant = <Etudiant> await this.httpClient.get(this.common.url + '/etudiants/' + this.authService.user.id).toPromise();
   this.etudiantSession = await this.httpClient.get<EtudiantSession>(this.common.url + '/etudiantSessions/search/bySessionAndEtudiant?idSession='+this.idSession + '&idEtudiant='+this.etudiant.id).toPromise();
      console.log(this.etudiantSession);
      this.session = await this.httpClient.get<Session>(this.common.url + '/sessions/' + this.idSession).toPromise();
      this.session.filiere = await this.httpClient.get<Filiere>(this.session._links['filiere']['href']).toPromise();
      let data = await this.httpClient.get(this.common.url + '/semestreEtudiants/search/query5?idEtudiant=' + this.etudiant.id + '&idSession=' + this.idSession).toPromise();
      this.semestreEtudiants = <SemestreEtudiant[]> data['_embedded']['semestreEtudiants'];
      this.isLoaded = true;
      this.rerender();
    } catch (e) {
      console.log(e);
      this.isError = true;
    }

  }

  onDemandeReleve(semestreEtudiant: SemestreEtudiant) {
    if (semestreEtudiant.hasRequestedReleve) {
      this.common.toastMessage('Erreur', 'Vous avez deja effectué une demande.');
      return;
    }
    if (!semestreEtudiant.canRequestReleve) {
      this.common.toastMessage('Erreur', 'Cette fonctionnalité est desactivé temportairement');
      return;
    }
    this.httpClient.get(this.common.url + '/requestReleve/' + semestreEtudiant.id).subscribe(value => {
      this.common.toastMessage('Info', 'Votre demande a ete enregistré.');
      this.httpClient.get(semestreEtudiant._links['self']['href']).subscribe(value1 => {
       let newSemestreEtudiant = <SemestreEtudiant> value1;
        semestreEtudiant.hasRequestedReleve = newSemestreEtudiant.hasRequestedReleve;
        semestreEtudiant.nbrReleveRequests = newSemestreEtudiant.nbrReleveRequests;
        semestreEtudiant.canRequestReleve = newSemestreEtudiant.canRequestReleve;
        semestreEtudiant.note = newSemestreEtudiant.note;
        semestreEtudiant.is_done = newSemestreEtudiant.is_done;
        this.rerender();
      }, error => {
        console.log(error);
        this.common.toastMessage('Error', 'Error loading data');
      });
    }, error => {
      console.log(error);
      this.common.toastMessage('Erreur', 'Erreur lors de lenregistrement de votre demande');

    });


  }
}
