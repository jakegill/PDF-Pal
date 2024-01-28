import NextCors from 'next-cors';
export { default } from 'next-auth/middleware';
import { NextResponse, NextRequest } from 'next/server';


// export async function middleware(req: any) {

//     await NextCors(req, {
//         headers: '*',
//         methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//     });

//     return NextResponse.next();
// }

export const config = {
    matcher: ['/dashboard'],
};