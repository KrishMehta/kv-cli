import { Command } from 'commander';
import { CsvRepository } from './repository.js';
import { setupCli } from './cli.js';

const repository = new CsvRepository('data.csv');
const program = new Command();
setupCli(program, repository);
program.parse(); 