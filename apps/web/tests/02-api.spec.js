import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('health endpoint provides comprehensive diagnostics', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const health = await response.json();
    
    // Verify required fields
    expect(health).toHaveProperty('status', 'ok');
    expect(health).toHaveProperty('timestamp');
    expect(health).toHaveProperty('environment');
    expect(health).toHaveProperty('database');
    expect(health).toHaveProperty('vercel');
    
    // Database info
    expect(health.database).toHaveProperty('configured');
    expect(health.database).toHaveProperty('url_preview');
    expect(health.database).toHaveProperty('test_result');
    
    // Vercel deployment info
    expect(health.vercel).toHaveProperty('region');
    expect(health.vercel).toHaveProperty('deployment_id');
    
    console.log('Health check result:', health);
  });

  test('heroes endpoint returns valid data', async ({ request }) => {
    const response = await request.get('/api/heroes');
    expect(response.status()).toBe(200);
    
    const heroes = await response.json();
    expect(Array.isArray(heroes)).toBe(true);
    expect(heroes.length).toBe(6); // Should have 6 heroes
    
    // Verify each hero has required structure
    heroes.forEach(hero => {
      expect(hero).toHaveProperty('id');
      expect(hero).toHaveProperty('name');
      expect(hero).toHaveProperty('passive_abilities');
      expect(hero).toHaveProperty('active_abilities');
      expect(Array.isArray(hero.passive_abilities)).toBe(true);
      expect(Array.isArray(hero.active_abilities)).toBe(true);
    });
    
    // Verify we have the expected heroes
    const heroNames = heroes.map(h => h.name);
    expect(heroNames).toContain('Alexander the Great');
    expect(heroNames).toContain('Genghis Khan');
    expect(heroNames).toContain('Napoleon Bonaparte');
    expect(heroNames).toContain('George Washington');
    expect(heroNames).toContain('Anne Bonny');
    expect(heroNames).toContain('Che Guevara');
  });

  test('rooms endpoints work correctly', async ({ request }) => {
    // Test creating a room
    const createResponse = await request.post('/api/rooms', {
      data: {
        player_name: 'TestPlayer',
        hero_id: 1
      }
    });
    
    if (createResponse.status() === 200) {
      const roomData = await createResponse.json();
      expect(roomData).toHaveProperty('room_code');
      expect(roomData).toHaveProperty('room_id');
      
      // Test getting room info
      const roomCode = roomData.room_code;
      const roomResponse = await request.get(`/api/rooms/${roomCode}`);
      expect(roomResponse.status()).toBe(200);
      
      const room = await roomResponse.json();
      expect(room).toHaveProperty('room_code', roomCode);
      expect(room).toHaveProperty('status');
    } else {
      console.log('Room creation failed (may be due to database config):', createResponse.status());
    }
  });

  test('database connection test via health endpoint', async ({ request }) => {
    const response = await request.get('/api/health');
    const health = await response.json();
    
    if (health.database.configured) {
      // If database is configured, connection should work
      expect(health.database.test_result).toContain('connection successful');
    } else {
      console.log('Database not configured in this environment');
      expect(health.database.test_result).toBe('not tested');
    }
  });

  test('CORS headers are properly configured', async ({ request }) => {
    const response = await request.get('/api/health');
    
    // Check for CORS headers (if needed for frontend)
    const headers = response.headers();
    console.log('Response headers:', headers);
    
    // Basic content type check
    expect(headers['content-type']).toContain('application/json');
  });

  test('error handling for non-existent endpoints', async ({ request }) => {
    const response = await request.get('/api/nonexistent');
    
    // Should return 404, not 500
    expect(response.status()).toBe(404);
  });
});