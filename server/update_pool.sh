#!/bin/bash

# Update all remaining pool.getConnection() calls to use getPool()

# Update bidController.js
sed -i 's/const connection = await pool\.getConnection();/const pool = getPool();\n    const connection = await pool.getConnection();/g' controllers/bidController.js

# Update authController.js
sed -i 's/const connection = await pool\.getConnection();/const pool = getPool();\n    const connection = await pool.getConnection();/g' controllers/authController.js

# Update auth.js middleware
sed -i 's/const connection = await pool\.getConnection();/const pool = getPool();\n    const connection = await pool.getConnection();/g' middleware/auth.js

echo "Updated all pool.getConnection() calls to use getPool()" 