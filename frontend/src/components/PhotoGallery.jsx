const images = Object.values(import.meta.glob("../clubImage/*.{png,jpg,jpeg,webp}", { eager: true, import: "default" }));

function PhotoLane({ items, direction = "left", label }) {
  if (!items.length) return null;
  const repeated = [...items, ...items];

  return (
    <div className={`photo-marquee-lane photo-marquee-${direction}`} aria-label={label}>
      <div className="photo-marquee-track">
        {repeated.map((src, index) => (
          <figure
            key={`${direction}-${index}-${src}`}
            className="photo-marquee-item"
            aria-hidden={index >= items.length ? "true" : undefined}
          >
            <img
              src={src}
              alt={index >= items.length ? "" : `645 Run Club community moment ${index + 1}`}
              loading="lazy"
              decoding="async"
            />
            <span className="photo-marquee-shade" />
            {index < items.length && <figcaption>645 Run Club <span>·</span> Sunday miles</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function PhotoGallery() {
  if (!images.length) return null;
  const galleryImages = images.slice(0, 12);
  const secondLane = [...galleryImages].reverse();

  return (
    <section className="photo-gallery-section" aria-label="645 Run Club photo gallery">
      <div className="mb-7 flex items-end justify-between gap-4 px-5 sm:px-7 lg:px-10">
        <div>
          <p className="eyebrow">Real people. Real moments.</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">The miles we make <span className="text-[#a9e66e]">together.</span></h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">A little glimpse of the energy, friendships and memories from our Sunday runs.</p>
        </div>
        <span className="hidden shrink-0 rounded-full border border-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-white/40 sm:inline-flex">645 · Dwarka</span>
      </div>

      <div className="photo-marquee" role="region" aria-label="Moving photos from 645 Run Club. Animation pauses when focused or hovered.">
        <PhotoLane items={galleryImages} direction="left" label="Run club photos moving left" />
        {galleryImages.length > 2 && <PhotoLane items={secondLane} direction="right" label="Run club photos moving right" />}
      </div>
    </section>
  );
}