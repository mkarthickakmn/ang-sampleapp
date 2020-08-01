import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchpostsComponent } from './fetchposts.component';

describe('FetchpostsComponent', () => {
  let component: FetchpostsComponent;
  let fixture: ComponentFixture<FetchpostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchpostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
