# TT Crew Core Library

This is the core business logic library for the TT Crew application. It provides a clean API for interacting with the database and managing game state.

## Installation

```bash
npm install @tt-crew/core
# or
yarn add @tt-crew/core
# or
pnpm add @tt-crew/core
```

## Usage

```typescript
import { TTGameCore } from '@tt-crew/core';

// Initialize the core library with database configuration
const gameCore = new TTGameCore({
  url: 'your-database-url',
  authToken: 'your-auth-token',
});

// Get all players
const players = await gameCore.getAllPlayers();

// Get active players
const activePlayers = await gameCore.getActivePlayers();

// Get a player by ID
const player = await gameCore.getPlayerById(1);

// Add a match
const match = await gameCore.addMatch({
  winnerId1: 1,
  winnerId2: 2, // Optional
  enteredBy: 1,
});

// Get a match by ID
const matchDetails = await gameCore.getMatchById(1);
```

## API Reference

### TTGameCore

The main class for interacting with the TT Crew game.

#### Constructor

```typescript
constructor(config: DatabaseConfig)
```

- `config`: Database configuration object
  - `url`: Database URL
  - `authToken`: Database authentication token

#### Methods

- `getAllPlayers(): Promise<Player[]>`
- `getActivePlayers(): Promise<Player[]>`
- `getPlayerById(id: number): Promise<Player | null>`
- `addMatch(input: AddMatchInput): Promise<Match>`
- `getMatchById(id: number): Promise<Match>`

### Models

#### Player

```typescript
interface Player {
  id: number;
  name: string;
  emoji: string | null;
  priority: number;
  status?: "ACTIVE" | "INACTIVE" | "HALL_OF_FAME";
  rating?: number;
}
```

#### Match

```typescript
interface Match {
  id: number;
  createdAt: Date;
  enteredBy: number;
  winners: Player[];
  losers?: Player[];
}
```

#### AddMatchInput

```typescript
interface AddMatchInput {
  winnerId1: number;
  winnerId2?: number;
  enteredBy: number;
}
``` 