import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Если запрос идёт на /_next/ - отдаём как есть
  if (pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
