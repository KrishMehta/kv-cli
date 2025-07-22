import { Command } from 'commander';
import { CsvRepository } from '../src/repository';
import { setupCli } from '../src/cli';

// Mock the repository
jest.mock('../src/repository', () => ({
  CsvRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    find: jest.fn(),
  })),
}));

describe('CLI Integration Tests', () => {
  let program: Command;
  let mockRepository: jest.Mocked<CsvRepository>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new program instance
    program = new Command();
    
    // Get the mocked repository instance
    mockRepository = new CsvRepository('test.csv') as jest.Mocked<CsvRepository>;
    
    // Setup CLI with mocked repository
    setupCli(program, mockRepository);
  });

  describe('create command', () => {
    it('should call repository.create with correct parameters', async () => {
      mockRepository.create.mockResolvedValue();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await program.parseAsync(['node', 'test', 'create', 'u123', 'Ada Lovelace']);

      expect(mockRepository.create).toHaveBeenCalledWith('u123', 'Ada Lovelace');
      expect(consoleSpy).toHaveBeenCalledWith('Created entry for Ada Lovelace');
      consoleSpy.mockRestore();
    });

    it('should handle create command with quoted name', async () => {
      mockRepository.create.mockResolvedValue();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await program.parseAsync(['node', 'test', 'create', 'u456', 'John "Johnny" Doe']);

      expect(mockRepository.create).toHaveBeenCalledWith('u456', 'John "Johnny" Doe');
      expect(consoleSpy).toHaveBeenCalledWith('Created entry for John "Johnny" Doe');
      consoleSpy.mockRestore();
    });

    it('should handle create error', async () => {
      mockRepository.create.mockRejectedValue(new Error('Database error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await program.parseAsync(['node', 'test', 'create', 'u123', 'Ada Lovelace']);

      expect(mockRepository.create).toHaveBeenCalledWith('u123', 'Ada Lovelace');
      expect(consoleSpy).toHaveBeenCalledWith('Error creating entry:', 'Database error');
      consoleSpy.mockRestore();
    });
  });

  describe('find command', () => {
    it('should call repository.find with correct id and output result', async () => {
      mockRepository.find.mockResolvedValue('Ada Lovelace');
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await program.parseAsync(['node', 'test', 'find', 'u123']);

      expect(mockRepository.find).toHaveBeenCalledWith('u123');
      expect(consoleSpy).toHaveBeenCalledWith('Ada Lovelace');
      consoleSpy.mockRestore();
    });

    it('should handle find when name is not found', async () => {
      mockRepository.find.mockResolvedValue(undefined);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await program.parseAsync(['node', 'test', 'find', 'u999']);

      expect(mockRepository.find).toHaveBeenCalledWith('u999');
      expect(consoleSpy).toHaveBeenCalledWith('No entry found for id: u999');
      consoleSpy.mockRestore();
    });

    it('should handle find error', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await program.parseAsync(['node', 'test', 'find', 'u123']);

      expect(mockRepository.find).toHaveBeenCalledWith('u123');
      expect(consoleSpy).toHaveBeenCalledWith('Error finding entry:', 'Database error');
      consoleSpy.mockRestore();
    });
  });
}); 