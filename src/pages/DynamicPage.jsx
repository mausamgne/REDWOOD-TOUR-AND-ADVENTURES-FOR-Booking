import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DynamicPage() {

  const { pageSlug } = useParams();

  const [pageData, setPageData] = useState(null);

  useEffect(() => {

    fetch(
      "https://adminzwy8.redwoodnationalparktours.com/api/get_homepage?lang_id=1&website_id=1"
    )
      .then((res) => res.json())
      .then((data) => {

        // quick links search
        const foundPage = data?.quick_links?.find(
          (item) => item.page_slug === pageSlug
        );

        setPageData(foundPage);

      })
      .catch((err) => console.log(err));

  }, [pageSlug]);

  if (!pageData) {
    return (
      <div className="py-32 text-center text-3xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <section className="max-w-[1200px] mx-auto py-20 px-5">

      <h1 className="text-5xl font-bold mb-8">
        {pageData.name}
      </h1>

      <div
        className="text-lg leading-8"
        dangerouslySetInnerHTML={{
          __html: pageData.description || "No Content Found",
        }}
      />

    </section>
  );
}