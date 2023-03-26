import { type NextPage } from "next";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/utils/zod-form";

const schema = z.object({
  query: z.string().min(1),
});

const Home: NextPage = () => {
  const form = useZodForm({ schema });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    void form.handleSubmit((data) => {
      console.log(data);
    })(e);

  return (
    <>
      <h1>Testudo Tracker</h1>
      <p>
        A student run website that tracks seat availability for courses at the
        University of Maryland, College Park
      </p>
      <form onSubmit={onSubmit}>
        <Input {...form.register("query")} />
        <Button>Search</Button>
      </form>
    </>
  );
};

export default Home;
