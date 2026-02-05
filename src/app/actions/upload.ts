"use server"

import { createClient } from "@/lib/supabase/server"

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File
  if (!file) {
    throw new Error("No file uploaded")
  }

  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Upload to 'covers' bucket
  // Ensure bucket exists and has policies:
  // INSERT: authenticated
  // SELECT: public
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage
    .from('covers')
    .upload(filePath, file)

  if (error) {
    throw new Error("Upload failed: " + error.message)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('covers')
    .getPublicUrl(filePath)

  return { publicUrl }
}
