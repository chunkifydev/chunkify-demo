// scripts/init-db.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, '../db/sqlite.db');

function initDatabase() {
    try {
        if (!fs.existsSync(dbPath)) {
            console.log('Database not found. Initializing...');
            execSync('npx drizzle-kit push', { stdio: 'inherit' });
            console.log('Database initialized successfully!');
        } else {
            console.log('Database already exists, skipping initialization.');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDatabase();
