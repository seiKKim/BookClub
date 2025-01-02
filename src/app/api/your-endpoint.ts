import type { NextApiRequest, NextApiResponse } from 'next';

import Cors from 'cors';

// CORS 미들웨어 초기화
const cors = Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: '*', // 모든 출처 허용
});

// 미들웨어를 Next.js API 라우트에 적용하는 헬퍼 함수
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // CORS 미들웨어 실행
    await runMiddleware(req, res, cors);

    // 실제 API 로직
    res.status(200).json({ message: 'Hello World!' });
}
