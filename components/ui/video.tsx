export function Video() {
  return (
    <video width="320" height="540" controls preload="" playsInline className="rounded-3xl" autoPlay loop>
      <source src="/videos/aiPeeko.mp4" type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
  )
}