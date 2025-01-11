import { Itinerary, itinerarySchema } from "@/lib/itenarary-schema";
import { ObjectStreamFromResponse } from "modelfusion";
import { useCallback, useState } from "react";

export function useItinerary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary>();

  const generateItinerary = useCallback(
    async ({
      destination,
      lengthOfStay,
    }: {
      destination: string;
      lengthOfStay: string;
    }) => {
      setItinerary(undefined);
      setIsGenerating(true);

      try {
        const response = await fetch("/api/stream-objects", {
          method: "POST",
            headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ destination, lengthOfStay }),
        })
        console.log("Request Body:", { destination, lengthOfStay });


        const stream = ObjectStreamFromResponse({
          schema: itinerarySchema,
          response,
        });

        for await (const { partialObject } of stream) {
          setItinerary(partialObject);
        }
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    isGeneratingItinerary: isGenerating,
    generateItinerary,
    itinerary,
  };
}