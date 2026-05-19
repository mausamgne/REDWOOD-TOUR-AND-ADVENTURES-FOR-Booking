export default function SectionControl({
  total = 3,
  active = 0,
  onChange,
}) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-300
            ${
              index === active
                ? "bg-[#3f6f1d] border-[#3f6f1d]"
                : "border-gray-400 bg-transparent"
            }`}
        />
      ))}
    </div>
  );
}
