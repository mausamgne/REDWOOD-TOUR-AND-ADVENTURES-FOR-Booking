import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TourCard from "../components/sections/TourCard";

export default function CategoryPage() {

  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const [tours,setTours] = useState([]);
  const [category,setCategory] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    window.scrollTo(0,0);

    fetch(
    "https://adminzwy8.redwoodnationalparktours.com/api/get_homepage?lang_id=1&website_id=1"
  )
    .then(res=>res.json())
    .then(data=>{

      console.log(data);

      const selectedCategory = data?.top_navigation?.find((cat) => {
  const slug =
    cat?.cat_slug ||
    cat?.cat_name
      ?.toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return slug === categorySlug;
});

setCategory(selectedCategory);
setTours(selectedCategory?.tours || []);

      setLoading(false);

    })
    .catch(err=>{
      console.log(err);
      setLoading(false);
    });

  },[categorySlug]);

  if(loading){
    return (
      <div className="py-32 text-center text-5xl font-bold">
        Loading...
      </div>
    )
  }

  return (

    <section className="py-20 px-6">

      <div className="max-w-[1300px] mx-auto">

        <h1 className="text-5xl text-center text-[#3f6f1d] font-bold mb-16">
          {category?.cat_meta_title || category?.cat_main_title || category?.cat_name}
        </h1>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-8
        ">

          {tours.map((tour)=>(

            <TourCard

              key={tour.tour_id}

              image={tour.tour_thumbnail}

              title={
                tour.tour_title_for_category
                || tour.tour_title
              }

              description={
                tour.tour_description_for_category
              }

              badges={[
                tour.is_popular,
                tour.is_recommended
              ].filter(Boolean)}

              slug={tour.tour_slug}

              onClick={()=>
                navigate(`/tour/${tour.tour_slug}`)
              }

            />

          ))}

        </div>

      </div>

    </section>

  )

}