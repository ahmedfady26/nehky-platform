/**
 * API لإحصائيات الصديق الأفضل
 * GET /api/bestfriend/stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  findActiveBestFriendRelation,
  getBestFriendRelationStats,
  getUserBestFriendRelations 
} from '@/lib/bestfriend';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const friendId = searchParams.get('friendId');
    const relationId = searchParams.get('relationId');

    if (!userId) {
      return NextResponse.json(
        { error: 'مطلوب معرف المستخدم' },
        { status: 400 }
      );
    }

    // إذا تم تمرير معرف علاقة محدد
    if (relationId) {
      const stats = await getBestFriendRelationStats(relationId);
      if (!stats) {
        return NextResponse.json(
          { error: 'لم يتم العثور على العلاقة' },
          { status: 404 }
        );
      }
      return NextResponse.json(stats);
    }

    // إذا تم تمرير معرف صديق محدد
    if (friendId) {
      const relation = await findActiveBestFriendRelation(userId, friendId);
      if (!relation) {
        return NextResponse.json(
          { error: 'لا توجد علاقة صديق أفضل نشطة' },
          { status: 404 }
        );
      }

      const stats = await getBestFriendRelationStats(relation.id);
      return NextResponse.json(stats);
    }

    // الحصول على جميع علاقات المستخدم
    const relations = await getUserBestFriendRelations(userId);
    
    // إنشاء إحصائيات مجمعة
    const summary = {
      totalRelations: relations.length,
      activeRelations: relations.filter(r => r.status === 'ACTIVE').length,
      totalPoints: relations.reduce((sum, r) => sum + r.totalPoints, 0),
      relations: await Promise.all(relations.map(async (relation) => {
        // الحصول على بيانات المستخدم الآخر
        const { prisma } = await import('@/lib/prisma');
        const friendId = relation.user1Id === userId ? relation.user2Id : relation.user1Id;
        const friend = await prisma.user.findUnique({
          where: { id: friendId },
          select: { id: true, fullName: true, username: true, profilePicture: true }
        });

        return {
          id: relation.id,
          friendId,
          friendName: friend?.fullName || 'مستخدم غير معروف',
          friendUsername: friend?.username || '',
          friendProfilePicture: friend?.profilePicture || null,
          totalPoints: relation.totalPoints,
          myPoints: relation.user1Id === userId ? relation.user1Points : relation.user2Points,
          friendPoints: relation.user1Id === userId ? relation.user2Points : relation.user1Points,
          level: relation.relationshipStrength,
          status: relation.status,
          startDate: relation.startDate,
          endDate: relation.endDate,
          lastInteraction: relation.lastInteraction
        };
      }))
    };

    return NextResponse.json(summary);

  } catch (error) {
    console.error('خطأ في API إحصائيات الصديق الأفضل:', error);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}
