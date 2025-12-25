import { TestBed } from '@angular/core/testing';
import { SerializationService } from './serialization.service';
import { HtmlSerializer } from './serializers/html.serializer';
import { JSONSerializer } from './serializers/JSON.serializer';
import { CssClassSerializer } from './serializers/css-class.serializer';
import { CssStyleSerializer } from './serializers/css-style.serializer';

describe('SerializationService', () => {
  let service: SerializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SerializationService],
    });
    service = TestBed.inject(SerializationService);
  });

  describe('WHEN getting HTML serializer', () => {
    it('SHOULD return HtmlSerializer instance', () => {
      const serializer = service.getSerializer('HTML');

      expect(serializer).toBeInstanceOf(HtmlSerializer);
    });
  });

  describe('WHEN getting JSON serializer', () => {
    it('SHOULD return JSONSerializer instance', () => {
      const serializer = service.getSerializer('JSON');

      expect(serializer).toBeInstanceOf(JSONSerializer);
    });
  });

  describe('WHEN getting CSS class serializer', () => {
    it('SHOULD return CssClassSerializer instance', () => {
      const serializer = service.getSerializer('CSS-class');

      expect(serializer).toBeInstanceOf(CssClassSerializer);
    });
  });

  describe('WHEN getting CSS style serializer', () => {
    it('SHOULD return CssStyleSerializer instance', () => {
      const serializer = service.getSerializer('CSS-style');

      expect(serializer).toBeInstanceOf(CssStyleSerializer);
    });
  });
});
