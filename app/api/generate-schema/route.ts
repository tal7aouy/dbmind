import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash-latest",
  apiKey: process.env.GOOGLE_API_KEY,
  maxOutputTokens: 2048
});

const template =
  "Generate a database schema based on the following description.\n" +
  "The output should be a valid JSON object containing tables, their columns, and relationships.\n\n" +
  "Description: {description}\n\n" +
  "Format the response as a valid JSON object with the following structure:\n" +
  "{{\n" + 
  '  "tables": [\n' +
  "    {{\n" +
  '      "name": "string",\n' +
  '      "columns": [\n' +
  "        {{\n" +
  '          "name": "string",\n' +
  '          "type": "string",\n' +
  '          "isPrimary": "boolean",\n' +
  '          "isForeign": "boolean",\n' +
  '          "references": {{\n' +
  '            "table": "string",\n' +
  '            "column": "string"\n' +
  "          }}\n" +
  "        }}\n" +
  "      ]\n" +
  "    }}\n" +
  "  ],\n" +
  '  "relationships": [\n' +
  "    {{\n" +
  '      "from": "string",\n' +
  '      "to": "string",\n' +
  '      "type": "one-to-one | one-to-many | many-to-many"\n' +
  "    }}\n" +
  "  ]\n" +
  "}}\n\n" +
  "Only return the JSON, no additional text.";

const promptTemplate = PromptTemplate.fromTemplate(template);

// POST request handler to generate schema
export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY is not set");
    return NextResponse.json(
      { error: "API key configuration error" },
      { status: 500 }
    );
  }

  try {
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const prompt = await promptTemplate.format({ description });

    const result = await model.invoke(prompt);
    const response = result.content;
    try {
      const cleaned = cleanJsonResponse(response);

      const schema = JSON.parse(cleaned);
      return NextResponse.json(schema);
    } catch (parseError) {
      console.error("Error parsing AI response:", response);
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error generating schema:", error);
    return NextResponse.json(
      { error: "Failed to generate schema" },
      { status: 500 }
    );
  }
}

function cleanJsonResponse(response: string): string {
  const cleaned = response
    .replace(/^```json\n?/gm, "") // Remove opening ```json
    .replace(/^```\n?/gm, "") // Remove opening ```
    .replace(/\n?```$/gm, "") // Remove closing ```
    .replace(/^\s+|\s+$/g, "") // Trim whitespace
    .replace(/\\n/g, "") // Remove escaped newlines
    .replace(/^"|"$/g, ""); // Remove surrounding quotes if present

  return cleaned;
}
