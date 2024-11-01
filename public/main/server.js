const http = require('http');
const mysql = require('mysql');
const cors = require('cors'); // cors 导入未使用，这里可以去掉
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // 替换为你的数据库用户名
    password: 'Cbzcbzcbz008625@', // 替换为你的数据库密码
    database: 'challenges_for_Big_love' // 确保此数据库已存在
});

// 创建服务器
const server = http.createServer((req, res) => {
    // 使用 CORS 处理请求
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // 允许特定来源
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 允许的请求方法
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 允许的请求头

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 处理 POST 请求
    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // 将数据块拼接到 body
        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body); // 解析 JSON 数据

                // 处理 "request n questions" 的请求
                if (parsedBody.message.startsWith('request ')) {
                    const n = parseInt(parsedBody.message.split(' ')[1]); // 从请求中提取数字 n

                    // 查询数据库中的随机 n 行
                    connection.query(`SELECT * FROM Question ORDER BY RAND() LIMIT ?`, [n], (err, results) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.write(JSON.stringify({ error: 'Database query error.' }));
                            res.end();
                        } else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.write(JSON.stringify({ questions: results })); // 返回随机问题
                            res.end();
                        }
                    });
                } else {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.write(JSON.stringify({ error: 'Invalid message format.' }));
                    res.end();
                }
            } catch (error) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify({ error: 'Invalid JSON format.' }));
                res.end();
            }
        });
    } else {
        // 处理其他请求，返回 404
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({ error: 'Not Found' }));
        res.end();
    }
});

// 连接到数据库并启动服务器
connection.connect(dbErr => {
    if (dbErr) {
        console.error('Database connection error:', dbErr);
        return;
    }
    console.log('Connected to MySQL database.');
    // 启动服务器
    server.listen(3000, () => {
        console.log('Server started on port 3000...');
    });
});
