import axios from "axios";
import * as XLSX from "xlsx"; // For Excel export
import FileSaver from "file-saver";

export const loadWAFData = async () => {
  return await new Promise((resolve, reject) => {
    (window as any).require(
      ["DS/WAFData/WAFData"],
      (module: any) => {
        resolve(module);
      },
      reject
    );
  });
};
export const loadInterCom = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    (window as any).require(
      ["UWA/Utils/InterCom"],
      (InterCom: any) => {
        resolve(InterCom);
      },
      (error: any) => {
        console.error("Error loading InterCom module:", error);
        reject(error);
      }
    );
  });
};

export const loadPlatformAPI = () => {
  return new Promise((resolve, reject) => {
    (window as any).require(
      ["DS/PlatformAPI/PlatformAPI"],
      (PlatformAPI: any) => {
        if (PlatformAPI) {
          resolve(PlatformAPI);
        } else {
          reject(new Error("Failed to load PlatformAPI"));
        }
      },
      reject
    );
  });
};

export const callwebService = async (method: any, url: any, body: any) => {
  let returnobj: any = {};
  const WAFData: any = await loadWAFData();
  let dataResp = WAFData.authenticatedRequest(url, {
    method: method,
    data: body,
    type: "json",
    async: false,
    onComplete: function (dataResp: any) {
      returnobj.status = true;
      returnobj.output = dataResp;
      console.log("kp--CallWebService--- >> ", dataResp);
    },
    onFailure: function (error: any, _: any, response_hdrs: any) {
      console.log("Failedddddd", error.message);
      returnobj.status = false;
      console.log(response_hdrs);
      (window as any).widget.body.innerHTML +=
        "<p>Something Went Wrong" + error + "</p>";
    },
  });

  dataResp;
  return returnobj;
};
export const makeDraggable = (
  element: any,
  data: any,
  onDragStart: any,
  onDragEnd: any
) => {
  (window as any).require(
    ["DS/DataDragAndDrop/DataDragAndDrop"],
    (DataDragAndDrop: any) => {
      if (DataDragAndDrop) {
        DataDragAndDrop.draggable(element, {
          data: JSON.stringify(data),
          start: function () {
            if (onDragStart) onDragStart();
          },
          stop: function () {
            console.log("Drag End"); // Check if this is logged
            if (onDragEnd) onDragEnd();
          },
        });
      }
    }
  );
};
export const callEnoviaWebService = async (
  method: any,
  url: any,
  body: any,
  headers: any
) => {
  console.log("Url is:", url);
  try {
    const WAFData: any = await loadWAFData();

    return new Promise((resolve, reject) => {
      WAFData.authenticatedRequest(url, {
        method: method,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(body),
        type: "json",
        onComplete: function (response: any) {
          console.log("Response for the service is:", response);
          resolve({ status: true, output: response });
        },
        onFailure: function (error: any) {
          console.error("API request failed:", error);
          reject({ status: false, error });
        },
      });
    });
  } catch (error) {
    console.error("Error in callEnoviaWebService:", error);
    return { status: false, error };
  }
};

export const fetchData = async (
  method = "GET",
  url: string,
  body: any = null

  // headers = {}
) => {
  console.log("Fetching URL:", url);
  console.log("Method is:");
  console.log("Request Body:", JSON.stringify(body, null, 2));

  try {
    const response = await axios({
      url,
      method,
      // headers: {
      //   ...headers,
      //   "Content-Type": "application/json",
      // },
      data: body, // Include body only if provided
    });

    console.log("Response received:", response.data);
    return response;
  } catch (error) {
    console.error("Request failed:", error);
    throw error; // Propagate the error to the caller
  }
};

export const excludeFields = ["Dropped Revision ID"];
///hello all//

// export const handleExportExcel = (tableData, fileName = "table-data.xlsx") => {
//   const filteredData = tableData.map((row) => {
//     return Object.keys(row)
//       .filter((key) => !excludeFields.includes(key))
//       .reduce((obj, key) => {
//         obj[key] = row[key];
//         return obj;
//       }, {});
//   });

//   console.log("Filtered Data for Excel Export:", filteredData);

//   const worksheet = XLSX.utils.json_to_sheet(filteredData);

//   const columnWidths = Object.keys(filteredData[0] || {}).map((key) => ({
//     wch:
//       Math.max(
//         key.length,
//         ...filteredData.map((row) =>
//           row[key] ? row[key].toString().length : 0
//         )
//       ) || 10, // Fallback to 10 if width calculation is invalid
//   }));
//   worksheet["!cols"] = columnWidths;

//   // Apply text wrapping to all cells in the worksheet
//   const range = XLSX.utils.decode_range(worksheet["!ref"]);
//   for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
//     for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
//       const cell = worksheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
//       if (cell) {
//         cell.s = {
//           alignment: { wrapText: true },
//         };
//       }
//     }
//   }
// };
export const handleExportExcel = (
  tableData: any,
  fileName = "table-data.xlsx"
) => {
  console.log("handleExportExcel started", { fileName }); // ADD THIS LINE
  const filteredData = tableData.map((row: any) => {
    return Object.keys(row)
      .filter((key) => !excludeFields.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = row[key];
        return obj;
      }, {});
  });

  console.log("Filtered Data for Excel Export:", filteredData); // Keep this

  const worksheet: any = XLSX.utils.json_to_sheet(filteredData);
  console.log("Worksheet created"); // ADD THIS LINE

  const columnWidths = Object.keys(filteredData[0] || {}).map((key) => ({
    wch:
      Math.max(
        key.length,
        ...filteredData.map((row: any) =>
          row[key] ? row[key].toString().length : 0
        )
      ) || 10,
  }));
  worksheet["!cols"] = columnWidths;

  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
      if (cell) {
        cell.s = {
          alignment: { wrapText: true },
        };
      }
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  console.log("Workbook created and sheet appended"); // ADD THIS LINE

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  console.log("Excel buffer created"); // ADD THIS LINE
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  console.log("Blob data created"); // ADD THIS LINE

  FileSaver.saveAs(data, fileName);
  console.log("FileSaver.saveAs called"); // ADD THIS LINE
};

/// Handle row selection and row range selection//
export const getRowRange = (rows: any, idA: any, idB: any) => {
  const range = [];
  let foundStart = false;
  let foundEnd = false;
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row.id === idA || row.id === idB) {
      if (foundStart) {
        foundEnd = true;
      }
      if (!foundStart) {
        foundStart = true;
      }
    }
    if (foundStart) {
      range.push(row);
    }
    if (foundEnd) {
      break;
    }
  }
  if (!foundEnd) {
    throw new Error("Could not find whole row range");
  }
  return range;
};

// /// Download template for Mass-Upload //

// // Handler for downloading template based on selected operation option
// export const downloadTemplate = (showErrorToast) => (operationChoice) => {
//   let url = "";
//   switch (operationChoice) {
//     case "1": // Physical Product/Raw Material
//       url =
//         "https://khanfarzan17.github.io/mass-upload-testing/PhysicalProductSpreadSheetTemplate.xlsx";
//       break;
//     case "2": // Physical Product Structure
//       url =
//         "https://khanfarzan17.github.io/mass-upload-testing/PhysicalProductStructureSpreadSheetTemplate.xlsx";
//       break;
//     case "3": // Document
//       url =
//         "https://khanfarzan17.github.io/mass-upload-testing/DocumentSpreadSheetTemplate.xlsx";
//       break;
//     case "4": // Physical Product-Document
//       url =
//         "https://khanfarzan17.github.io/mass-upload-testing/PhysicalProduct-DocumentSpreadSheetTemplate.xlsx";
//       break;
//     default:
//       showErrorToast(MSG_DROPDOWN_NOT_SELECTED);
//       return;
//   }
//   (window as any).open(url, "_blank");
// };
