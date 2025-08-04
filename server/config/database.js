import mysql from 'mysql2/promise';

// Get database configuration dynamically
const getDbConfig = () => ({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'workirkl_wp594',
  password: process.env.DB_PASSWORD || 'admin@workvix',
  database: process.env.DB_NAME || 'workirkl_workvix_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
});

// Create connection pool
let pool = null;

const getPool = () => {
  if (!pool) {
    const dbConfig = getDbConfig();
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Test database connection
const testConnection = async () => {
  try {
    const dbConfig = getDbConfig();
    const pool = getPool();
    
    console.log('🔍 Attempting to connect to database...');
    console.log('📊 Database config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Full error details:', error);
    return false;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('client', 'freelancer', 'admin') NOT NULL DEFAULT 'client',
        avatar_url VARCHAR(500),
        bio TEXT,
        skills JSON,
        hourly_rate DECIMAL(10,2),
        rating DECIMAL(3,2) DEFAULT 0.00,
        total_earnings DECIMAL(12,2) DEFAULT 0.00,
        completed_jobs INT DEFAULT 0,
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_created_at (created_at)
      )
    `);

    // Jobs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(36) PRIMARY KEY,
        client_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        budget DECIMAL(10,2) NOT NULL,
        min_budget DECIMAL(10,2),
        max_budget DECIMAL(10,2),
        status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
        deadline DATE,
        skills_required JSON,
        attachments JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_client_id (client_id),
        INDEX idx_status (status),
        INDEX idx_category (category),
        INDEX idx_created_at (created_at)
      )
    `);

    // Bids table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bids (
        id VARCHAR(36) PRIMARY KEY,
        job_id VARCHAR(36) NOT NULL,
        freelancer_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        proposal TEXT NOT NULL,
        delivery_time INT NOT NULL COMMENT 'Days to complete',
        status ENUM('pending', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_job_id (job_id),
        INDEX idx_freelancer_id (freelancer_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `);

    // Orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        job_id VARCHAR(36) NOT NULL,
        bid_id VARCHAR(36) NOT NULL,
        client_id VARCHAR(36) NOT NULL,
        freelancer_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'in_progress', 'completed', 'cancelled', 'disputed') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        started_at TIMESTAMP NULL,
        completed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_client_id (client_id),
        INDEX idx_freelancer_id (freelancer_id),
        INDEX idx_status (status),
        INDEX idx_payment_status (payment_status),
        INDEX idx_created_at (created_at)
      )
    `);

    // Notifications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        job_id VARCHAR(36),
        bid_id VARCHAR(36),
        order_id VARCHAR(36),
        chat_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_read (read),
        INDEX idx_created_at (created_at)
      )
    `);

    // Chat rooms table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS chat_rooms (
        id VARCHAR(36) PRIMARY KEY,
        job_id VARCHAR(36),
        client_id VARCHAR(36) NOT NULL,
        freelancer_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_client_id (client_id),
        INDEX idx_freelancer_id (freelancer_id),
        INDEX idx_job_id (job_id)
      )
    `);

    // Chat messages table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(36) PRIMARY KEY,
        chat_room_id VARCHAR(36) NOT NULL,
        sender_id VARCHAR(36) NOT NULL,
        message TEXT NOT NULL,
        message_type ENUM('text', 'file', 'image') DEFAULT 'text',
        file_url VARCHAR(500),
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_chat_room_id (chat_room_id),
        INDEX idx_sender_id (sender_id),
        INDEX idx_created_at (created_at)
      )
    `);

    // Payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        transaction_id VARCHAR(255),
        gateway_response JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_order_id (order_id),
        INDEX idx_payment_status (payment_status),
        INDEX idx_created_at (created_at)
      )
    `);

    connection.release();
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export { getPool, testConnection, initializeDatabase }; 