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
  try {
    const { destination, lengthOfStay } = await req.json();
    console.log("API Received:", { destination, lengthOfStay });

    // Ensure API key is loaded
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    console.log(apiKey)
    if (!apiKey) {
      throw new Error("OpenAI API key is missing. Set OPENAI_API_KEY in .env.local.");
    }

    const openaiClient = new OpenAI({
      apiKey, // Use the securely loaded API key
    });

    const objectStream = await streamObject({
      model: openaiClient
        .ChatTextGenerator({
          model: "gpt-4-1106-preview",
          maxGenerationTokens: 2500,
        })
        .asObjectGenerationModel(jsonObjectPrompt.instruction()),

      schema: itinerarySchema,

      prompt: {
        system:
          `You help planning travel itineraries. ` +
          `Respond to the users' request with a list ` +
          `of the best stops to make in their destination.`,

        instruction:
          `I am planning a trip to ${destination} for ${lengthOfStay} days. ` +
          `Please suggest the best tourist activities for me to do.`,
      },
    });

    return new ObjectStreamResponse(objectStream);
  } catch (error) {
    console.error("Error in API Handler:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}