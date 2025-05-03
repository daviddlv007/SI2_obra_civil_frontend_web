import { TestBed } from '@angular/core/testing';

import { ObracivilUsuarioService } from './obracivil-usuario.service';

describe('ObracivilUsuarioService', () => {
  let service: ObracivilUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObracivilUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
