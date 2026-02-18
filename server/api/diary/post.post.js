import pool from '../../config/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { date, mood, content } = body

    console.log('新增日記:', { date, mood, content })

    if (!date || !mood || !content) {
      return { success: false, error: '缺少必要欄位' }
    }

    const formattedDate = date.split('T')[0]

    const [existing] = await pool.execute(
      'SELECT id FROM diaries WHERE DATE(date) = ?',
      [formattedDate]
    )
    
    if (existing.length > 0) {
      return { success: false, error: '該日期已有日記' }
    }

    const [result] = await pool.execute(
      'INSERT INTO diaries (date, mood, content) VALUES (?, ?, ?)',
      [formattedDate, mood, content]
    )

    const [newDiary] = await pool.execute(
      'SELECT * FROM diaries WHERE id = ?',
      [result.insertId]
    )

    return { 
      success: true, 
      data: newDiary[0]
    }
  } catch (error) {
    console.error('新增日記失敗:', error)
    return { success: false, error: error.message }
  }
})