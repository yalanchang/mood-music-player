import pool from '../../../config/database'

export default defineEventHandler(async (event) => {
  try {
    const date = event.context.params.date

    if (!date) {
      return { success: false, error: '缺少日期參數' }
    }

    const formattedDate = date.split('T')[0]

    const [rows] = await pool.execute(
      'SELECT * FROM diaries WHERE DATE(date) = ?',
      [formattedDate]
    )

    return { 
      success: true, 
      data: rows.length > 0 ? rows[0] : null 
    }
  } catch (error) {
    console.error('查詢日記失敗:', error)
    return { success: false, error: error.message }
  }
})