export function buildExtractStructurePrompt(freeText) {
  const system = `You are an expert at structuring executive decision briefs.
Extract the key components from the user's decision description and return them as JSON.
Return ONLY valid JSON — no markdown, no preamble, no explanation.
If the input does not specify concrete options, create placeholder options named "Option A", "Option B", etc.
Return between 2 and 4 options.`;

  const user = `Extract a structured decision brief from the following description:

${freeText}

Return a JSON object with this exact shape:
{
  "title": "short decision title",
  "context": "one to two sentence background summary",
  "constraints": ["constraint 1", "constraint 2"],
  "stakeholders": ["stakeholder 1"],
  "options": [
    { "name": "option name", "description": "brief description" }
  ]
}

Begin your response with {`;

  return { system, user };
}
