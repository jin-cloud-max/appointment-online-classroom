import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';

interface ErrorResponseType {
  error: string;
}

interface UserTypes {
  _id: string;
  name: string;
  email: string;
  cellphone: number;
  teacher: string;
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<UserTypes | ErrorResponseType>
): Promise<void> => {
  const { method } = request;

  switch (method) {
    case 'POST':
      const { name, email, cellphone, teacher } = request.body;

      if (!name || !email || !cellphone || !teacher) {
        response.status(400).json({ error: 'Body is required' });

        return;
      }

      const { db } = await connect();

      const user = await db.collection('users').insertOne({
        name,
        email,
        cellphone,
        teacher,
      });

      response.status(200).json(user.ops[0]);
      break;
    default:
      response.status(400).end(`Method ${method} not allowed`);
  }
};
