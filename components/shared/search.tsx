import { Input } from "../ui/input";
import { redirect } from "next/navigation";

const Search = ({ fileName }: { fileName: string }) => {
  async function searchAssets(formData: FormData) {
    "use server";
    const searchQuery = formData.get("searchQuery")?.toString();

    if (searchQuery) {
      redirect(`/search/${fileName}?query=${searchQuery}&page=1`);
    }
  }

  return (
    <form action={searchAssets}>
      <div>
        <Input name="searchQuery" placeholder="search" />
      </div>
    </form>
  );
};

export default Search;
