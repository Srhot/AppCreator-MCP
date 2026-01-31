/**
 * Robust JSON Parser Utility
 *
 * Handles common JSON parsing errors from AI-generated content
 */

/**
 * Attempt to parse JSON with multiple fallback strategies
 */
export function safeParseJSON<T>(jsonString: string, defaultValue: T): T {
  // Strategy 1: Try direct parse
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // Continue to next strategy
  }

  // Strategy 2: Fix common JSON errors
  const fixedJson = fixCommonJSONErrors(jsonString);
  try {
    return JSON.parse(fixedJson);
  } catch (e) {
    // Continue to next strategy
  }

  // Strategy 3: Try to extract JSON from markdown code blocks
  const extracted = extractJSONFromMarkdown(jsonString);
  if (extracted) {
    try {
      return JSON.parse(extracted);
    } catch (e) {
      const fixedExtracted = fixCommonJSONErrors(extracted);
      try {
        return JSON.parse(fixedExtracted);
      } catch (e2) {
        // Continue to next strategy
      }
    }
  }

  // Strategy 4: Try to fix more aggressive issues
  const aggressiveFixed = aggressiveJSONFix(jsonString);
  try {
    return JSON.parse(aggressiveFixed);
  } catch (e) {
    // Give up and return default
    console.error('All JSON parsing strategies failed, using default value');
    return defaultValue;
  }
}

/**
 * Extract JSON object from AI response
 */
export function extractJSON(response: string): string | null {
  // Try to find JSON object
  const objectMatch = response.match(/\{[\s\S]*\}/);
  if (objectMatch) return objectMatch[0];

  // Try to find JSON array
  const arrayMatch = response.match(/\[[\s\S]*\]/);
  if (arrayMatch) return arrayMatch[0];

  return null;
}

/**
 * Extract JSON from markdown code blocks
 */
function extractJSONFromMarkdown(text: string): string | null {
  // Match ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  return null;
}

/**
 * Fix common JSON syntax errors
 */
function fixCommonJSONErrors(json: string): string {
  let fixed = json;

  // Remove trailing commas before } or ]
  fixed = fixed.replace(/,\s*}/g, '}');
  fixed = fixed.replace(/,\s*]/g, ']');

  // Add missing commas between objects
  fixed = fixed.replace(/}\s*{/g, '},{');
  fixed = fixed.replace(/]\s*{/g, '],{');
  fixed = fixed.replace(/}\s*\[/g, '},[');

  // Add missing commas between strings
  fixed = fixed.replace(/"\s*\n\s*"/g, '","');

  // Add missing commas after numbers
  fixed = fixed.replace(/(\d)\s*\n\s*"/g, '$1,"');

  // Fix single quotes (convert to double quotes for keys/values)
  // Be careful not to break apostrophes in text
  fixed = fixed.replace(/:\s*'([^']*)'/g, ':"$1"');
  fixed = fixed.replace(/'\s*:/g, '":');

  // Remove comments (// style)
  fixed = fixed.replace(/\/\/[^\n]*/g, '');

  // Remove BOM if present
  fixed = fixed.replace(/^\uFEFF/, '');

  // Remove any non-printable characters except whitespace
  fixed = fixed.replace(/[^\x20-\x7E\s]/g, '');

  return fixed;
}

/**
 * More aggressive JSON fixing for severely malformed JSON
 */
function aggressiveJSONFix(json: string): string {
  let fixed = fixCommonJSONErrors(json);

  // Try to balance braces
  const openBraces = (fixed.match(/{/g) || []).length;
  const closeBraces = (fixed.match(/}/g) || []).length;
  if (openBraces > closeBraces) {
    fixed += '}'.repeat(openBraces - closeBraces);
  }

  // Try to balance brackets
  const openBrackets = (fixed.match(/\[/g) || []).length;
  const closeBrackets = (fixed.match(/]/g) || []).length;
  if (openBrackets > closeBrackets) {
    fixed += ']'.repeat(openBrackets - closeBrackets);
  }

  // Remove any text before the first { or [
  const firstBrace = fixed.indexOf('{');
  const firstBracket = fixed.indexOf('[');
  if (firstBrace !== -1 || firstBracket !== -1) {
    const start = Math.min(
      firstBrace === -1 ? Infinity : firstBrace,
      firstBracket === -1 ? Infinity : firstBracket
    );
    if (start !== Infinity) {
      fixed = fixed.substring(start);
    }
  }

  // Remove any text after the last } or ]
  const lastBrace = fixed.lastIndexOf('}');
  const lastBracket = fixed.lastIndexOf(']');
  const end = Math.max(lastBrace, lastBracket);
  if (end !== -1) {
    fixed = fixed.substring(0, end + 1);
  }

  return fixed;
}

/**
 * Parse JSON with type assertion and default fallback
 */
export function parseJSONWithDefault<T>(
  response: string,
  defaultValue: T,
  logContext?: string
): T {
  const jsonStr = extractJSON(response);

  if (!jsonStr) {
    if (logContext) {
      console.error(`[${logContext}] No JSON found in response, using default`);
    }
    return defaultValue;
  }

  const result = safeParseJSON<T>(jsonStr, defaultValue);

  if (result === defaultValue && logContext) {
    console.error(`[${logContext}] JSON parsing failed, using default`);
  }

  return result;
}
