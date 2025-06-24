import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { field, value } = await request.json();

    if (!field || !value) {
      return NextResponse.json({
        isUnique: true,
        message: ''
      });
    }

    let whereCondition: any = {};
    
    switch (field) {
      case 'username':
        whereCondition = { username: value };
        break;
      case 'email':
        whereCondition = { email: value };
        break;
      case 'phone':
        whereCondition = { phone: value };
        break;
      default:
        return NextResponse.json({
          isUnique: true,
          message: ''
        });
    }

    const existingUser = await prisma.user.findFirst({
      where: whereCondition
    });

    if (existingUser) {
      let message = '';
      switch (field) {
        case 'username':
          message = 'اسم المستخدم مُستخدم من قبل، جرب اسماً آخر';
          break;
        case 'email':
          message = 'البريد الإلكتروني مُستخدم من قبل';
          break;
        case 'phone':
          message = 'رقم الهاتف مُستخدم من قبل';
          break;
      }
      
      return NextResponse.json({
        isUnique: false,
        message
      });
    }

    return NextResponse.json({
      isUnique: true,
      message: field === 'username' ? 'اسم المستخدم متاح!' : 'متاح للاستخدام!'
    });

  } catch (error) {
    console.error('Error checking uniqueness:', error);
    return NextResponse.json({
      isUnique: true,
      message: ''
    });
  }
}
