import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RendererComponent } from './renderer.component';
import { provideCanvas } from '@layout/canvas';

describe('RendererComponent', () => {
  let component: RendererComponent;
  let fixture: ComponentFixture<RendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendererComponent],
      providers: [
        ...provideCanvas(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RendererComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
