"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useArtistSalon } from "@/lib/hooks/useArtistSalon";
import { ImagePlus, X, Images } from "lucide-react";

export default function PortfolioPage() {
  const { salon, isLoading, refetch } = useArtistSalon();
  const [imageUrl, setImageUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const images = salon?.gallery_images || [];

  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!salon || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    setIsAdding(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${salon.id}/${fileName}`;

    try {
      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('salon-covers')
        .upload(filePath, file);

      if (uploadError) {
        alert("Upload failed: " + uploadError.message + "\n\nPlease ensure you have created a PUBLIC bucket named 'salon-covers' in Supabase Storage.");
        throw uploadError;
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('salon-covers')
        .getPublicUrl(filePath);

      // 3. Save to database
      const updatedImages = [...images, publicUrl];
      const { error: dbError } = await supabase
        .from("salons")
        .update({ gallery_images: updatedImages })
        .eq("id", salon.id);

      if (dbError) throw dbError;
      
      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      setIsAdding(false);
    }
  }

  async function addItem() {
    if (!salon || !imageUrl) return;
    setIsAdding(true);

    const updatedImages = [...images, imageUrl];
    const { error } = await supabase
      .from("salons")
      .update({ gallery_images: updatedImages })
      .eq("id", salon.id);

    if (!error) {
      setImageUrl("");
      await refetch();
    }
    setIsAdding(false);
  }

  async function deleteItem(urlToRemove: string) {
    if (!salon) return;

    const updatedImages = images.filter((url: string) => url !== urlToRemove);
    const { error } = await supabase
      .from("salons")
      .update({ gallery_images: updatedImages })
      .eq("id", salon.id);

    if (!error) {
      setConfirmDelete(null);
      await refetch();
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-blush" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/70" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-white/70" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gold/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-dm-sans text-xs uppercase tracking-wide text-charcoal/40 mb-1">
            Artist dashboard
          </p>
          <h1 className="font-cormorant text-3xl text-primary">Portfolio</h1>
        </div>
        <p className="font-dm-sans text-sm text-charcoal/50">
          {images.length === 0
            ? "Your best work, ready to greet a bride"
            : `${images.length} photo${images.length === 1 ? "" : "s"} on your public page`}
        </p>
      </div>

      {/* Add photo */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6 space-y-4">
        <h2 className="font-cormorant text-xl text-primary">Add a photo</h2>
        <p className="font-dm-sans text-xs text-charcoal/50">
          Upload an image directly from your device, or paste a hosted URL.
        </p>

        <div className="flex flex-col gap-4">
          {/* File Upload Option */}
          <div className="flex items-center gap-3 border-2 border-dashed border-gold/30 rounded-xl p-6 bg-cream/30 hover:bg-cream/60 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading || isAdding}
              className="block w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gold file:text-white hover:file:bg-gold/90"
            />
            {uploading && <span className="text-sm font-dm-sans text-primary">Uploading...</span>}
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-gold/20"></div>
            <span className="text-xs font-dm-sans text-charcoal/50 uppercase tracking-widest">OR PASTE URL</span>
            <div className="h-px flex-1 bg-gold/20"></div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isAdding && imageUrl && addItem()}
              placeholder="https://…"
              className="flex-1 rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
            />
            <button
              onClick={addItem}
              disabled={isAdding || !imageUrl}
              className="flex items-center justify-center gap-2 rounded-full border border-gold px-6 py-2.5 font-dm-sans text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-white disabled:opacity-50"
            >
              <ImagePlus size={15} />
              {isAdding && !uploading ? "Adding…" : "Add URL"}
            </button>
          </div>
        </div>

        {imageUrl && (
          <div className="flex items-center gap-3 rounded-lg border border-gold/15 bg-blush/30 p-3">
            <img
              src={imageUrl}
              alt="Preview"
              className="h-16 w-16 rounded-md border border-gold/20 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.2";
              }}
            />
            <p className="font-dm-sans text-xs text-charcoal/50">
              Preview — this is how it'll look in your grid
            </p>
          </div>
        )}
      </div>

      {/* Gallery */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gold/25 bg-white/60 py-16 text-center">
          <Images size={28} className="text-gold/40" />
          <p className="font-cormorant text-lg text-primary">No photos yet</p>
          <p className="max-w-xs font-dm-sans text-xs text-charcoal/50">
            Add a few photos above so brides can see your work before they book.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((url: string, index: number) => (
            <div
              key={url + index}
              className="group relative aspect-square overflow-hidden rounded-xl border border-gold/20 bg-blush/20"
            >
              <img
                src={url}
                alt={`Portfolio item ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              {confirmDelete === url ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-charcoal/70 p-3 text-center">
                  <p className="font-dm-sans text-xs text-white">Remove this photo?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteItem(url)}
                      className="rounded-full bg-rose px-3 py-1 font-dm-sans text-xs text-white hover:bg-rose/90"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="rounded-full bg-white/15 px-3 py-1 font-dm-sans text-xs text-white hover:bg-white/25"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(url)}
                  aria-label="Remove photo"
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-charcoal/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}