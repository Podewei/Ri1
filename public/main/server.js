const http = require('http');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // 导入 path 模块以处理路径

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Cbzcbzcbz008625@',
    database: 'challenges_for_Big_love'
});

// 创建服务器
const server = http.createServer((req, res) => {
    const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5501'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 处理 favicon 请求
    if (req.url === '/favicon.ico') {
        const filePath = path.join(__dirname, 'stride.jpg'); // 确保路径正确
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                res.end(data);
            }
        });
        return;
    }

    // 处理 POST 请求
    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);

                if (parsedBody.message.startsWith('request ')) {
                    const n = parseInt(parsedBody.message.split(' ')[1]);
                    connection.query(`SELECT * FROM Question ORDER BY RAND() LIMIT ?`, [n], (err, results) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.write(JSON.stringify({ error: 'Database query error.' }));
                            res.end();
                        } else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.write(JSON.stringify({ questions: results }));
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
    server.listen(3000, () => {
        console.log('Server started on port 3000...');
    });
});
