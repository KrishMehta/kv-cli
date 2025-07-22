import { readFile, appendFile } from 'fs/promises';

export interface KeyValueRepository {
  create(id: string, name: string): Promise<void>;
  find(id: string): Promise<string | undefined>;
}

export class CsvRepository implements KeyValueRepository {
  constructor(private filePath: string) {}

  async create(id: string, name: string): Promise<void> {
    const row = `${id},${name}\n`;
    await appendFile(this.filePath, row);
  }

  async find(id: string): Promise<string | undefined> {
    try {
      const content = await readFile(this.filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        const [lineId, ...nameParts] = line.split(',');
        if (lineId === id) {
          return nameParts.join(','); // Rejoin in case name contains commas
        }
      }
      
      return undefined;
    } catch (error) {
      // If file doesn't exist or can't be read, return undefined
      return undefined;
    }
  }
} 