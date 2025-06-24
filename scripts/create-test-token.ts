import { resetTokens } from '../src/lib/temp-storage'

// إنشاء رمز تجريبي للاختبار
const testToken = 'test-token-123456789abcdef'

resetTokens[testToken] = {
  userId: 'test-user-id',
  expires: Date.now() + 15 * 60 * 1000, // 15 دقيقة
  used: false
}

console.log('✅ تم إنشاء رمز اختبار:', testToken)
console.log('🔗 رابط الاختبار:', `http://localhost:3000/reset-password?token=${testToken}`)
console.log('⏰ صالح حتى:', new Date(resetTokens[testToken].expires).toLocaleString('ar'))

export { testToken }
