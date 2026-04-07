import { createAdminClient } from "./admin";

const BUCKET_NAME = "documents";

export async function uploadPdf(
  userId: string,
  documentId: string,
  buffer: Buffer,
  filename: string
): Promise<string> {
  const supabase = createAdminClient();

  const path = `${userId}/${documentId}/${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}
