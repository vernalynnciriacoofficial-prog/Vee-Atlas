export function buildGenerateMemoPrompt(structuredData) {
  const system = `You are an expert at writing clear, concise executive decision memos.
Write a structured memo based on the provided decision data.
Return ONLY valid JSON — no markdown, no preamble, no explanation.
The "risk" field must be exactly "Low", "Medium", or "High" — no other values.
Include between 2 and 4 pros and 2 and 4 cons per option.
Write the recommendation as one concise paragraph.`;

  const optionsList = structuredData.options
    .map((o, i) => `${i + 1}. ${o.name}: ${o.description}`)
    .join('\n');

  const user = `Generate a decision memo for the following:

Title: ${structuredData.title}
Context: ${structuredData.context}
Constraints: ${structuredData.constraints.join(', ')}
Stakeholders: ${structuredData.stakeholders.join(', ')}
Options to evaluate:
${optionsList}

Return a JSON object with this exact shape:
{
  "context": "expanded background paragraph",
  "options": [
    {
      "name": "option name",
      "description": "expanded description",
      "pros": ["pro 1", "pro 2"],
      "cons": ["con 1", "con 2"],
      "risk": "Low | Medium | High"
    }
  ],
  "recommendation": "one paragraph recommendation",
  "nextSteps": ["step 1", "step 2"]
}

Begin your response with {`;

  return { system, user };
}
