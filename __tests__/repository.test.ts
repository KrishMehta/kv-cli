import { vol } from 'memfs';
import { CsvRepository } from '../src/repository';

// Mock fs module
jest.mock('fs/promises', () => {
  const originalModule = jest.requireActual('fs/promises');
  return {
    ...originalModule,
    readFile: jest.fn(),
    appendFile: jest.fn(),
  };
});

describe('CsvRepository', () => {
  let repository: CsvRepository;
  const testFilePath = '/test/data.csv';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a fresh repository instance
    repository = new CsvRepository(testFilePath);
    
    // Set up memfs with empty file
    vol.reset();
    vol.mkdirSync('/test', { recursive: true });
    vol.writeFileSync(testFilePath, '');
  });

  describe('create', () => {
    it('should append a new row to the CSV file', async () => {
      const { appendFile } = require('fs/promises');
      
      await repository.create('u123', 'Ada Lovelace');
      
      expect(appendFile).toHaveBeenCalledWith(
        testFilePath,
        'u123,Ada Lovelace\n'
      );
    });

    it('should handle special characters in name', async () => {
      const { appendFile } = require('fs/promises');
      
      await repository.create('u456', 'John "Johnny" Doe');
      
      expect(appendFile).toHaveBeenCalledWith(
        testFilePath,
        'u456,John "Johnny" Doe\n'
      );
    });
  });

  describe('find', () => {
    it('should return the name for an existing id', async () => {
      const { readFile } = require('fs/promises');
      
      // Mock file content
      const fileContent = 'u123,Ada Lovelace\nu456,John Doe\nu789,Jane Smith\n';
      readFile.mockResolvedValue(fileContent);
      
      const result = await repository.find('u456');
      
      expect(readFile).toHaveBeenCalledWith(testFilePath, 'utf-8');
      expect(result).toBe('John Doe');
    });

    it('should return undefined for non-existing id', async () => {
      const { readFile } = require('fs/promises');
      
      // Mock file content
      const fileContent = 'u123,Ada Lovelace\nu456,John Doe\n';
      readFile.mockResolvedValue(fileContent);
      
      const result = await repository.find('u999');
      
      expect(readFile).toHaveBeenCalledWith(testFilePath, 'utf-8');
      expect(result).toBeUndefined();
    });

    it('should handle empty file', async () => {
      const { readFile } = require('fs/promises');
      
      // Mock empty file
      readFile.mockResolvedValue('');
      
      const result = await repository.find('u123');
      
      expect(readFile).toHaveBeenCalledWith(testFilePath, 'utf-8');
      expect(result).toBeUndefined();
    });

    it('should handle file with only newlines', async () => {
      const { readFile } = require('fs/promises');
      
      // Mock file with only newlines
      readFile.mockResolvedValue('\n\n');
      
      const result = await repository.find('u123');
      
      expect(readFile).toHaveBeenCalledWith(testFilePath, 'utf-8');
      expect(result).toBeUndefined();
    });

    it('should find the first occurrence if id appears multiple times', async () => {
      const { readFile } = require('fs/promises');
      
      // Mock file content with duplicate id
      const fileContent = 'u123,Ada Lovelace\nu123,Ada Updated\nu456,John Doe\n';
      readFile.mockResolvedValue(fileContent);
      
      const result = await repository.find('u123');
      
      expect(readFile).toHaveBeenCalledWith(testFilePath, 'utf-8');
      expect(result).toBe('Ada Lovelace');
    });
  });
}); 