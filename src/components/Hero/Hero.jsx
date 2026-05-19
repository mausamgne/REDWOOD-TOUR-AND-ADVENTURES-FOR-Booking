export default function Hero() {
  return (
    <section className="relative w-full h-[75vh] lg:h-[90vh]">
      {/* Background Image */}
      <img
        src="https://redwoodnationalparktours.com/public/images/image_banner.webp"
        alt="Redwood Banner"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
    </section>
  );
}
