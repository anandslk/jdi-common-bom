import { HelmetTitle } from "src/components/HelmetTitle";
import { NotFoundView } from "src/components/not-found-view";

export default function Page() {
  return (
    <>
      <HelmetTitle title="404 page not found! | Error" />

      <NotFoundView />
    </>
  );
}
