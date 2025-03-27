import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useOrgListQuery, useRdoListQuery } from "src/slices/apis/app.api";
import { useDrop, useDrag } from "react-dnd";
import { useRef, useEffect } from "react";

const ItemType = {
  PLANT: "plant",
};

const DraggableItem = ({
  item,
  type,
  selectedItems,
}: {
  item: string;
  type: string;
  selectedItems: string[];
}) => {
  const isSelected = selectedItems.includes(item);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.PLANT,
    item: { name: item, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    // canDrag: !isSelected, // Prevent dragging if item is selected
  });

  const listItemRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (listItemRef.current) {
      drag(listItemRef.current);
    }
  }, [drag]);

  return (
    <ListItem
      ref={listItemRef}
      sx={{
        opacity: isSelected ? 0.5 : isDragging ? 0.5 : 1,
        // cursor: isSelected ? "not-allowed" : "grab",
        cursor: "grab",
        backgroundColor: isSelected ? "#ddd" : "#f5f5f5",
        border: !isSelected ? "1px solid" : "none",
        margin: "5px 0",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <ListItemText primary={item} />
    </ListItem>
  );
};

export const DropdownMultiSelect: React.FC<{
  selectedItems: string[];
  onChange: (items: string[]) => void;
  disabled: boolean;
}> = ({ selectedItems, onChange }) => {
  const { data: rdoList } = useRdoListQuery({});
  const { data: orgList } = useOrgListQuery({});

  const dropRef = useRef<HTMLDivElement | null>(null);
  const removeRef = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.PLANT,
    drop: (item: { name: string }) => {
      if (!selectedItems.includes(item.name)) {
        onChange([...selectedItems, item.name]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isOver: isOverRemove }, removeDrop] = useDrop({
    accept: ItemType.PLANT,
    drop: (item: { name: string }) => {
      onChange(selectedItems.filter((plant) => plant !== item.name));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (dropRef.current) drop(dropRef.current);
    if (removeRef.current) removeDrop(removeRef.current);
  }, [drop, removeDrop]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Paper sx={{ padding: 2, maxHeight: 150, overflowY: "auto" }}>
        <Typography variant="subtitle1">Available RDOs</Typography>
        <List>
          {rdoList?.data?.map((rdo: string) => (
            <DraggableItem
              key={rdo}
              item={rdo}
              type="rdo"
              selectedItems={selectedItems}
            />
          ))}
        </List>
      </Paper>

      <Paper sx={{ padding: 2, maxHeight: 150, overflowY: "auto" }}>
        <Typography variant="subtitle1">Available Organizations</Typography>
        <List>
          {orgList?.data?.map((org: string) => (
            <DraggableItem
              key={org}
              item={org}
              type="org"
              selectedItems={selectedItems}
            />
          ))}
        </List>
      </Paper>

      <Paper
        ref={dropRef}
        sx={{
          padding: 2,
          minHeight: 100,
          border: "2px dashed",
          borderColor: isOver ? "blue" : "gray",
          backgroundColor: isOver ? "#e3f2fd" : "white",
          transition: "0.3s",
        }}
      >
        <Typography variant="subtitle1">Selected Plants</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selectedItems.map((item) => (
            <Chip
              key={item}
              label={item}
              color="primary"
              sx={{ cursor: "grab" }}
            />
          ))}
        </Box>
      </Paper>

      <Paper
        ref={removeRef}
        sx={{
          padding: 2,
          minHeight: 50,
          textAlign: "center",
          border: "2px dashed",
          borderColor: isOverRemove ? "red" : "gray",
          backgroundColor: isOverRemove ? "#ffebee" : "white",
          transition: "0.3s",
        }}
      >
        <Typography variant="subtitle1" color="error">
          Drag here to remove
        </Typography>
      </Paper>
    </Box>
  );
};
