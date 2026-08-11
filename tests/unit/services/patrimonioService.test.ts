import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';

import {
  gerarProximoPatrimonioId,
  addPatrimonioIndividualFirestore,
  editPatrimonioIndividualFirestore,
  deletePatrimonioIndividualFirestore,
  getInitialDataFirestore,
} from '../../../src/services/patrimonioService';

import type {
  PatrimonioIndividual,
  ModeloPatrimonial,
} from '../../../src/types/patrimonioTypes';

import * as mockFirebase from '../../../tests/mocks/firebase';

const mockData = mockFirebase.db._data as {
  [collectionName: string]: {
    [documentId: string]: any;
  };
};

describe('patrimonioService utilities', () => {
  describe('gerarProximoPatrimonioId', () => {
    it('should generate "00001" when no patrimonios exist', () => {
      expect(gerarProximoPatrimonioId(undefined)).toBe('00001');
      expect(gerarProximoPatrimonioId([])).toBe('00001');
    });

    it('should generate next ID from existing patrimonios', () => {
      const patrimonios: PatrimonioIndividual[] = [
        {
          id: '00001',
          modeloId: '1',
          localizacao: 'A',
          conservacao: 'novo',
          status: 'entrada',
          inventariante: 'Test',
          dataAquisicao: '2024-01-01',
          ultimaAtualizacao: '2024-01-01',
        },
        {
          id: '00002',
          modeloId: '2',
          localizacao: 'B',
          conservacao: 'bom',
          status: 'entrada',
          inventariante: 'Test',
          dataAquisicao: '2024-01-01',
          ultimaAtualizacao: '2024-01-01',
        },
      ];

      expect(gerarProximoPatrimonioId(patrimonios)).toBe('00003');
    });

    it('should handle non-numeric IDs', () => {
      const patrimonios: PatrimonioIndividual[] = [
        {
          id: 'ABC',
          modeloId: '1',
          localizacao: 'A',
          conservacao: 'novo',
          status: 'entrada',
          inventariante: 'Test',
          dataAquisicao: '2024-01-01',
          ultimaAtualizacao: '2024-01-01',
        },
      ];

      expect(gerarProximoPatrimonioId(patrimonios)).toBe('00001');
    });

    it('should handle mixed numeric and non-numeric IDs', () => {
      const patrimonios: PatrimonioIndividual[] = [
        {
          id: '00005',
          modeloId: '1',
          localizacao: 'A',
          conservacao: 'novo',
          status: 'entrada',
          inventariante: 'Test',
          dataAquisicao: '2024-01-01',
          ultimaAtualizacao: '2024-01-01',
        },
        {
          id: 'ABC',
          modeloId: '2',
          localizacao: 'B',
          conservacao: 'bom',
          status: 'entrada',
          inventariante: 'Test',
          dataAquisicao: '2024-01-01',
          ultimaAtualizacao: '2024-01-01',
        },
      ];

      expect(gerarProximoPatrimonioId(patrimonios)).toBe('00006');
    });

    it('should handle gaps in ID sequence', () => {
      const patrimonios: PatrimonioIndividual[] = [
        {
          id: '00001',
          modeloId: '1',
          localizacao: 'A',
          conservacao: 'novo',
          status: 'entrada',
          inventariante: 'Test',
          dataAquisicao: '2024-01-01',
          ultimaAtualizacao: '2024-01-01',
        },
        {
          id: '00010',
          modeloId: '2',
          localizacao: 'B',
          conservacao: 'bom',
          status: 'entrada',
          inventariante: 'Test',
          dataAquisicao: '2024-01-01',
          ultimaAtualizacao: '2024-01-01',
        },
      ];

      expect(gerarProximoPatrimonioId(patrimonios)).toBe('00011');
    });
  });
});

describe('patrimonioService async functions', () => {
  beforeEach(() => {
    mockFirebase.db._resetData();
  });

  afterEach(() => {
    mockFirebase.db._resetData();
  });

  describe('addPatrimonioIndividualFirestore', () => {
    it('should add patrimonio successfully', async () => {
      const modelo: ModeloPatrimonial = {
        id: 'modelo1',
        nome: 'Notebook Dell',
        marca: 'Dell',
        modelo: 'Inspiron 15',
        categoria: 'Informática',
        unidade: 'Unidade',
        criador: 'admin',
        createdAt: '2024-01-01',
        ultimaAtualizacao: '2024-01-01',
      };

      const data = {
        localizacao: 'Depósito A',
        conservacao: 'novo' as const,
        status: 'entrada' as const,
        preco: 1500,
        observacoes: 'Test',
        dataAquisicao: '2024-01-15',
      };

      const existentes: PatrimonioIndividual[] = [];

      const result = await addPatrimonioIndividualFirestore(
        modelo,
        data,
        existentes
      );

      expect(result.id).toBe('00001');
      expect(result.modeloId).toBe('modelo1');
      expect(result.localizacao).toBe('Depósito A');

      expect(mockFirebase.setDoc).toHaveBeenCalled();
      expect(mockFirebase.updateDoc).toHaveBeenCalled();
    });

    it('should handle missing optional fields with defaults', async () => {
      const modelo: ModeloPatrimonial = {
        id: 'modelo1',
        nome: 'Notebook Dell',
        marca: 'Dell',
        modelo: 'Inspiron 15',
        categoria: 'Informática',
        unidade: 'Unidade',
        criador: 'admin',
        createdAt: '2024-01-01',
        ultimaAtualizacao: '2024-01-01',
      };

      const data = {};

      const existentes: PatrimonioIndividual[] = [];

      const result = await addPatrimonioIndividualFirestore(
        modelo,
        data,
        existentes
      );

      expect(result.localizacao).toBe('Depósito');
      expect(result.conservacao).toBe('novo');
      expect(result.status).toBe('entrada');
      expect(result.preco).toBe(0);
      expect(result.observacoes).toBe('-');
    });
  });

  describe('editPatrimonioIndividualFirestore', () => {
    it('should edit patrimonio successfully', async () => {
      const id = '00001';

      mockData.patrimonioIndividual = {
        '00001': {
          id: '00001',
          modeloId: 'modelo1',
          localizacao: 'Depósito A',
          conservacao: 'novo',
          status: 'entrada',
          preco: 1500,
        },
      };

      const updates = {
        localizacao: 'Depósito B',
        conservacao: 'bom' as const,
      };

      const result = await editPatrimonioIndividualFirestore(
        id,
        updates
      );

      expect(result.localizacao).toBe('Depósito B');
      expect(result.conservacao).toBe('bom');

      expect(mockFirebase.updateDoc).toHaveBeenCalled();
    });

    it('should throw error when patrimonio not found', async () => {
      mockData.patrimonioIndividual = {};

      const updates = {
        localizacao: 'Depósito B',
      };

      await expect(
        editPatrimonioIndividualFirestore('00001', updates)
      ).rejects.toThrow('Patrimônio não encontrado.');
    });
  });

  describe('deletePatrimonioIndividualFirestore', () => {
    it('should delete patrimonio successfully', async () => {
      const id = '00001';
      const modeloId = 'modelo1';

      mockData.patrimonioIndividual = {
        '00001': {
          id: '00001',
          modeloId: 'modelo1',
        },
      };

      await deletePatrimonioIndividualFirestore(id, modeloId);

      expect(mockFirebase.deleteDoc).toHaveBeenCalled();
      expect(mockFirebase.updateDoc).toHaveBeenCalled();
    });

    it('should throw error when patrimonio not found', async () => {
      mockData.patrimonioIndividual = {};

      await expect(
        deletePatrimonioIndividualFirestore('00001', 'modelo1')
      ).rejects.toThrow('Patrimônio não encontrado.');
    });
  });

  describe('getInitialDataFirestore', () => {
    it('should return empty arrays when no data exists', async () => {
      mockData.modelos = {};
      mockData.patrimonioIndividual = {};

      const result = await getInitialDataFirestore();

      expect(result.initialModelos).toEqual([]);
      expect(result.initialPatrimonios).toEqual([]);
    });

    it('should return data when collections exist', async () => {
      mockData.modelos = {
        modelo1: {
          nome: 'Notebook',
          marca: 'Dell',
        },
      };

      mockData.patrimonioIndividual = {
        '00001': {
          id: '00001',
          modeloId: 'modelo1',
          localizacao: 'A',
          conservacao: 'novo',
          status: 'entrada',
          inventariante: 'Test',
          dataAquisicao: '2024-01-01',
          ultimaAtualizacao: '2024-01-01',
        },
      };

      const result = await getInitialDataFirestore();

      expect(result.initialModelos).toHaveLength(1);
      expect(result.initialPatrimonios).toHaveLength(1);
    });
  });
});
