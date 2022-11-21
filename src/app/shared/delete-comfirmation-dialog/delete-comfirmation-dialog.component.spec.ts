import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteComfirmationDialogComponent } from './delete-comfirmation-dialog.component';

describe('DeleteComfirmationDialogComponent', () => {
  let component: DeleteComfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteComfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteComfirmationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteComfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
