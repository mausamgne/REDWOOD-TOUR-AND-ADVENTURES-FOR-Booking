import { useParams } from "react-router-dom";

export default function CategoryPage() {
  const { categorySlug } = useParams();

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold">
        Category: {categorySlug}
      </h1>
    </div>
  );
}
