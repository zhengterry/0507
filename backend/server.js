const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pipelineTaskRoutes = require('./routes/pipelineTask');
const pool = require('./config/db');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/pipeline-task', pipelineTaskRoutes);

app.get('/', (req, res) => {
  res.send('流水线任务管理系统后端服务');
});

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
    
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    process.exit(1);
  }
}

startServer();