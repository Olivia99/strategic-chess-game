// Database initialization script for deployment
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Create game_rooms table
    await sql`
      CREATE TABLE IF NOT EXISTS game_rooms (
        id SERIAL PRIMARY KEY,
        room_code TEXT UNIQUE NOT NULL,
        white_player_id TEXT,
        black_player_id TEXT,
        white_hero TEXT,
        black_hero TEXT,
        status TEXT DEFAULT 'waiting',
        board_state JSONB,
        current_turn TEXT DEFAULT 'white',
        white_trophies INTEGER DEFAULT 0,
        black_trophies INTEGER DEFAULT 0,
        winner TEXT,
        last_move JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create room_states table
    await sql`
      CREATE TABLE IF NOT EXISTS room_states (
        room_code TEXT PRIMARY KEY,
        board_state JSONB,
        current_turn TEXT,
        white_trophies INTEGER,
        black_trophies INTEGER,
        winner TEXT,
        last_move JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_game_rooms_room_code ON game_rooms(room_code)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_room_states_updated_at ON room_states(updated_at)`;

    // Insert demo data
    await sql`
      INSERT INTO game_rooms (room_code, status) VALUES ('DEMO123', 'waiting') 
      ON CONFLICT (room_code) DO NOTHING
    `;

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export default initializeDatabase;