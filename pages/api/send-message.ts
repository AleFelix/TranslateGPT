import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMessage } from '@/services/chatGPTProxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await sendMessage(req.body.session_id, req.body.user_fake_id, req.body.question, req.body.parent_id);
  res.status(200).json(response);
}
