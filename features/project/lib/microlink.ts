export function getMicrolinkScreenshot(
  url: string,
  opts: { width?: number; height?: number } = {}
): string {
  const { width = 1280, height = 800 } = opts;
  const params = new URLSearchParams({
    url,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    "viewport.width": String(width),
    "viewport.height": String(height),
    "viewport.deviceScaleFactor": "1",
  });
  return `https://api.microlink.io/?${params.toString()}`;
}

export function resolveProjectMedia(p: {
  media?: string;
  link?: string;
  isVideo?: boolean;
}): { src: string; isVideo: boolean } | null {
  if (p.media && p.media.trim()) {
    return { src: p.media.trim(), isVideo: !!p.isVideo };
  }
  if (p.link && p.link.trim()) {
    return { src: getMicrolinkScreenshot(p.link.trim()), isVideo: false };
  }
  return null;
}
