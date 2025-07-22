# kv-cli

A minimal Node.js + TypeScript CLI app for key-value storage in CSV format, built with test-driven development.

## Features

- **Create entries**: Add new key-value pairs to the CSV storage
- **Find entries**: Retrieve values by their unique identifier
- **CSV persistence**: Data is stored in a simple CSV file (`data.csv`)
- **TypeScript**: Fully typed codebase
- **Test coverage**: Comprehensive unit and integration tests

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kv-cli
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode

Run the CLI in development mode using tsx:

```bash
npm run dev -- <command> [options]
```

### Commands

#### Create a new entry
```bash
npm run dev -- create <id> <name>
```

**Examples:**
```bash
npm run dev -- create u123 "Ada Lovelace"
npm run dev -- create u456 "John Doe"
```

**Output:**
```
Created entry for Ada Lovelace
```

#### Find an entry by ID
```bash
npm run dev -- find <id>
```

**Examples:**
```bash
npm run dev -- find u123
npm run dev -- find u999
```

**Output (found):**
```
Ada Lovelace
```

**Output (not found):**
```
No entry found for id: u999
```

### Exit Codes

- `0`: Success
- `1`: Error (entry not found, database error, etc.)

## Development

### Scripts

- `npm run dev`: Run the CLI in development mode
- `npm run build`: Build the TypeScript code
- `npm test`: Run tests with coverage
- `npm run lint`: Run ESLint

### Project Structure

```
kv-cli/
├── package.json
├── tsconfig.json
├── jest.config.js
├── data.csv                # Created on first write
├── src/
│   ├── main.ts             # CLI entry point
│   ├── cli.ts              # Commander setup
│   ├── repository.ts       # CSV read/write logic
└── __tests__/
    ├── repository.test.ts  # Unit tests for repository
    └── cli.test.ts         # Integration tests for CLI
```

### Architecture

The application follows a clean architecture pattern:

1. **Repository Layer** (`repository.ts`): Handles CSV file I/O operations
2. **CLI Layer** (`cli.ts`): Manages command parsing and user interaction
4. **Main Entry** (`main.ts`): Application bootstrap

### Testing

The project uses Jest with ts-jest for TypeScript testing:

- **Repository Tests**: Unit tests for CSV operations using mocked file system
- **CLI Tests**: Integration tests for command behavior using mocked repository

Run tests with coverage:
```bash
npm test
```

## Data Format

Data is stored in `data.csv` with the following format:
```csv
id,name
u123,Ada Lovelace
u456,John Doe
```

## Dependencies

- **commander**: CLI argument parsing
- **tsx**: TypeScript execution in development
- **jest**: Testing framework
- **ts-jest**: TypeScript support for Jest
- **typescript**: TypeScript compiler

## License

MIT 