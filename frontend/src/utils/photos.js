export function parsePhotos(photos) {
  if (Array.isArray(photos)) {
    return photos.filter((photo) => typeof photo === "string" && photo.trim());
  }

  if (typeof photos !== "string" || !photos.trim()) {
    return [];
  }

  try {
    // The MLS feed stores photos as a JSON string, so malformed feed data
    // should produce an empty gallery instead of breaking the property page.
    const parsed = JSON.parse(photos);
    return Array.isArray(parsed)
      ? parsed.filter((photo) => typeof photo === "string" && photo.trim())
      : [];
  } catch (error) {
    return [];
  }
}
