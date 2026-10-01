// Provider-neutral AI interface. Feature code depends on this, never on a
// vendor SDK, so models can be swapped or fall back without touching callers.

export interface AiImage {
  mediaType: "image/png" | "image/jpeg";
  /** Base64-encoded image data. */
  data: string;
}

export interface StructuredRequest {
  system: string;
  prompt: string;
  /** Page renders for vision-capable models. */
  images?: AiImage[];
  /** JSON Schema the response must satisfy. */
  schema: Record<string, unknown>;
  schemaName: string;
}

export interface AiProvider {
  readonly name: string;
  /**
   * Returns parsed JSON matching `schema`. Implementations validate and retry
   * on malformed output, and throw AiError when they give up.
   */
  generateStructured<T>(request: StructuredRequest): Promise<T>;
}

export type AiErrorCode = "unavailable" | "invalid_output" | "not_configured";

export class AiError extends Error {
  constructor(
    public readonly code: AiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AiError";
  }
}
