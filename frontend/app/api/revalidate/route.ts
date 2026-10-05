import { parseBody } from 'next-sanity/webhook'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET
    if (!secret) {
      return new Response('Missing SANITY_REVALIDATE_SECRET', { status: 500 })
    }

    // @ts-ignore - bypassing next-sanity type issues
    const { isValid, body } = await parseBody<{ _type: string; slug?: { current: string } }>(
      req as any,
      secret
    )

    if (!isValid) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    // Revalidate the general package list
    // @ts-ignore - next 15+ changed revalidateTag signature in some versions
    revalidateTag('package')

    // Revalidate the specific package if slug is provided
    if (body.slug?.current) {
      // @ts-ignore
      revalidateTag(`package:${body.slug.current}`)
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err: any) {
    console.error(err)
    return new Response(err.message, { status: 500 })
  }
}
