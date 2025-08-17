# Strategic Chess Board Game - Project Overview

## Project Description

A strategic chess variant played on a 6×6 grid where pieces are positioned on intersection points, creating a 7×7 grid of playable positions (49 total positions). The game combines traditional chess mechanics with unique hero abilities, piece conversion systems, and multiple victory conditions.

## Core Game Concept

### Board Layout
- **Grid Size**: 6×6 squares with 7×7 intersection points
- **Total Positions**: 49 playable positions
- **Piece Placement**: All pieces move and attack from intersection points

### Game Modes
- **Single Player**: Local gameplay against AI or practice mode
- **Multiplayer**: Real-time online gameplay with room-based matchmaking

## Game Flow Architecture

### 1. Game Mode Selection
Players choose between single player or multiplayer modes

### 2. Room Management (Multiplayer)
- **Room Creation**: Host creates a game room
- **Room Joining**: Second player joins existing room
- **Room State**: Tracks player connections and game status

### 3. Hero Selection Phase
- **Requirement**: Both players must select heroes before game starts
- **Hero Pool**: 6 historical commanders available
- **Blocking**: Game cannot proceed until both selections are complete

### 4. Active Gameplay
- **Turn System**: White and Black players alternate
- **Permissions**: Color-based move validation
- **Real-time Sync**: All moves synchronized between players instantly

## Hero System

### Available Heroes

#### 1. Alexander the Great
- **Starting Bonus**: 3 trophy points
- **Specialties**: Cavalry tactics, phalanx formations
- **Historical Theme**: Macedonian military strategy

#### 2. Genghis Khan
- **Specialties**: Enhanced horse/elephant mechanics
- **Abilities**: Stealth and mobility-focused powers
- **Historical Theme**: Mongol cavalry warfare

#### 3. Napoleon Bonaparte
- **Specialties**: Respawn mechanics, enhanced artillery
- **Abilities**: Strategic positioning and firepower
- **Historical Theme**: European military innovation

#### 4. George Washington
- **Unique Feature**: Commander/President conversion ability
- **Specialties**: Tactical positioning and leadership
- **Historical Theme**: Revolutionary War strategy

#### 5. Anne Bonny
- **Unique Feature**: Ship mechanics integration
- **Specialties**: Piracy abilities and naval tactics
- **Historical Theme**: Golden Age of Piracy

#### 6. Che Guevara
- **Unique Feature**: Revolutionary marks system
- **Specialties**: Guerrilla warfare tactics
- **Historical Theme**: Revolutionary strategy

## Piece System

### Core Pieces

#### Commander (1x)
- **Movement**: 1 block in any direction
- **Attack**: 1 block in any direction
- **Special**: Game ends when defeated

#### Soldier (7x)
- **Movement**: 1 block forward
- **Attack**: 1 block diagonally forward
- **Special**: Can move sideways when at midline

### Convertible Piece Pairs

#### Horse ↔ Elephant
- **Horse**
  - Movement: L-shaped (2×1 blocks in any direction)
  - Attack: Same as movement
- **Elephant**
  - Movement: 2 blocks in any direction
  - Attack: Same as movement
  - Bonus: +1 trophy point when defeating pieces

#### Guard ↔ Raider
- **Guard**
  - Movement: 1 block in any direction
  - Attack: Same as movement
  - Special: Invincible when in home 2 rows
- **Raider**
  - Movement: 1 block along grid lines OR any distance diagonally
  - Attack: Same as movement

#### Tower ↔ Artillery
- **Tower**
  - Movement: Any distance along grid lines (horizontal/vertical)
  - Attack: Same as movement
- **Artillery**
  - Movement: Any distance along grid lines
  - Attack: Any distance in any direction (requires one piece between attacker and target)

## Victory Conditions

### Primary Win Conditions
1. **Checkmate**: Defeat opponent's Commander with no escape
2. **Trophy Victory**: Accumulate 21 trophy points

### Trophy Point System
- **Soldier Defeat**: 1 point
- **Other Piece Defeat**: 2 points (excluding Soldier and Commander)
- **Midline Trophy Point**: 1 point (first to reach)
- **Turn Order Bonus**: 1 point (second player starts with this)

## Technical Features

### Real-time Synchronization
- **Move Validation**: Server-side validation with client prediction
- **State Management**: Consistent game state across all clients
- **Connection Handling**: Robust disconnect/reconnect support

### Conversion Mechanics
- **Turn Cost**: 1 full turn to convert between piece types
- **Strategic Depth**: Adds tactical layer to piece positioning
- **Reversible**: All conversions work both ways

### Ability System Integration
- **Passive Abilities**: Always active hero bonuses
- **Active Abilities**: Unlockable powers based on trophy accumulation
- **Cooldown Management**: Strategic timing of ability usage

## Game Design Philosophy

### Strategic Depth
- Multiple paths to victory encourage diverse strategies
- Piece conversion adds tactical complexity
- Hero abilities provide unique gameplay styles

### Accessibility
- Familiar chess-like mechanics for easy learning
- Visual indicators for valid moves and abilities
- Clear win condition tracking

### Competitive Balance
- Hero abilities balanced around risk/reward
- Multiple victory conditions prevent single-strategy dominance
- Turn-based system ensures fair play opportunities