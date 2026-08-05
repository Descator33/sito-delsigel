/** Foto-collage con la cornice perforata da francobollo. */
export function Francobollo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`stamp ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
    </div>
  );
}
