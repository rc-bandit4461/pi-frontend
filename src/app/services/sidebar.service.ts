import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {EtudiantServiceService} from './etudiant-service.service';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggled = false;
  _hasBackgroundImage = false;
  menus = [];
  loggedMenus = [];
  generalMenu = [];


  getProfessorMenus() {
    return [
      {
        title: 'general',
        type: 'header'
      },
      {
        title: 'Rooms and Bookings',
        type: 'dropdown',
        submenus: [
          {
            title: 'Bookings',
            type: 'simple',
            link: '/admin/bookings'
          },
          {
            title: 'New booking',
            type: 'simple',
            link: '/admin/newBooking'
          },
          {
            title: 'Rooms',
            type: 'simple',
            link: '/admin/rooms'
          },
        ]
      },
      {
        title: 'Reclamations',
        type: 'dropdown',
        submenus: []
      }
    ];

  }

  getAdminMenus() {
    return [
      {
        title: 'Admin',
        type: 'header'
      },
      {
        title: 'Element',
        type: 'dropdown',
        submenus: [
          {
            title: 'Liste des elements',
            link: '/admin/elements'
          }
        ]
      },
      {
        title: 'Filiere',
        type: 'dropdown',
        submenus: [
          {
            title: 'Liste des filieres',
            link: '/admin/filieres',
          },
          {
            title: 'Nouvelle filiere',
            link: '/admin/filieres/create',
          },
        ]

      },
      {
        title: 'Sessions',
        type: 'dropdown',
        submenus: [
          {
            title: 'Liste des sessions',
            link: '/admin/sessions',
          },
          {
            title: 'Nouvelle session',
            link: '/admin/sessions/create',
          },
        ]

      },
      {
        title: 'Demandes',
        type: 'dropdown',
        submenus: [
          {
            title: 'Demandes Relevés',
            link: '/admin/demandeReleves'
          },
          {
            title: 'Attestations',
            link: '/admin/demandes'
          }
        ]
      },
      {
        title: 'Rooms and Bookings',
        type: 'dropdown',
        submenus: [
          {
            title: 'Bookings',
            type: 'simple',
            link: '/admin/bookings'
          },
          {
            title: 'New booking',
            type: 'simple',
            link: '/admin/newBooking'
          },
          {
            title: 'Rooms',
            type: 'simple',
            link: '/admin/rooms'
          },
          {
            title: 'New Room',
            type: 'simple',
            link: '/admin/newRoom'
          },
        ]
      },
      {
        title: 'Reclamations',
        type: 'dropdown',
        submenus: [
          {
            title: 'Liste des réclamations',
            type: 'simple',
            link: 'admin/reclamations'
          }
        ]
      }

    ];
  }

  unloggedMenus = [
    {
      title: 'general',
      type: 'header'
    },
    {
      title: 'Dashboard',
      icon: 'fa fa-tachometer-alt',
      active: false,
      type: 'dropdown',
      badge: {
        text: 'New ',
        class: 'badge-warning'
      },
      submenus: [
        {
          title: 'Dashboard 1',
          badge: {
            text: 'Pro ',
            class: 'badge-success'
          }
        },
        {
          title: 'login',
          link: '/login',
        },
        {
          title: 'Dashboard 3'
        }
      ]
    },
    {
      title: 'E-commerce',
      icon: 'fa fa-shopping-cart',
      active: false,
      type: 'dropdown',
      badge: {
        text: '3',
        class: 'badge-danger'
      },
      submenus: [
        {
          title: 'Products',
          link: 'https://google.com'
        },
        {
          title: 'Orders'
        },
        {
          title: 'Credit cart'
        }
      ]
    },
    {
      title: 'Components',
      icon: 'far fa-gem',
      active: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'General',
        },
        {
          title: 'Panels'
        },
        {
          title: 'Tables'
        },
        {
          title: 'Icons'
        },
        {
          title: 'Forms'
        }
      ]
    },
    {
      title: 'Charts',
      icon: 'fa fa-chart-line',
      active: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'Pie chart',
        },
        {
          title: 'Line chart'
        },
        {
          title: 'Bar chart'
        },
        {
          title: 'Histogram'
        }
      ]
    },
    {
      title: 'Maps',
      icon: 'fa fa-globe',
      active: false,
      type: 'dropdown',
      submenus: [
        {
          title: 'Google maps',
        },
        {
          title: 'Open street map'
        }
      ]
    },
    {
      title: 'Extra',
      type: 'header'
    },
    {
      title: 'Documentation',
      icon: 'fa fa-book',
      active: false,
      type: 'simple',
      badge: {
        text: 'Beta',
        class: 'badge-primary'
      },
    },
    {
      title: 'Calendar',
      icon: 'fa fa-calendar',
      active: false,
      type: 'simple'
    },
    {
      title: 'Examples',
      icon: 'fa fa-folder',
      active: false,
      type: 'simple'
    }
  ];

  constructor(public etudiantService: EtudiantServiceService, public authService: AuthService) {
  }

  toggle() {
    this.toggled = !this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setMenuByUser() {
    if (!this.authService.isLoggedIn()) {
      this.menus = this.unloggedMenus;
      return;
    }
    this.loggedMenus = [];
    let targetMenu: any[];

    if (this.authService.isStudent) {
      targetMenu = this.getStudentMenus();
    }
    if (this.authService.isAdmin) {
      targetMenu = this.getAdminMenus();
    }
    if (this.authService.isProf) {
      targetMenu = this.getProfessorMenus();
    }
    targetMenu.forEach(value => {
      this.loggedMenus.push(value);
    });
    this.generalMenu.forEach(value => {
      this.loggedMenus.push(value);
    });
    this.menus = this.loggedMenus;

  }

  getStudentMenus() {
    return [

      {
        title: 'student',
        type: 'header'
      },
      {
        title: 'Sessions',
        type: 'dropdown',
        submenus: [
          {
            title: 'Mes sessions',
            link: '/etudiant/sessions',
          }
        ]
      },
      {
        title: 'Mes demandes',
        type: 'dropdown',
        badge: {
          text: this.etudiantService.demandesCount > 0 ? this.etudiantService.demandesCount : '',
          class: 'badge-danger'
        },
        submenus: []

      },
      {
        title: 'general',
        type: 'header'
      },
      {
        title: 'Rooms and Bookings',
        type: 'dropdown',
        submenus: [
          {
            title: 'Bookings',
            type: 'simple',
            link: '/admin/bookings'
          },
          {
            title: 'New booking',
            type: 'simple',
            link: '/admin/newBooking'
          },
          {
            title: 'Rooms',
            type: 'simple',
            link: '/admin/rooms'
          },
        ]
      },
      {
        title: 'Réclamations',
        type: 'dropdown',
        submenus: []
      }

    ];
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList() {
    return this.menus;
  }

  get hasBackgroundImage() {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}
