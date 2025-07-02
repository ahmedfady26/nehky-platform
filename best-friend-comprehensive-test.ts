/**
 * اختبارات شاملة لنظام النقاط التبادلية للأصدقاء المقربين
 * Best Friend Points System Comprehensive Tests
 */

import { BestFriendService } from '@/lib/bestfriend';
import {
  calculateBestFriendPoints,
  calculateRelationshipStrength,
  calculateProgressToNextLevel
} from '@/lib/bestfriend/points';
import { InteractionType, RelationshipStrength } from '@prisma/client';

// تعريف واجهة نتائج الاختبارات
interface TestResult {
  testName: string;
  passed: boolean;
  expected: any;
  actual: any;
  details?: string;
}

/**
 * تشغيل جميع الاختبارات
 */
export async function runBestFriendSystemTests(): Promise<{
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
}> {
  const results: TestResult[] = [];

  console.log('🧪 بدء اختبارات نظام الصديق الأفضل...\n');

  // اختبارات حساب النقاط الأساسية
  results.push(...await testBasicPointsCalculation());
  
  // اختبارات العوامل المضاعفة
  results.push(...await testMultiplierFactors());
  
  // اختبارات قوة العلاقة
  results.push(...await testRelationshipStrength());
  
  // اختبارات التقدم بين المستويات
  results.push(...await testProgressCalculation());
  
  // اختبارات السيناريوهات المتقدمة
  results.push(...await testAdvancedScenarios());

  // حساب النتائج الإجمالية
  const passedTests = results.filter(r => r.passed).length;
  const failedTests = results.filter(r => !r.passed).length;

  console.log(`\n📊 ملخص نتائج الاختبارات:`);
  console.log(`✅ نجح: ${passedTests} اختبار`);
  console.log(`❌ فشل: ${failedTests} اختبار`);
  console.log(`📈 معدل النجاح: ${((passedTests / results.length) * 100).toFixed(1)}%\n`);

  // عرض الاختبارات الفاشلة
  const failedResults = results.filter(r => !r.passed);
  if (failedResults.length > 0) {
    console.log('❌ الاختبارات الفاشلة:');
    failedResults.forEach(result => {
      console.log(`  - ${result.testName}`);
      console.log(`    المتوقع: ${JSON.stringify(result.expected)}`);
      console.log(`    الفعلي: ${JSON.stringify(result.actual)}`);
      if (result.details) console.log(`    التفاصيل: ${result.details}`);
    });
  }

  return {
    totalTests: results.length,
    passedTests,
    failedTests,
    results
  };
}

/**
 * اختبارات حساب النقاط الأساسية
 */
async function testBasicPointsCalculation(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('📝 اختبار حساب النقاط الأساسية...');

  // اختبار 1: إعجاب بسيط
  try {
    const likeResult = calculateBestFriendPoints(
      InteractionType.LIKE,
      'user1',
      'user2'
    );
    
    results.push({
      testName: 'حساب نقاط الإعجاب الأساسية',
      passed: likeResult.user1Points === 1,
      expected: 1,
      actual: likeResult.user1Points
    });
  } catch (error) {
    results.push({
      testName: 'حساب نقاط الإعجاب الأساسية',
      passed: false,
      expected: 1,
      actual: 'خطأ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  // اختبار 2: تعليق
  try {
    const commentResult = calculateBestFriendPoints(
      InteractionType.COMMENT,
      'user1',
      'user2'
    );
    
    results.push({
      testName: 'حساب نقاط التعليق الأساسية',
      passed: commentResult.user1Points === 3,
      expected: 3,
      actual: commentResult.user1Points
    });
  } catch (error) {
    results.push({
      testName: 'حساب نقاط التعليق الأساسية',
      passed: false,
      expected: 3,
      actual: 'خطأ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  // اختبار 3: مشاركة
  try {
    const shareResult = calculateBestFriendPoints(
      InteractionType.SHARE,
      'user1',
      'user2'
    );
    
    results.push({
      testName: 'حساب نقاط المشاركة الأساسية',
      passed: shareResult.user1Points === 5,
      expected: 5,
      actual: shareResult.user1Points
    });
  } catch (error) {
    results.push({
      testName: 'حساب نقاط المشاركة الأساسية',
      passed: false,
      expected: 5,
      actual: 'خطأ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  return results;
}

/**
 * اختبارات العوامل المضاعفة
 */
async function testMultiplierFactors(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('⚡ اختبار العوامل المضاعفة...');

  // اختبار 1: مكافأة السرعة
  try {
    const speedResult = calculateBestFriendPoints(
      InteractionType.LIKE,
      'user1',
      'user2',
      { reactionSpeed: 5 } // خلال 5 دقائق
    );
    
    const hasSpeedBonus = speedResult.breakdown.speedBonus > 0;
    results.push({
      testName: 'مكافأة سرعة التفاعل',
      passed: hasSpeedBonus,
      expected: 'أكبر من 0',
      actual: speedResult.breakdown.speedBonus
    });
  } catch (error) {
    results.push({
      testName: 'مكافأة سرعة التفاعل',
      passed: false,
      expected: 'أكبر من 0',
      actual: 'خطأ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  // اختبار 2: مكافأة التبادل
  try {
    const reciprocalResult = calculateBestFriendPoints(
      InteractionType.COMMENT,
      'user1',
      'user2',
      { isReciprocal: true }
    );
    
    const hasReciprocalBonus = reciprocalResult.breakdown.reciprocalBonus > 0;
    results.push({
      testName: 'مكافأة التفاعل المتبادل',
      passed: hasReciprocalBonus,
      expected: 'أكبر من 0',
      actual: reciprocalResult.breakdown.reciprocalBonus
    });
  } catch (error) {
    results.push({
      testName: 'مكافأة التفاعل المتبادل',
      passed: false,
      expected: 'أكبر من 0',
      actual: 'خطأ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  // اختبار 3: مكافأة الاستمرارية
  try {
    const consistencyResult = calculateBestFriendPoints(
      InteractionType.LIKE,
      'user1',
      'user2',
      { consecutiveDays: 7 }
    );
    
    const hasConsistencyBonus = consistencyResult.breakdown.consistencyBonus > 0;
    results.push({
      testName: 'مكافأة الاستمرارية',
      passed: hasConsistencyBonus,
      expected: 'أكبر من 0',
      actual: consistencyResult.breakdown.consistencyBonus
    });
  } catch (error) {
    results.push({
      testName: 'مكافأة الاستمرارية',
      passed: false,
      expected: 'أكبر من 0',
      actual: 'خطأ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  return results;
}

/**
 * اختبارات قوة العلاقة
 */
async function testRelationshipStrength(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('💪 اختبار حساب قوة العلاقة...');

  const strengthTests = [
    { points: 15, expected: RelationshipStrength.WEAK, name: 'ضعيف' },
    { points: 45, expected: RelationshipStrength.MODERATE, name: 'متوسط' },
    { points: 75, expected: RelationshipStrength.STRONG, name: 'قوي' },
    { points: 95, expected: RelationshipStrength.VERY_STRONG, name: 'قوي جداً' }
  ];

  strengthTests.forEach(test => {
    try {
      const actual = calculateRelationshipStrength(test.points);
      results.push({
        testName: `قوة العلاقة - ${test.name} (${test.points} نقطة)`,
        passed: actual === test.expected,
        expected: test.expected,
        actual
      });
    } catch (error) {
      results.push({
        testName: `قوة العلاقة - ${test.name} (${test.points} نقطة)`,
        passed: false,
        expected: test.expected,
        actual: 'خطأ',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      });
    }
  });

  return results;
}

/**
 * اختبارات حساب التقدم
 */
async function testProgressCalculation(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('📈 اختبار حساب التقدم بين المستويات...');

  // اختبار 1: التقدم من ضعيف إلى متوسط
  try {
    const progress = calculateProgressToNextLevel(20);
    const expectedPointsToNext = 31 - 20; // 11 نقطة للوصول للمستوى التالي
    
    results.push({
      testName: 'حساب النقاط المطلوبة للمستوى التالي',
      passed: progress.pointsToNext === expectedPointsToNext,
      expected: expectedPointsToNext,
      actual: progress.pointsToNext
    });

    results.push({
      testName: 'حساب نسبة التقدم المئوية',
      passed: progress.progressPercentage > 0 && progress.progressPercentage <= 100,
      expected: 'بين 0 و 100',
      actual: progress.progressPercentage
    });
  } catch (error) {
    results.push({
      testName: 'حساب التقدم للمستوى التالي',
      passed: false,
      expected: 'كائن التقدم',
      actual: 'خطأ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  return results;
}

/**
 * اختبارات السيناريوهات المتقدمة
 */
async function testAdvancedScenarios(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('🎯 اختبار السيناريوهات المتقدمة...');

  // اختبار 1: تفاعل سريع ومتبادل مع استمرارية
  try {
    const advancedResult = calculateBestFriendPoints(
      InteractionType.COMMENT,
      'user1',
      'user2',
      {
        reactionSpeed: 3, // سريع جداً
        isReciprocal: true, // متبادل
        consecutiveDays: 10, // استمرارية عالية
        contentType: 'video', // فيديو
        timeOfDay: 'off-peak' // خارج الذروة
      }
    );

    const totalPoints = advancedResult.user1Points;
    const hasMultipleBonuses = advancedResult.breakdown.speedBonus > 0 &&
                              advancedResult.breakdown.reciprocalBonus > 0 &&
                              advancedResult.breakdown.consistencyBonus > 0;

    results.push({
      testName: 'سيناريو متقدم - تفاعل سريع ومتبادل مع استمرارية',
      passed: totalPoints > 10 && hasMultipleBonuses, // يجب أن يحصل على أكثر من 10 نقاط
      expected: 'أكثر من 10 نقاط مع مكافآت متعددة',
      actual: `${totalPoints} نقطة، مكافآت: ${hasMultipleBonuses ? 'متعددة' : 'محدودة'}`
    });
  } catch (error) {
    results.push({
      testName: 'سيناريو متقدم - تفاعل سريع ومتبادل مع استمرارية',
      passed: false,
      expected: 'أكثر من 10 نقاط مع مكافآت متعددة',
      actual: 'خطأ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  // اختبار 2: تفاعل بطيء وغير متبادل
  try {
    const slowResult = calculateBestFriendPoints(
      InteractionType.LIKE,
      'user1',
      'user2',
      {
        reactionSpeed: 300, // بطيء جداً (5 ساعات)
        isReciprocal: false,
        consecutiveDays: 1
      }
    );

    const totalPoints = slowResult.user1Points;
    
    results.push({
      testName: 'سيناريو بسيط - تفاعل بطيء وغير متبادل',
      passed: totalPoints <= 2, // يجب أن يحصل على نقاط قليلة
      expected: 'نقاط قليلة (≤ 2)',
      actual: `${totalPoints} نقطة`
    });
  } catch (error) {
    results.push({
      testName: 'سيناريو بسيط - تفاعل بطيء وغير متبادل',
      passed: false,
      expected: 'نقاط قليلة (≤ 2)',
      actual: 'خطأ',
      details: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
  }

  return results;
}

/**
 * اختبار تكامل النظام (Integration Test)
 */
export async function testSystemIntegration(): Promise<void> {
  console.log('\n🔗 اختبار تكامل النظام...\n');

  try {
    // محاولة إنشاء تفاعل وهمي
    const testUserId = 'test-user-1';
    const testFriendId = 'test-user-2';

    console.log('📝 اختبار الخدمة المبسطة...');
    
    // اختبار الخدمة المبسطة
    const serviceResult = await BestFriendService.processInteraction(
      testUserId,
      testFriendId,
      'like',
      {
        reactionSpeed: 30,
        isReciprocal: false
      }
    );

    console.log('✅ نتيجة اختبار الخدمة:', {
      success: serviceResult.success,
      pointsAwarded: serviceResult.pointsAwarded,
      errorMessage: serviceResult.errorMessage
    });

  } catch (error) {
    console.log('❌ خطأ في اختبار التكامل:', error);
  }
}

/**
 * تشغيل عرض توضيحي لنظام النقاط
 */
export async function runPointsSystemDemo(): Promise<void> {
  console.log('\n🎮 عرض توضيحي لنظام النقاط...\n');

  const scenarios = [
    {
      name: 'إعجاب سريع',
      type: InteractionType.LIKE,
      metadata: { reactionSpeed: 2 }
    },
    {
      name: 'تعليق متبادل',
      type: InteractionType.COMMENT,
      metadata: { isReciprocal: true, reactionSpeed: 15 }
    },
    {
      name: 'مشاركة مع استمرارية',
      type: InteractionType.SHARE,
      metadata: { consecutiveDays: 7, contentType: 'video' as const }
    },
    {
      name: 'تفاعل متقدم',
      type: InteractionType.COMMENT,
      metadata: {
        reactionSpeed: 1,
        isReciprocal: true,
        consecutiveDays: 14,
        contentType: 'video' as const,
        timeOfDay: 'off-peak' as const,
        isFirstInteraction: true
      }
    }
  ];

  scenarios.forEach(scenario => {
    try {
      const result = calculateBestFriendPoints(
        scenario.type,
        'demo-user-1',
        'demo-user-2',
        scenario.metadata
      );

      console.log(`📊 ${scenario.name}:`);
      console.log(`   نقاط المستخدم: ${result.user1Points.toFixed(1)}`);
      console.log(`   المضاعف: ${result.multiplier.toFixed(2)}x`);
      console.log(`   تفاصيل المكافآت:`);
      console.log(`     - النقاط الأساسية: ${result.breakdown.basePoints}`);
      console.log(`     - مكافأة السرعة: ${result.breakdown.speedBonus.toFixed(1)}`);
      console.log(`     - مكافأة التبادل: ${result.breakdown.reciprocalBonus.toFixed(1)}`);
      console.log(`     - مكافأة الاستمرارية: ${result.breakdown.consistencyBonus.toFixed(1)}`);
      console.log('');
    } catch (error) {
      console.log(`❌ خطأ في سيناريو ${scenario.name}:`, error);
    }
  });

  // عرض مستويات قوة العلاقة
  console.log('📈 مستويات قوة العلاقة:');
  [15, 45, 75, 95, 150].forEach(points => {
    const strength = calculateRelationshipStrength(points);
    const progress = calculateProgressToNextLevel(points);
    
    console.log(`   ${points} نقطة → ${strength} (${progress.progressPercentage.toFixed(1)}% للمستوى التالي)`);
  });
}

// تصدير دالة تشغيل جميع الاختبارات
export default async function runAllTests() {
  console.log('🚀 بدء تشغيل اختبارات نظام الصديق الأفضل الشاملة...\n');
  
  const testResults = await runBestFriendSystemTests();
  await testSystemIntegration();
  await runPointsSystemDemo();
  
  console.log('\n✅ انتهت جميع الاختبارات!');
  return testResults;
}
