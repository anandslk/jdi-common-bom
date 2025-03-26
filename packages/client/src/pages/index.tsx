import React, { useState, ChangeEvent } from "react";
import { TextField, Box, Paper, Button, Stack, Alert } from "@mui/material";
import { ConfirmationScreen } from "../components/Confirmation";
import { ResultsScreen } from "../components/Result";
import { Dialog } from "../components/Dialog";
import { useConfirmations } from "../hooks/useConfirmations";
import { usePostMutation } from "../slices/apis/app.api";
import toast from "react-hot-toast";
import { getErrorMessage } from "../slices/apis/types";
import { DropdownMultiSelect } from "../components/DropdownSelect";
import { useNavigate } from "react-router-dom";

interface FormErrors {
  parentParts?: string;
  sourceOrg?: string;
  plants?: string;
}

type Stage = "form" | "searching" | "confirmation" | "assigning" | "results";

export const App: React.FC = () => {
  const navigate = useNavigate();

  // Form fields and error state
  const [errors, setErrors] = useState<FormErrors>({
    parentParts: "",
    sourceOrg: "",
    plants: "",
  });

  type IFormState = {
    parentParts: string;
    sourceOrg: string;
    plants: string[];
  };

  const [formState, setFormState] = useState<IFormState>({
    parentParts: "",
    sourceOrg: "",
    plants: [],
  });

  const handleChange = (
    key: keyof IFormState,
    value: IFormState[keyof IFormState],
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const { isOpen, setIsOpen } = useConfirmations();

  // Track submission stage
  const [stage] = useState<Stage>("form");

  // --- Form Submission ---
  const handleFormSubmit = (): void => {
    // toast.error("Part is not Released")
    // toast.error("Part does not belong to the selected source organization")
    // return
    const newErrors: FormErrors = {};

    if (!formState.parentParts.trim())
      newErrors.parentParts = "Parent Part is required";
    if (!formState.sourceOrg.trim())
      newErrors.sourceOrg = "Source org is required";
    if (!formState.plants.length)
      newErrors.plants = "Select either RDO Name or Destination JDI Org";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) setIsOpen(true);
  };

  // --- Cancel Handler ---
  const handleCancel = (): void => setIsOpen(false);

  const [postMutation, { isLoading }] = usePostMutation();

  // --- Confirmation Stage ---
  const handleConfirmationSubmit = async () => {
    const { data, error } = await postMutation({
      parentPart: formState.parentParts,
      sourceOrg: formState.sourceOrg,
      plants: formState.plants,
    });

    if (error) toast.error(getErrorMessage(error));

    setIsOpen(false);
    toast.success(data.message);
    setTimeout(() => navigate("/initiated"), 500);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#eef2f6" }}>
      <Dialog
        isOpen={isOpen}
        title="Confirm Your Submission"
        onSubmit={handleConfirmationSubmit}
        onCancel={handleCancel}
        disabled={isLoading}
      >
        <ConfirmationScreen
          parentParts={formState.parentParts}
          sourceOrg={formState.sourceOrg}
          selectedItems={formState.plants}
        />
      </Dialog>

      <Box
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <Paper
          sx={{
            padding: 4,
            width: "100%",
            maxWidth: 600,
            borderRadius: 4,
            boxShadow: 3,
            opacity: stage === "searching" ? 0.6 : 1,
          }}
        >
          <Stack spacing={3}>
            <TextField
              label="Parent item(s) to Assign"
              variant="outlined"
              value={formState.parentParts}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("parentParts", e.target.value)
              }
              error={!!errors.parentParts}
              helperText={errors.parentParts}
              fullWidth
              disabled={stage === "searching"}
            />
            <TextField
              label="Source Organization"
              variant="outlined"
              value={formState.sourceOrg}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("sourceOrg", e.target.value)
              }
              error={!!errors.sourceOrg}
              helperText={errors.sourceOrg}
              fullWidth
              disabled={stage === "searching"}
            />

            <DropdownMultiSelect
              selectedItems={formState.plants}
              onChange={(newSelectedItems) =>
                handleChange("plants", newSelectedItems)
              }
              disabled={stage === "searching"}
            />

            {errors.plants && <Alert severity="error">{errors.plants}</Alert>}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
                disabled={stage === "searching"}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                disabled={stage === "searching"}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* <LoadingScreen message="Assigning items and commoning required parts..." /> */}

        {/* Results Screen */}
        {stage === "results" && (
          <ResultsScreen
            parentParts={formState.parentParts}
            sourceOrg={formState.sourceOrg}
            selectedItems={formState.plants}
            onBack={handleCancel}
          />
        )}
      </Box>
    </Box>
  );
};

export default App;
