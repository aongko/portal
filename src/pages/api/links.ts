import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const links = async (req: NextApiRequest, res: NextApiResponse) => {
  const links = await prisma.link.findMany();
  res.status(200).json(links);
};

export default links;
