import pool from '../../config/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { startDate, endDate } = query

    let sql = 'SELECT * FROM diaries'
    let params = []

    if (startDate && endDate) {
      sql += ' WHERE date BETWEEN ? AND ?'
      params = [startDate, endDate]
    }

    sql += ' ORDER BY date DESC'

    const [rows] = await pool.execute(sql, params)
    return { success: true, data: rows }
  } catch (error) {
    console.error('獲取日記範圍失敗:', error)
    return { success: false, error: error.message }
  }
})