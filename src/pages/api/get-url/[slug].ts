import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../server/db/client'

const getUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query['slug'] as string
  console.log(slug)

  const data = await prisma.link.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  if (!data) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate')
  res.status(200).json(data)
}

export default getUrl
