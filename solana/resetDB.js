require('dotenv').config();

const sqlite3 = require('sqlite3').verbose()
const fs = require('fs').promises;
const path = require('path');

const SQLITEDB = process.env.SQLITEDB;

async function resetDatabase() {
    const dbPath = path.join(__dirname, SQLITEDB);

    try {
        // 检查文件是否存在
        await fs.access(dbPath);
        console.log(`找到现有的 ${SQLITEDB} 文件`);

        // 文件存在，删除它
        await fs.unlink(dbPath);
        console.log(`已删除现有的 ${SQLITEDB} 文件`);
    } catch (error) {
        // 文件不存在，忽略错误
        if (error.code !== 'ENOENT') {
            console.error('检查或删除文件时出错:', error.message);
            return;
        }
    }

    try {
        // 创建新的空文件
        await fs.writeFile(dbPath, '');
        console.log(`已创建新的${SQLITEDB} 文件`);
    } catch (error) {
        console.error('创建新文件时出错:', error.message);
    }
}

resetDatabase();
