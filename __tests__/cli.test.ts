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
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock process.exit to prevent Jest from hanging
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    
    // Create a new program instance
    program = new Command();
    
    // Get the mocked repository instance
    mockRepository = new CsvRepository('test.csv') as jest.Mocked<CsvRepository>;
    
    // Setup CLI with mocked repository
    setupCli(program, mockRepository);
  });

  afterEach(() => {
    exitSpy.mockRestore();
  });

  describe('create command', () => {
    it('should call repository.create with correct parameters and exit with 0', async () => {
      mockRepository.create.mockResolvedValue();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      try {
        await program.parseAsync(['node', 'test', 'create', 'u123', 'Ada Lovelace']);
      } catch (error) {
        expect((error as Error).message).toBe('process.exit called');
      }

      expect(mockRepository.create).toHaveBeenCalledWith('u123', 'Ada Lovelace');
      expect(consoleSpy).toHaveBeenCalledWith('Created entry for Ada Lovelace');
      expect(exitSpy).toHaveBeenCalledWith(0);
      consoleSpy.mockRestore();
    });

    it('should handle create command with quoted name and exit with 0', async () => {
      mockRepository.create.mockResolvedValue();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      try {
        await program.parseAsync(['node', 'test', 'create', 'u456', 'John "Johnny" Doe']);
      } catch (error) {
        expect((error as Error).message).toBe('process.exit called');
      }

      expect(mockRepository.create).toHaveBeenCalledWith('u456', 'John "Johnny" Doe');
      expect(consoleSpy).toHaveBeenCalledWith('Created entry for John "Johnny" Doe');
      expect(exitSpy).toHaveBeenCalledWith(0);
      consoleSpy.mockRestore();
    });

    it('should handle create error and exit with 1', async () => {
      mockRepository.create.mockRejectedValue(new Error('Database error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      try {
        await program.parseAsync(['node', 'test', 'create', 'u123', 'Ada Lovelace']);
      } catch (error) {
        expect((error as Error).message).toBe('process.exit called');
      }

      expect(mockRepository.create).toHaveBeenCalledWith('u123', 'Ada Lovelace');
      expect(consoleSpy).toHaveBeenCalledWith('Error creating entry:', 'Database error');
      expect(exitSpy).toHaveBeenCalledWith(1);
      consoleSpy.mockRestore();
    });
  });

  describe('find command', () => {
    it('should call repository.find with correct id, output result, and exit with 0', async () => {
      mockRepository.find.mockResolvedValue('Ada Lovelace');
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      try {
        await program.parseAsync(['node', 'test', 'find', 'u123']);
      } catch (error) {
        expect((error as Error).message).toBe('process.exit called');
      }

      expect(mockRepository.find).toHaveBeenCalledWith('u123');
      expect(consoleSpy).toHaveBeenCalledWith('Ada Lovelace');
      expect(exitSpy).toHaveBeenCalledWith(0);
      consoleSpy.mockRestore();
    });

    it('should handle find when name is not found and exit with 1', async () => {
      mockRepository.find.mockResolvedValue(undefined);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      try {
        await program.parseAsync(['node', 'test', 'find', 'u999']);
      } catch (error) {
        expect((error as Error).message).toBe('process.exit called');
      }

      expect(mockRepository.find).toHaveBeenCalledWith('u999');
      expect(consoleSpy).toHaveBeenCalledWith('No entry found for id: u999');
      expect(exitSpy).toHaveBeenCalledWith(1);
      consoleSpy.mockRestore();
    });

    it('should handle find error and exit with 1', async () => {
      mockRepository.find.mockRejectedValue(new Error('Database error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      try {
        await program.parseAsync(['node', 'test', 'find', 'u123']);
      } catch (error) {
        expect((error as Error).message).toBe('process.exit called');
      }

      expect(mockRepository.find).toHaveBeenCalledWith('u123');
      expect(consoleSpy).toHaveBeenCalledWith('Error finding entry:', 'Database error');
      expect(exitSpy).toHaveBeenCalledWith(1);
      consoleSpy.mockRestore();
    });
  });
}); 