-- 游戏房间表
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
);

-- 房间状态表（用于实时同步）
CREATE TABLE IF NOT EXISTS room_states (
  room_code TEXT PRIMARY KEY,
  board_state JSONB,
  current_turn TEXT,
  white_trophies INTEGER,
  black_trophies INTEGER,
  winner TEXT,
  last_move JSONB,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_game_rooms_room_code ON game_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_room_states_updated_at ON room_states(updated_at);

-- 插入一些示例数据（可选）
INSERT INTO game_rooms (room_code, status) VALUES ('DEMO123', 'waiting') ON CONFLICT (room_code) DO NOTHING;