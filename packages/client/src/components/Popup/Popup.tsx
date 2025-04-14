import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import useToast from "../../hooks/useToast";
import { MSG_EMPTYADD_ERROR } from "../../utils/toastMessages";
import "./Popup.css";

const AvailablePlant = forwardRef(({ data, columns, addedItem }: any, ref) => {
  const { showWarningToast } = useToast();
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    setRowSelection({}); // Reset selection when data changes
  }, [data]);

  const addPlant = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedItems = selectedRows.map(
      (item: any) => item.original["Available Plant"],
    );

    if (selectedItems.length === 0) {
      showWarningToast(MSG_EMPTYADD_ERROR);
      return;
    }

    addedItem(selectedItems); // Send selected items to parent
    setRowSelection({}); // Reset selection
  };

  // Expose the addPlant function to parent
  useImperativeHandle(ref, () => ({
    addPlant,
  }));

  const enhancedColumns = useMemo(() => {
    const selectionColumn = {
      id: "select",
      cell: ({ row }: any) => (
        <input
          type="checkbox"
          className="form-check-input"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    };
    return [selectionColumn, ...columns];
  }, [columns]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div>
        <button
          type="button"
          className="btn btn-outline-primary me-3"
          onClick={() => {
            table.getRowModel().rows.forEach((row) => row.toggleSelected(true));
          }}
        >
          Select All
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            table
              .getRowModel()
              .rows.forEach((row) => row.toggleSelected(false));
          }}
        >
          Deselect All
        </button>
      </div>

      {table.getRowModel().rows.length > 0 ? (
        <div className="overflow-auto" style={{ maxHeight: "60vh" }}>
          {table.getRowModel().rows.map((row: any) => (
            <div
              key={row.id}
              className="p-3 border-bottom d-flex align-items-center"
              style={{
                backgroundColor: row.getIsSelected() ? "#d5e8f2" : "inherit",
              }}
            >
              <div className="me-3">
                {flexRender(
                  row.getVisibleCells()[0].column.columnDef.cell,
                  row.getVisibleCells()[0].getContext(),
                )}
              </div>
              <div>{row.original[columns[0].accessorKey]}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted p-3">No data available</p>
      )}
    </>
  );
});

export default AvailablePlant;
