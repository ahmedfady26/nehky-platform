import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const post = await prisma.post.findFirst({ 
    select: { id: true, authorId: true } 
  })
  console.log('Post ID:', post?.id, 'User ID:', post?.authorId)
  await prisma.$disconnect()
}

main().catch(console.error)
