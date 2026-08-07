export function parsePhotos(photos) {
  if (Array.isArray(photos)) {
    return photos.filter((photo) => typeof photo === "string" && photo.trim());
  }

  if (typeof photos !== "string" || !photos.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(photos);
    return Array.isArray(parsed)
      ? parsed.filter((photo) => typeof photo === "string" && photo.trim())
      : [];
  } catch (error) {
    return [];
  }
}
