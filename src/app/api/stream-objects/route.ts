import { itinerarySchema } from "@/lib/itenarary-schema";
// import { Itinerary } from "@/lib/itenarary-schema"
import OpenAI from 'openai';
import {
  ObjectStreamResponse,
  jsonObjectPrompt,
  streamObject,
} from "modelfusion";


export const runtime = "edge";


export async function POST(req: Request) {
  console.log("API Route Hit")
  try {
    const { destination, lengthOfStay } = await req.json();
    console.log("Received:", { destination, lengthOfStay });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key is missing.");
    }

    // Additional debug
    console.log("OpenAI API Key Loaded");
    return new Response("API is working!", { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
