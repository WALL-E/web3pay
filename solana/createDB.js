require('dotenv').config();

const sqlite3 = require('sqlite3').verbose()
const fs = require('fs').promises;
const path = require('path');

const SQLITEDB = process.env.SQLITEDB;

// 运行函数
(async () => {
    try {
        var db = new sqlite3.Database(
            SQLITEDB,
            sqlite3.OPEN_READWRITE,
            function (err) {
                if (err) {
                    return console.log(err.message)
                }
                console.log('connect database successfully')
            }
        )
        
	const sql = `CREATE TABLE wallet (
	        owner TEXT NOT NULL PRIMARY KEY,
	        publicKey TEXT NOT NULL,
	        privateKey TEXT NOT NULL,
	        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`
        db.run(sql, function (err) {
            if (err) {
                  return console.log(err)
            }
            console.log('create table wallet')
        })


        db.close(function (err) {
            if (err) {
                    return console.log(err.message)
            }
            console.log('close database connection')
        })

    } catch (error) {
        console.error('重置数据库时发生错误:', error);
    }
})();
