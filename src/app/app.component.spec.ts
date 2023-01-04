import { AppModule } from './app.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let appFixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [AppModule],
    }).compileComponents();
    appFixture = TestBed.createComponent(AppComponent);
    appComponent = appFixture.componentInstance;
  });

  it('app should be defined', () => {
    expect(appComponent).toBeDefined();
  });

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });
});
