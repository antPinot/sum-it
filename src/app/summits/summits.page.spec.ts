import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummitsPage } from './summits.page';

describe('SummitsPage', () => {
  let component: SummitsPage;
  let fixture: ComponentFixture<SummitsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SummitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
