import Heading from "../common/Heading";

export default function TitleSection({ title }) {
  if (!title) return null;

  return (
    <Heading as="h1" split shadow>
      {title}
    </Heading>
  );
}
