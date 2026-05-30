import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://127.0.0.1:8000/scholarships', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Scholarships fetch failed:', err);
    return NextResponse.json([], { status: 200 });
  }
}