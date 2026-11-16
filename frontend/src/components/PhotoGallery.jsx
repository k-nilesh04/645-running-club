const images = Object.values(import.meta.glob("../clubImage/*.{png,jpg,jpeg,webp}", { eager: true, import: "default" }));

export default function PhotoGallery() {
  if (!images.length) return null;

  return (
    <section className="overflow-hidden">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">From our Sundays</p><h2 className="mt-2 font-display text-2xl font-bold text-white">Good people. Good miles.</h2></div>
        <span className="hidden text-xs text-offwhite/40 sm:block">645 Run Club · Dwarka</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {images.slice(0, 8).map((src, index) => (
          <figure key={src} className={`group overflow-hidden bg-[#202420] ${index === 0 ? "col-span-2 row-span-2" : ""} ${index === 0 ? "aspect-square" : "aspect-[4/3]"}`}>
            <img src={src} alt={`645 Run Club community moment ${index + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
          </figure>
        ))}
      </div>
    </section>
  );
}