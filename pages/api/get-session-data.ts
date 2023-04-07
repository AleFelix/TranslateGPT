import type { NextApiRequest, NextApiResponse } from 'next'
import { generateSessionData } from '@/services/chatGPTProxy';

type Data = {
  session_id: string,
  user_fake_id: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const sessionData = generateSessionData();
  res.status(200).json({
    session_id: sessionData.session_id,
    user_fake_id: sessionData.user_fake_id
  });
}
