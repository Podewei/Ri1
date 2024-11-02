const http = require('http');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
    host: 'junction.proxy.rlwy.net',
    user: 'root',
    password: 'NFZdeIKmrayLyaYvWXxjeKbEPUJiZrZN', 
    port: 22575,
    database: 'railway',
    authPlugins: {mysql_native_password: true}
});

// 创建服务器
const server = http.createServer((req, res) => {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 设置请求的静态文件路径
    let filePath = '';
    const ext = path.extname(req.url) || '.html'; // 默认返回 HTML 文件

    if (req.url === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else if (req.url === '/questions.html') {
        filePath = path.join(__dirname, 'questions.html');
    } else if (req.url === '/question.css') {
        filePath = path.join(__dirname, 'question.css');
    } else if (req.url === '/stride.jpg') {
        filePath = path.join(__dirname, 'stride.jpg');
    } else if (req.url === '/main.js') {  // 添加 main.js
        filePath = path.join(__dirname, 'main.js');
    } else if (req.url === '/main.css') { // 添加 main.css
        filePath = path.join(__dirname, 'main.css');
    } else {
        // 如果找不到文件，返回 404
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({ error: 'Not Found' }));
        res.end();
        return;
    }

    // 读取静态文件
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify({ error: 'Internal Server Error' }));
            res.end();
        } else {
            const contentType = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.jpg': 'image/jpeg',
                '.js': 'application/javascript',
            }[ext] || 'application/octet-stream';
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.end(data);
        }
    });

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
                            return; // 确保不继续执行
                        } else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.write(JSON.stringify({ questions: results }));
                            res.end();
                            return; // 确保不继续执行
                        }
                    });
                } else {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.write(JSON.stringify({ error: 'Invalid message format.' }));
                    res.end();
                    return; // 确保不继续执行
                }
            } catch (error) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify({ error: 'Invalid JSON format.' }));
                res.end();
                return; // 确保不继续执行
            }
        });
    }
});

// 连接到数据库并启动服务器
connection.connect(dbErr => {
    if (dbErr) {
        console.error('Database connection error:', dbErr);
        return;
    }
    console.log('Connected to MySQL database.');
    server.listen(process.env.PORT || 3000, () => {
        console.log(`Server started on port ${process.env.PORT || 3000}...`);
    });
});
