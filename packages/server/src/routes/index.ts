import express, { Request, Response } from "express";
import { ICustomResponse } from "src/middlewares/response.middleware";
import { v4 as uuidv4 } from "uuid";

export const router = express.Router();

/**
 * @swagger
 * /rdo-list:
 *   get:
 *     summary: Retrieve a list of RDOs
 *     description: Returns a list of all available RDOs.
 *     responses:
 *       200:
 *         description: A list of RDOs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Data found successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get("/rdo-list", (_: Request, res: Response) => {
  const RDOList: string[] = [
    "FSA",
    "AO1",
    "MIA",
    "VLO",
    "MEE",
    "AT1",
    "AZ5",
    "BES",
    "SOC",
    "EWK",
    "STG",
    "PDS",
    "CG1",
    "HRS",
    "CZ1",
    "DK1",
    "EY1",
    "FS1",
    "FRS",
    "GA1",
    "DE1",
    "GB1",
    "HAC",
    "IQ1",
    "IE1",
    "ITS",
    "JPS",
    "SEE",
    "KW1",
    "SBD",
    "SBG",
    "CDC",
    "EDO",
    "HJH",
    "LRD",
    "VHS",
    "RGA",
    "MO1",
    "NL1",
    "NZE",
    "NG1",
    "LKS",
    "LIM",
    "PMI",
    "PS0",
    "PT1",
    "QA1",
    "RUS",
    "RO1",
    "SA1",
    "DTV",
    "SG3",
    "SGC",
    "SGD",
    "SK1",
    "ES1",
    "SE1",
    "CHS",
    "AY5",
    "RAE",
    "TRS",
    "AD1",
    "DX1",
    "HCE",
  ];

  res
    .status(200)
    .json({ status: 200, message: "Data found successfully!", data: RDOList });
});

/**
 * @swagger
 * /org-list:
 *   get:
 *     summary: Retrieve a list of Organizations
 *     description: Returns a list of all available organizations.
 *     responses:
 *       200:
 *         description: A list of organizations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Data found successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get("/org-list", (_: Request, res: Response) => {
  const orgList: string[] = [
    "AD1",
    "AO1",
    "AT1",
    "AY5",
    "AZ5",
    "BES",
    "CDC",
    "CHS",
    "CG1",
    "CST",
    "CZ1",
    "DE1",
    "DES",
    "DK1",
    "DTV",
    "DX1",
    "EDO",
    "ES1",
    "EWK",
    "EY1",
    "FRS",
    "FS1",
    "FSA",
    "GA1",
    "GB1",
    "GB5",
    "HAC",
    "HCE",
    "HJH",
    "HRS",
    "IE1",
    "IES",
    "IQ1",
    "ITS",
    "JPS",
    "KW1",
    "LIM",
    "LKS",
    "LRD",
    "MEE",
    "MIA",
    "MO1",
    "NG1",
    "NL1",
    "NS1",
    "NZE",
    "PDS",
    "PMI",
    "PS0",
    "PT1",
    "QA1",
    "RAE",
    "RGA",
    "RO1",
    "RUS",
    "S04",
    "S05",
    "S08",
    "S13",
    "SA1",
    "SBD",
    "SBG",
    "SE1",
    "SEE",
    "SG3",
    "SGC",
    "SGD",
    "SJN",
    "SK1",
    "SOC",
    "SOR",
    "STG",
    "TOR",
    "TRS",
    "VHS",
    "VLO",
  ];

  res
    .status(200)
    .json({ status: 200, message: "Data found successfully!", data: orgList });
});

/**
 * @swagger
 * /org-list:
 *   get:
 *     summary: Retrieve a list of Organizations
 *     description: Returns a list of all available organizations.
 *     responses:
 *       200:
 *         description: A list of organizations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Data found successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get("/tasks-list", (_: Request, res: Response) => {
  (res as ICustomResponse).response({
    status: 200,
    message: "Retrieved stored data successfully",
    data: tempDataStore,
  });
});

/**
 * @swagger
 * /:
 *   post:
 *     summary: Save data to the server
 *     description: Saves a record with parentPart, sourceOrg, and plants.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parentPart
 *               - sourceOrg
 *               - plants
 *             properties:
 *               parentPart:
 *                 type: string
 *                 example: "Part123"
 *               sourceOrg:
 *                 type: string
 *                 example: "ORG1"
 *               plants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Plant1", "Plant2"]
 *     responses:
 *       200:
 *         description: Data saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Saved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     parentPart:
 *                       type: string
 *                       example: "Part123"
 *                     sourceOrg:
 *                       type: string
 *                       example: "ORG1"
 *                     plants:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */

interface DataEntry {
  id: string;
  parentPart: string;
  sourceOrg: string;
  plants: string[];
  status: "processing" | "failed" | "success";
}

const tempDataStore: DataEntry[] = [
  {
    id: "0f51adf6-589c-4d01-931d-dfc7769423f2",
    parentPart: "765765",
    sourceOrg: "481",
    plants: ["AO1", "AT1"],
    status: "processing",
  },
];

router.post("/", (req: Request, res: Response) => {
  const requiredFields = ["parentPart", "sourceOrg", "plants"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    (res as ICustomResponse).response({
      status: 400,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
    return;
  }

  const newData: DataEntry = {
    id: uuidv4(),
    parentPart: req.body.parentPart,
    sourceOrg: req.body.sourceOrg,
    plants: req.body.plants,
    status: "processing",
  };

  tempDataStore.push(newData);

  (res as ICustomResponse).response({
    status: 200,
    message: "Process Initiated successfully",
    data: newData,
  });
});

// Route to update the status of an entry
router.patch("/task/:id/status", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  // Ensure the provided status is valid
  if (!["processing", "failed", "success"].includes(status)) {
    res.status(400).json({
      status: 400,
      message:
        "Invalid status value. Allowed values: processing, failed, success.",
    });
    return;
  }

  const entry = tempDataStore.find((item) => item.id === id);

  if (!entry) {
    res.status(404).json({
      status: 404,
      message: "Entry not found.",
    });
    return;
  }

  entry.status = status as "processing" | "failed" | "success";

  res.json({
    status: 200,
    message: "Status updated successfully.",
    data: entry,
  });
});
