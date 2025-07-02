/**
 * API لإدارة علاقات الصديق الأفضل
 * POST /api/bestfriend/relations - إنشاء علاقة جديدة
 * PUT /api/bestfriend/relations - تحديث حالة علاقة
 * DELETE /api/bestfriend/relations - إنهاء علاقة
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  createBestFriendRelation,
  updateBestFriendRelationStatus,
  endBestFriendRelation 
} from '@/lib/bestfriend';
import { BestFriendStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface CreateRelationRequest {
  user1Id: string;
  user2Id: string;
  nominatedBy: string;
  nominationWeek: string;
}

interface UpdateRelationRequest {
  relationId: string;
  newStatus: BestFriendStatus;
  updatedBy: string;
  reason?: string;
}

interface EndRelationRequest {
  relationId: string;
  endedBy: string;
  reason?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRelationRequest = await request.json();
    const { user1Id, user2Id, nominatedBy, nominationWeek } = body;

    // التحقق من صحة البيانات
    if (!user1Id || !user2Id || !nominatedBy || !nominationWeek) {
      return NextResponse.json(
        { error: 'بيانات مطلوبة مفقودة' },
        { status: 400 }
      );
    }

    // عدم السماح بعلاقة مع نفس المستخدم
    if (user1Id === user2Id) {
      return NextResponse.json(
        { error: 'لا يمكن إنشاء علاقة صديق أفضل مع نفس المستخدم' },
        { status: 400 }
      );
    }

    // إنشاء العلاقة
    const relation = await createBestFriendRelation(
      user1Id,
      user2Id,
      nominatedBy,
      nominationWeek
    );

    if (!relation) {
      return NextResponse.json(
        { error: 'فشل في إنشاء علاقة الصديق الأفضل' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      relation: {
        id: relation.id,
        status: relation.status,
        startDate: relation.startDate,
        endDate: relation.endDate,
        nominationWeek: relation.nominationWeek
      },
      message: 'تم إنشاء علاقة الصديق الأفضل بنجاح'
    });

  } catch (error) {
    console.error('خطأ في إنشاء علاقة الصديق الأفضل:', error);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: UpdateRelationRequest = await request.json();
    const { relationId, newStatus, updatedBy, reason } = body;

    // التحقق من صحة البيانات
    if (!relationId || !newStatus || !updatedBy) {
      return NextResponse.json(
        { error: 'بيانات مطلوبة مفقودة' },
        { status: 400 }
      );
    }

    // التحقق من صحة الحالة الجديدة
    if (!Object.values(BestFriendStatus).includes(newStatus)) {
      return NextResponse.json(
        { error: 'حالة غير صحيحة' },
        { status: 400 }
      );
    }

    // تحديث حالة العلاقة
    const updatedRelation = await updateBestFriendRelationStatus(
      relationId,
      newStatus,
      updatedBy,
      reason
    );

    if (!updatedRelation) {
      return NextResponse.json(
        { error: 'فشل في تحديث حالة العلاقة' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      relation: {
        id: updatedRelation.id,
        status: updatedRelation.status,
        decidedAt: updatedRelation.decidedAt,
        approvedBy: updatedRelation.approvedBy
      },
      message: `تم تحديث حالة العلاقة إلى ${newStatus}`
    });

  } catch (error) {
    console.error('خطأ في تحديث علاقة الصديق الأفضل:', error);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body: EndRelationRequest = await request.json();
    const { relationId, endedBy, reason } = body;

    // التحقق من صحة البيانات
    if (!relationId || !endedBy) {
      return NextResponse.json(
        { error: 'بيانات مطلوبة مفقودة' },
        { status: 400 }
      );
    }

    // إنهاء العلاقة
    const success = await endBestFriendRelation(relationId, endedBy, reason);

    if (!success) {
      return NextResponse.json(
        { error: 'فشل في إنهاء العلاقة' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنهاء علاقة الصديق الأفضل بنجاح'
    });

  } catch (error) {
    console.error('خطأ في إنهاء علاقة الصديق الأفضل:', error);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}
