import { useMemo } from "react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from "react-virtualized";
import ReusableAlert from "../Alert/ReusableAlert";
import "./ErrorPopup.css";

const ErrorPopup = ({ errors }: any) => {
  const processedErrors = useMemo(() => {
    // Group errors by row number
    const errorGroups = errors.reduce((groups: any, error: any) => {
      const rowMatch = error.match(/Row (\d+):/);
      const columnMatch = error.match(/"([^"]*)" (?:is required|value)/);
      const errorMsg = error.split(": ").slice(1).join(": ");

      const rowNumber = rowMatch ? rowMatch[1] : "N/A";
      const columnName = columnMatch
        ? columnMatch[1]
        : error.includes("Collaborative Space", "Quantity")
          ? "Collaborative Space"
          : "N/A";

      if (!groups[rowNumber]) {
        groups[rowNumber] = {
          rowNumber,
          columns: [],
          errors: [],
        };
      }

      groups[rowNumber].columns.push(columnName);
      groups[rowNumber].errors.push(errorMsg || error);

      return groups;
    }, {});

    // Convert groups to array and sort by row number
    return Object.values(errorGroups).sort(
      (a: any, b: any) => Number(a.rowNumber) - Number(b.rowNumber),
    );
  }, [errors]);

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 50,
  });

  const rowRenderer = ({ key, index, style, parent }: any) => {
    const error: any = processedErrors[index];
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        columnIndex={0}
        rowIndex={index}
        parent={parent}
      >
        <div style={style} className="table-row">
          <div className="table-cell" style={{ width: "15%" }}>
            {error.rowNumber}
          </div>
          <div className="table-cell" style={{ width: "25%" }}>
            {error.columns.map((column: any, i: number) => (
              <div key={i}>{column}</div>
            ))}
          </div>
          <div className="table-cell" style={{ width: "60%" }}>
            <ul className="error-list">
              {error.errors.map((err: any, i: number) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div className="error-popup-container">
      <ReusableAlert
        variant="danger"
        message={
          <>
            <strong>⚠️ Note:</strong> Below reports show only uploaded
            spreadsheet error rows. To resolve these issues, update the
            spreadsheet and re-import. ({processedErrors.length} errors found)
          </>
        }
        className="custom-alert"
      />

      <div className="table-wrapper">
        {/* Static Header */}
        <div className="static-header">
          <div className="header-cell" style={{ width: "15%" }}>
            Row Number
          </div>
          <div className="header-cell" style={{ width: "25%" }}>
            Column Name
          </div>
          <div className="header-cell" style={{ width: "60%" }}>
            Error Description
          </div>
        </div>

        {/* Virtualized Error List */}
        <div className="table-container">
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={processedErrors.length}
                rowHeight={cache.rowHeight}
                deferredMeasurementCache={cache}
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopup;
