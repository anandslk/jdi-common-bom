import { Image } from "react-bootstrap";
import "../../components/DragAndDrop/DragAndDrop.css"; // Import styles for the component
import SearchInput from "../../components/SearchInput/SearchInput";
import useInterComSearch from "../../hooks/useInterComSearch";
import useBOSDropableArea from "../../hooks/useBOSDropableArea";

const DragAndDropComponent = () => {
  const { handleDrop } = useBOSDropableArea();
  const { performSearch } = useInterComSearch();

  const handleSearch = (searchText: string) => {
    const searchOpts = {
      title: "Search",
      role: "",
      mode: "furtive",
      default_with_precond: true,
      precond:
        'flattenedtaxonomies:"types/VPMReference" OR flattenedtaxonomies:"types/Raw_Material" OR flattenedtaxonomies:"types/Document"',
      show_precond: false,
      multiSel: false,
      idcard_activated: false,
      select_result_max_idcard: false,
      itemViewClickHandler: "",
      search_delegation: "3dsearch",
    };

    const handleSearchResults = (selectedObjects: any) => {
      console.log("Selected objects:", selectedObjects);
      console.log("objectId: selectedObjects[0].id", selectedObjects[0].id);
      if (
        selectedObjects &&
        selectedObjects.length > 0 &&
        selectedObjects[0].id
      ) {
        handleDrop([
          {
            objectId: selectedObjects[0].id,
            objectType: selectedObjects[0]["ds6w:type_value"],
          },
        ]);
      } else {
        console.warn("No objectId found in selected objects");
      }
    };

    performSearch(searchText, searchOpts, handleSearchResults);
  };

  return (
    <>
      <div className="droppable-container mt-4">
        <Image
          style={{ width: "90px", height: "90px" }}
          src="https://thewhitechamaleon.github.io/testrapp/images/drag.png"
          alt="Data Collect"
          className="search-icon"
        />
        <span className="drag-and-drop-text">Drag and Drop</span>
        <div className="divider-container">
          <hr className="divider" />
          <span className="divider-text">or</span>
          <hr className="divider" />
        </div>
        <SearchInput onSearch={handleSearch} />
      </div>
    </>
  );
};

export default DragAndDropComponent;
