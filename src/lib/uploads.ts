import path from "node:path";

export function uploadsDir() {
  return (
    process.env.PR_UPLOADS_DIR ??
    path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "uploads")
  );
}
