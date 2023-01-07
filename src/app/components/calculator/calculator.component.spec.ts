import { AppModule } from './../../app.module';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorService } from 'src/app/services/calculator.service';

import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorComponent ],
      imports: [ HttpClientTestingModule, AppModule ],
      providers: [ CalculatorService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    component.ButtonLayout = [];
    component.FunctionData = [];
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
