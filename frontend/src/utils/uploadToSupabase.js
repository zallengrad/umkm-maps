import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export const uploadToSupabase = async (file, userId) => {
  const filename = `${userId}/${uuidv4()}-${file.name}`;
  console.log("[uploadToSupabase] Upload ke:", filename);

  const { data, error } = await supabase.storage.from("umkm-photos").upload(filename, file, {
    contentType: file.type,
  });

  if (error) {
    console.error("[uploadToSupabase] Gagal upload:", error.message);
    throw error;
  }

  const { data: publicData } = supabase.storage.from("umkm-photos").getPublicUrl(filename);

  console.log("[uploadToSupabase] Berhasil:", publicData.publicUrl);
  return publicData.publicUrl;
};
