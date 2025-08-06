import { createVertex } from "@ai-sdk/google-vertex";
import { LanguageModel, wrapLanguageModel } from "ai";
import z from "zod";

export const vertex = (region: "europe-west1" | "us-central1") =>
  createVertex({
    project: process.env.GCP_PROJECT_ID!,
    location: region,
    googleAuthOptions: {
      credentials: {
        client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL!,
        // https://stackoverflow.com/questions/74131595/error-error1e08010cdecoder-routinesunsupported-with-google-auth-library
        private_key: process.env
          .GCP_SERVICE_ACCOUNT_PRIVATE_KEY!.split(String.raw`\n`)
          .join("\n"),
      },
    },
  });

export const aiModelIdSchema = z.enum([
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
]);
export type AiModel = z.infer<typeof aiModelIdSchema>;

export const getModel = (
  inputModel: AiModel,
  { cache }: { cache?: boolean } = {}
) => {
  const vertexEU = vertex("europe-west1");
  const MODELS: Record<AiModel, Exclude<LanguageModel, string>> = {
    "gemini-2.0-flash": vertexEU("gemini-2.0-flash-001"),
    "gemini-2.5-flash": vertexEU("gemini-2.5-flash"),
    "gemini-2.5-pro": vertexEU("gemini-2.5-pro"),
  } as const;

  const model = MODELS[inputModel];

  if (!cache) {
    return model;
  }

  return wrapLanguageModel({
    model,
    middleware: [],
  });
};

export { generateObject } from "ai";
