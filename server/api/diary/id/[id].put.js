import pool from '../../../config/database'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id
    const body = await readBody(event)
    const { mood, content } = body


    if (!id) {
      return { success: false, error: '缺少日記 ID' }
    }

    if (!mood || !content) {
      return { success: false, error: '缺少必要欄位' }
    }

    const [result] = await pool.execute(
      'UPDATE diaries SET mood = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [mood, content, id]
    )

    if (result.affectedRows === 0) {
      return { success: false, error: '日記不存在' }
    }

    return { success: true }
  } catch (error) {
    console.error('更新日記失敗:', error)
    return { success: false, error: error.message }
  }
})