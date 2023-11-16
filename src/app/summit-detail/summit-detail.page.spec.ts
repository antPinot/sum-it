import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummitDetailPage } from './summit-detail.page';

describe('SummitDetailPage', () => {
  let component: SummitDetailPage;
  let fixture: ComponentFixture<SummitDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SummitDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
