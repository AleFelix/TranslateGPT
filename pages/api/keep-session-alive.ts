import type { NextApiRequest, NextApiResponse } from 'next'
import {keepSessionAlive} from '@/services/chatGPTProxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await keepSessionAlive(req.body.session_id, req.body.user_fake_id);
  res.status(200).json(response);
}
