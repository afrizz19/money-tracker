import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'moneytracker',
    password: process.env.DB_PASSWORD || 'moneytracker123',
    database: process.env.DB_NAME || 'money_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

let pool: mysql.Pool | null = null;

export async function getConnection() {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

export async function query(sql: string, params?: any[]) {
    const connection = await getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
}

export async function closeConnection() {
    if (pool) {
        await pool.end();
        pool = null;
    }
} 