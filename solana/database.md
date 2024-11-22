# 数据库

使用sqlite3 文件数据库

## 表结构

```
CREATE TABLE wallet (
    owner TEXT NOT NULL PRIMARY KEY,
    public_key TEXT NOT NULL,
    private_key TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 测试数据

```
INSERT INTO wallet (public_key, private_key, owner) VALUES
('0x123abc...', '0xprivate456...', 'Alice'),
('0x654mno...', '0xprivate654...', 'Eve');
```

## SQLite 基本命令

```
sqlite3 数据库文件名.db

.tables                  # 查看所有表
.schema 表名             # 查看表结构
SELECT * FROM 表名;      # 查看表的所有数据
.headers on              # 显示列名
.mode column            # 按列对齐显示
.quit                   # 退出
```
