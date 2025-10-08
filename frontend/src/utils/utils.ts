export function normalizeYouTubeUrl(url: string): string {
  return (
    url
      // 1) youtu.be/ID → www.youtube.com/embed/ID
      .replace(/^https?:\/\/youtu\.be\/([^?]+)/, (_m, id) => `https://www.youtube.com/embed/${id}`)
      // 2) youtube.com/watch?v=ID → www.youtube.com/embed/ID
      .replace(
        /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^?&]+)/,
        (_m, id) => `https://www.youtube.com/embed/${id}`,
      )
      // 3) only the first "?…=" → "/"
      .replace(/\?[^=]*=/, '/')
  );
}

export function getTweetId(url: string): string {
  try {
    // Parse the URL (throws if invalid)
    const parsed = new URL(url);
    // Use regex to find the digits after "/status/"
    const match = parsed.pathname.match(/\/status\/(\d+)/);
    return match ? match[1] : '';
  } catch {
    // URL constructor failed (invalid URL)
    return '';
  }
}
