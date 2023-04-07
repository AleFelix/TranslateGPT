import type { NextApiRequest, NextApiResponse } from 'next'
import {readResponse} from '@/services/chatGPTProxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await readResponse(req.body.session_id, req.body.user_fake_id, req.body.parent_id)
  res.status(200).json(response);
}
