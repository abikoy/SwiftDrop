import { createClient } from "@/lib/supabase/client";

/**
 * Upload a file to a Supabase Storage bucket.
 * Returns the public URL on success, throws on error.
 */
export async function uploadFile(
  bucket: "menu-images" | "payment-receipts",
  file: File,
  pathPrefix?: string
): Promise<string> {
  const supabase = createClient();

  // Build a unique path: prefix/timestamp-randomhex.ext
  const ext = file.name.split(".").pop() ?? "jpg";
  const randomHex = Math.random().toString(16).slice(2, 10);
  const filename = `${Date.now()}-${randomHex}.${ext}`;
  const path = pathPrefix ? `${pathPrefix}/${filename}` : filename;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

/**
 * Delete a file from storage given its full public URL.
 * Silently ignores failures (best-effort cleanup).
 */
export async function deleteStorageFile(
  bucket: "menu-images" | "payment-receipts",
  publicUrl: string
): Promise<void> {
  try {
    const supabase = createClient();
    // Extract the path from the URL (everything after /object/public/<bucket>/)
    const marker = `/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const path = decodeURIComponent(publicUrl.slice(idx + marker.length));
    await supabase.storage.from(bucket).remove([path]);
  } catch {
    // Non-fatal — ignore
  }
}
