import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyuploadsComponent } from './myuploads.component';

describe('MyuploadsComponent', () => {
  let component: MyuploadsComponent;
  let fixture: ComponentFixture<MyuploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyuploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyuploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
