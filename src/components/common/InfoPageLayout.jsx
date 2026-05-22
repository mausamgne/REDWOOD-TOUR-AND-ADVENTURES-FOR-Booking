export default function InfoPageLayout({ eyebrow, title, intro, children }) {
  return (
    <section className="bg-white">
      <div className="bg-[#f3f8ef] border-b border-green-100">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <p className="text-[#4f772d] font-bold uppercase tracking-widest mb-3">
            {eyebrow}
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
              {intro}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {children}
      </div>
    </section>
  );
}