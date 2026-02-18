import pool from '../../config/database'

export default defineEventHandler(async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM diaries ORDER BY date DESC'
    )
    return { success: true, data: rows }
  } catch (error) {
    console.error('獲取日記失敗:', error)
    return { success: false, error: error.message }
  }
})