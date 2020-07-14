import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {Etudiant, EtudiantSession, Filiere, Session} from '../../entities/entities';
import {Subject} from 'rxjs';
// @ts-ignore
import {DataTableDirective} from 'angular-datatables';
import {EtudiantServiceService} from '../../services/etudiant-service.service';
import {ServerService} from '../../services/server.service';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-etudiant-sessions',
  templateUrl: './etudiant-sessions.component.html',
  styleUrls: ['./etudiant-sessions.component.css']
})
export class EtudiantSessionsComponent implements AfterViewInit, OnDestroy, OnInit {
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

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    try {

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    } catch (e) {
      console.log(e);
    }
  }

  constructor(private toastr:ToastrService,public etudiantService: EtudiantServiceService, public authService: AuthService, public server: ServerService, public httpClient: HttpClient, public common: CommonService) {
  }

  ngOnInit(): void {
    // this.auth.authentication(false, this.auth.ROLE_STUDENT);
    this.initData();
  }

  async initData() {
    try {
      if (!this.etudiantService.etudiant) {
        this.etudiantService.etudiant = <Etudiant> await this.httpClient.get(this.common.url + '/etudiants/2').toPromise();
      }
      this.etudiant = <Etudiant> await this.httpClient.get(this.common.url + '/etudiants/' + this.authService.user.id).toPromise();
      console.log(this.etudiant);
      let data = await this.httpClient.get(this.common.url + '/etudiantSessions/search/byEtudiantId?id=' + this.etudiant.id).toPromise();
      console.log(data);
      this.etudiantSessions = data['_embedded']['etudiantSessions'];
      for (let etudiantSession of this.etudiantSessions) {
        etudiantSession.session = <Session> await this.httpClient.get(this.common.url + '/sessions/' + etudiantSession.id.sessionId).toPromise();
        etudiantSession.session.filiere = <Filiere> await this.httpClient.get(etudiantSession.session._links['filiere']['href']).toPromise();

      }
      this.rerender();
      console.log(this.etudiantSessions);
      this.isLoaded = true;
    } catch (e) {
      console.log(e);
      this.isError = true;
    }
  }

  onDemandeAttestationScolarite(etudiantSession: EtudiantSession) {
    console.log('SCOLARITE');
    if (etudiantSession.is_dropped) {
      this.toastr.error( 'Vous ne pouvez pas demander une attestation pour cette session.');
      return;

    }
    if (!etudiantSession.canRequestScolarite) {
      this.toastr.error( 'Cette fonctionnalité est desactivé temportairement');
      return;
    }
    if (etudiantSession.hasRequestedScolarite) {
      this.toastr.error( 'Vous avez deja effectué une demande.');
      return;
    }
    this.httpClient.get(this.common.url + '/requestScolariteCertif/' + etudiantSession.session.id + '/' + this.etudiant.id).subscribe(value => {
      this.toastr.success( 'Votre demande a ete enregistré.');
      this.httpClient.get(this.common.url + '/etudiantSessions/search/bySessionAndEtudiant?idEtudiant=' + etudiantSession.id.etudiantId + '&idSession=' + etudiantSession.id.sessionId).subscribe(value1 => {
        console.log('HEEEEEEEEEEERE');
        let session = etudiantSession.session;
        console.log(value1);
        etudiantSession = <EtudiantSession> value1;
        etudiantSession.session = session;
        this.rerender();
      }, error => {
        console.log(error);
        this.toastr.error( 'Erreur lors du chargement de données');
      });
    }, error => {
      this.toastr.error( 'Erreur lors de lenregistrement de votre demande');

    });

  }

  onDemandeAttestationReussite(etudiantSession: EtudiantSession) {
    if (!etudiantSession.session.is_done) {
      this.toastr.warning( 'Vous netes pas autorisé à demander une attestation. Ressayez plus tard ou contacter' +
        ' l\'administration');
      return;

    }
    if (!etudiantSession.canRequestGraduation) {
      this.toastr.warning( 'Cette fonctionnalité est desactivé temportairement');
      return;
    }
    if (etudiantSession.hasRequestedGraduation) {
      this.toastr.warning( 'Vous avez deja effectué une demande.');
      return;
    }
    this.httpClient.get(this.common.url + '/requestGradCertif/' + etudiantSession.session.id + '/' + this.etudiant.id).subscribe(value => {
      this.toastr.success( 'Votre demande a ete enregistré.');
      this.httpClient.get(this.common.url + '/etudiantSessions/search/bySessionAndEtudiant?idEtudiant=' + etudiantSession.id.etudiantId + '&idSession=' + etudiantSession.id.sessionId).subscribe(value1 => {
        let session = etudiantSession.session;
        etudiantSession = <EtudiantSession> value1;
        etudiantSession.session = session;
        this.rerender();
      }, error => {
        console.log(error);
        this.toastr.error( 'Erreur lors du chargement de données chargement de données.');
      });
    }, error => {
      console.log(error);
      this.toastr.error( 'Erreur lors de lenregistrement de votre demande');

    });


  }
}
