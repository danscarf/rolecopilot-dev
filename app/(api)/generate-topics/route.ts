// app/(api)/generate-topics/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRequestUser } from '../../_lib/supabaseServer';
import { buildPrompt, extractQuestions, normalizeInput, type GenerateTopicsInput } from '../../_lib/topicsPrompt';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

export async function POST(request: Request) {
  try {
    // FR-008: generation spends AI credits, so the session is validated server-side.
    const { user, failure } = await getRequestUser(request);
    if (!user) {
      if (failure === 'unconfigured') {
        return NextResponse.json(
          { message: 'Sign-in is not configured on this deployment, so question generation is unavailable.' },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { message: 'Please sign in to generate table topics questions.' },
        { status: 401 }
      );
    }

    const body: Partial<GenerateTopicsInput> = await request.json();
    const input = normalizeInput(body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: 'Question generation is not configured (missing GEMINI_API_KEY).' },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL });

    let questions: string[] | null = null;
    try {
      const result = await model.generateContent(buildPrompt(input));
      questions = extractQuestions(result.response.text(), input.count);
    } catch (aiError: unknown) {
      console.error('Gemini generation failed:', aiError);
      return NextResponse.json(
        { message: `AI generation failed: ${(aiError as Error).message || 'Unknown AI error.'}` },
        { status: 502 }
      );
    }

    if (!questions) {
      return NextResponse.json(
        { message: 'The AI returned an unexpected response. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error: unknown) {
    console.error('Error in generate-topics route:', error);
    return NextResponse.json(
      { message: `Internal server error: ${(error as Error).message || 'Unknown error.'}` },
      { status: 500 }
    );
  }
}
