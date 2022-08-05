// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client_id = "7404fca97fc3483aa59173658057c80b";
  const client_secret = "418cc55d6a0e4b15b5c17ffc7c0b217c";
  const formData = new URLSearchParams();
  formData.append('grant_type', 'client_credentials');
  const authOptions: RequestInit = {
    method: 'POST', 
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    body: formData,
  };

  const data = await fetch("https://accounts.spotify.com/api/token", authOptions).then(resp => resp.json())
  res.status(200).json(data)
}
