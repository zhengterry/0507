const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { page = 1, size = 10, status, org_code, pipeline_id } = req.query;
    const offset = (page - 1) * size;
    
    let sql = 'SELECT * FROM ass_pipeline_task WHERE deleted = 0';
    let params = [];
    
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (org_code) {
      sql += ' AND org_code = ?';
      params.push(org_code);
    }
    if (pipeline_id) {
      sql += ' AND pipeline_id = ?';
      params.push(pipeline_id);
    }
    
    sql += ' ORDER BY gmt_create DESC LIMIT ? OFFSET ?';
    params.push(parseInt(size), parseInt(offset));
    
    const [rows] = await pool.query(sql, params);
    
    const countSql = sql.replace(/ORDER BY.*$/, '');
    const [countResult] = await pool.query(countSql.replace('SELECT *', 'SELECT COUNT(*) as total'), params.slice(0, -2));
    
    res.json({
      code: 200,
      data: {
        list: rows,
        total: countResult[0].total,
        page: parseInt(page),
        size: parseInt(size)
      },
      message: '查询成功'
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '查询失败', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM ass_pipeline_task WHERE id = ? AND deleted = 0', [id]);
    
    if (rows.length === 0) {
      return res.json({ code: 404, message: '记录不存在' });
    }
    
    res.json({ code: 200, data: rows[0], message: '查询成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '查询失败', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { 
      org_code, 
      pipeline_id, 
      dispatch_no, 
      dispatch_task_no, 
      status = '10', 
      remark, 
      creator, 
      creator_login_mobile, 
      tenant_id,
      line_name 
    } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO ass_pipeline_task (org_code, pipeline_id, dispatch_no, dispatch_task_no, status, remark, creator, creator_login_mobile, tenant_id, line_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [org_code, pipeline_id, dispatch_no, dispatch_task_no, status, remark, creator, creator_login_mobile, tenant_id, line_name]
    );
    
    res.json({ code: 200, data: { id: result.insertId }, message: '新增成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '新增失败', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      org_code, 
      pipeline_id, 
      dispatch_no, 
      dispatch_task_no, 
      status, 
      remark, 
      modifier, 
      modifier_login_mobile, 
      tenant_id,
      line_name 
    } = req.body;
    
    const [result] = await pool.query(
      'UPDATE ass_pipeline_task SET org_code = ?, pipeline_id = ?, dispatch_no = ?, dispatch_task_no = ?, status = ?, remark = ?, modifier = ?, modifier_login_mobile = ?, tenant_id = ?, line_name = ? WHERE id = ? AND deleted = 0',
      [org_code, pipeline_id, dispatch_no, dispatch_task_no, status, remark, modifier, modifier_login_mobile, tenant_id, line_name, id]
    );
    
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '记录不存在' });
    }
    
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '更新失败', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      'UPDATE ass_pipeline_task SET deleted = 1 WHERE id = ? AND deleted = 0',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.json({ code: 404, message: '记录不存在' });
    }
    
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '删除失败', error: error.message });
  }
});

module.exports = router;