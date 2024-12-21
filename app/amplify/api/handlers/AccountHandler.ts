import { Request, Response } from 'lambda-api';

export async function AccountHandler(req: Request, res: Response) {
  res.send({
    message: "Hello World",
  });
}
