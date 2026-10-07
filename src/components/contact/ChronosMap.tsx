/** Preserve Google's own place label and marker instead of drawing a separate pin. */
export function googlePlaceEmbed(embed: string, placeUrl: string, title: string): string {
  // Google's @ coordinates describe the camera, not the business location.
  const featureId = placeUrl.match(/!1s(0x[\da-f]+:0x[\da-f]+)/i)?.[1];
  const coordinates = placeUrl.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const placeName = placeUrl.match(/\/place\/([^/]+)/)?.[1];
  if (featureId && coordinates?.[1] && coordinates[2]) {
    let label = title;
    try {
      if (placeName) label = decodeURIComponent(placeName.replace(/\+/g, " "));
    } catch {
      // Keep the ship name if a saved place URL contains malformed encoding.
    }
    const pb = `!1m18!1m12!1m3!1d2000!2d${coordinates[2]}!3d${coordinates[1]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${featureId}!2s${encodeURIComponent(label)}!5e0!3m2!1sen!2sus!4v1791345600000!5m2!1sen!2sus`;
    return `https://www.google.com/maps/embed?pb=${pb}`;
  }
  return embed;
}

export function ChronosMap({ embed, placeUrl, title }: { embed: string; placeUrl: string; title: string }) {
  return (
    <iframe
      title={`${title} — Google Maps`}
      src={googlePlaceEmbed(embed, placeUrl, title)}
      loading="lazy"
      allowFullScreen
      className="h-full w-full border-0"
    />
  );
}