const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  try {
    // Array of migration files in order
    const migrationFiles = [
      '001_create_tables.sql',
      '002_seed_users.sql'
    ];

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const migrationFile = path.join(__dirname, '../../migrations', file);
      const sql = fs.readFileSync(migrationFile, 'utf8');
      await pool.query(sql);
      console.log(`Completed migration: ${file}`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = runMigrations; 