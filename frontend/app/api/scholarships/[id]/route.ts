import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/scholarships/${params.id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json(null, { status: 404 });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Scholarship detail fetch failed:', err);
    return NextResponse.json(null, { status: 500 });
  }
}