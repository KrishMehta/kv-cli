import { Command } from 'commander';
import { KeyValueRepository } from './repository.js';

export function setupCli(program: Command, repository: KeyValueRepository): void {
  program
    .name('kv-cli')
    .description('A minimal CLI app for key-value storage in CSV format')
    .version('1.0.0');

  program
    .command('create')
    .description('Create a new key-value entry')
    .argument('<id>', 'The unique identifier')
    .argument('<name>', 'The name to associate with the id')
    .action(async (id: string, name: string) => {
      try {
        await repository.create(id, name);
        console.log(`Created entry for ${name}`);
        process.exit(0);
      } catch (error) {
        console.error('Error creating entry:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  program
    .command('find')
    .description('Find a name by id')
    .argument('<id>', 'The unique identifier to search for')
    .action(async (id: string) => {
      try {
        const name = await repository.find(id);
        if (name) {
          console.log(name);
          process.exit(0);
        } else {
          console.error(`No entry found for id: ${id}`);
          process.exit(1);
        }
      } catch (error) {
        console.error('Error finding entry:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });
} 