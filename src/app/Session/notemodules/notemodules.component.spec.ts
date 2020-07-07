import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotemodulesComponent } from './notemodules.component';

describe('NotemodulesComponent', () => {
  let component: NotemodulesComponent;
  let fixture: ComponentFixture<NotemodulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotemodulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotemodulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
