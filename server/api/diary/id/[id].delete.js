import pool from '../../../config/database'

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id

    if (!id) {
      return { success: false, error: '缺少日記 ID' }
    }

    const [result] = await pool.execute(
      'DELETE FROM diaries WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return { success: false, error: '日記不存在' }
    }

    return { success: true }
  } catch (error) {
    console.error('刪除日記失敗:', error)
    return { success: false, error: error.message }
  }
})