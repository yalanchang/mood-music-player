import pool from '../../../config/database'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id

    if (!id) {
      return { success: false, error: '缺少日記 ID' }
    }

    const [rows] = await pool.execute(
      'SELECT * FROM diaries WHERE id = ?',
      [id]
    )

    return { 
      success: true, 
      data: rows.length > 0 ? rows[0] : null 
    }
  } catch (error) {
    console.error('獲取日記失敗:', error)
    return { success: false, error: error.message }
  }
})