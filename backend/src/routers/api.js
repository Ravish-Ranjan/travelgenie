// pages/api/generate-itinerary.js
import Anthropic from "@anthropic-ai/sdk";
import { config } from "dotenv";
config();

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
	throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

const anthropic = new Anthropic({
	apiKey: apiKey,
});

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const { destination, budget, startDate, duration, currency } = req.body;

		const response = await anthropic.messages.create({
			model: "claude-3-5-sonnet-20241022",
			max_tokens: 4096,
			temperature: 0.7,
			messages: [
				{
					role: "user",
					content: `Generate a detailed daily travel itinerary for the following trip:
          Destination: ${destination}
          Budget: $${budget} ${currency}
          Start Date: ${startDate}
          Duration: ${duration} days
          
          Please provide the response in JSON format with the following structure:
          {
            "destination": string,
            "total_budget": number,
            "start_date": string,
            "duration": number,
            "daily_itinerary": [
              {
                "day": number,
                "date": string,
                "activities": [
                  {
                    "time": string,
                    "activity": string,
                    "location": string,
					"location_url": [number,number] (latitude,longitude),
                    "estimated_cost": number
                  }
                ],
                "daily_budget": number
              }
            ],
            "budget_breakdown": {
              "accommodation": number,
              "activities": number,
              "food": number,
              "transportation": number,
              "misc": number
            }
          }`,
				},
			],
		});

		// Extract JSON from response
		const responseText = response.content[0].text;
		const startIdx = responseText.indexOf("{");
		const endIdx = responseText.lastIndexOf("}") + 1;
		const jsonStr = responseText.slice(startIdx, endIdx);
		let itinerary;
		try {
			itinerary = JSON.parse(jsonStr);
		} catch (parseError) {
			console.error("JSON parsing error:", parseError);
			return res
				.status(500)
				.json({ message: "Failed to parse itinerary JSON" });
		}

		res.status(200).json(itinerary);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: "Failed to generate itinerary" });
	}
}
