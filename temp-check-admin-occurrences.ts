import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminOccurrences = await prisma.keywordOccurrence.findMany({
    where: { recordedByAdminId: { not: null } },
    take: 3,
    select: {
      id: true,
      keyword: true,
      recordedByAdminId: true,
      recordedByAdmin: {
        select: {
          id: true,
          role: true,
          user: {
            select: { username: true, fullName: true }
          }
        }
      }
    }
  })

  console.log('Admin-recorded occurrences:')
  adminOccurrences.forEach(occ => {
    console.log(`- ${occ.keyword} recorded by ${occ.recordedByAdmin?.user.fullName} (${occ.recordedByAdmin?.role}) - Admin ID: ${occ.recordedByAdminId}`)
  })

  await prisma.$disconnect()
}

main().catch(console.error)
