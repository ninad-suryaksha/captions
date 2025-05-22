import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET() {
  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ status: "error", message: "OpenAI API key not configured" }, { status: 500 })
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Make a simple API call to test connectivity
    try {
      await openai.chat.completions.create({
        model: "gpt-4o-2024-11-20",
        messages: [{ role: "user", content: "Test" }],
        max_tokens: 32000,
      })

      return NextResponse.json({ status: "ok", message: "API is working correctly" })
    } catch (apiError: any) {
      console.error("OpenAI API test failed:", apiError)
      return NextResponse.json(
        { status: "error", message: "OpenAI API test failed", error: apiError.message },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("API status check error:", error)
    return NextResponse.json(
      { status: "error", message: "API status check failed", error: error.message },
      { status: 500 },
    )
  }
}
