import { AppModule } from './../../app.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar.component';
import { By } from '@angular/platform-browser';

describe('SnackBarComponent', () => {
  let component: SnackBarComponent;
  let fixture: ComponentFixture<SnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackBarComponent],
      imports: [AppModule],
      providers: [
        { provide: MatSnackBarRef<SnackBarComponent>, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close called', async () => {
    spyOn(component, 'close');
    fixture.debugElement.query(By.css('.bar__button div')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.close).toHaveBeenCalled();
    });
  });

  it('key detected', async () => {
    const keyEvent = new KeyboardEvent('keydown');
    spyOn(component, 'onKeyDown').withArgs(keyEvent);
    document.dispatchEvent(keyEvent);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.onKeyDown).toHaveBeenCalledWith(keyEvent);
    });
  });
});
