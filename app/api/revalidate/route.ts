import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * ISR webhook target for Sanity. Configure a Sanity webhook (GROQ-projected
 * payload or plain) to POST here on publish, with a shared secret in the
 * `x-webhook-secret` header (or `?secret=`). Env: SANITY_REVALIDATE_SECRET.
 *
 * Until Sanity is connected this route simply returns 200 for a valid secret.
 * See docs/DEPLOY.md.
 */
export async function POST(req: NextRequest) {
  const secret =
    req.headers.get("x-webhook-secret") ??
    req.nextUrl.searchParams.get("secret");

  if (
    !process.env.SANITY_REVALIDATE_SECRET ||
    secret !== process.env.SANITY_REVALIDATE_SECRET
  ) {
    return NextResponse.json({ revalidated: false, reason: "bad secret" }, {
      status: 401,
    });
  }

  let body: { slug?: string; type?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty / non-JSON body is fine — fall back to a broad revalidate */
  }

  const paths = new Set<string>(["/", "/productos"]);
  if (body.type === "product" && body.slug) {
    // category is unknown from the payload; revalidate the listing + all
    // category pages by revalidating the segment.
    paths.add("/productos/[categoria]");
    paths.add(`/productos/[categoria]/${body.slug}`);
  } else {
    paths.add("/productos/[categoria]");
    paths.add("/ocean-breeze");
    paths.add("/bonche");
  }

  for (const p of paths) {
    revalidatePath(p, p.includes("[") ? "page" : "page");
  }

  return NextResponse.json({
    revalidated: true,
    paths: [...paths],
    now: Date.now(),
  });
}
