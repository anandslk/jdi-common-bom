import { SecurityContext } from "../services/api/droppableService";
import { initWidget } from "./widget";

const widgetEntry = process.env.WIDGET_ENTRY || "revisionFloat"; // Default to revisionFloat

// Mapping of widget entries to their corresponding import paths
const widgetModules: Record<string, () => Promise<any>> = {
  plantAssignment: () => import("../pages/plantAssignment/plantIndex"),
  massUpload: () => import("../massuUploadIndex"),
  bosAttribute: () => import("../pages/BOSWidget/bosIndex"),
  jdiBom: () => import("src/pages/jdiBom"),
  default: () => import("../index"),
};

export const initializeWidget = () =>
  initWidget(
    async (widget: any) => {
      const response = await SecurityContext();
      const securitycontext = response.securitycontextpreference;
      const email = response.email;

      widget.setTitle("");
      // Add Security Context Preference (UI for SecurityContext)
      widget.addPreference(securitycontext);
      widget.setValue("email", email);

      // Optionally log all current preferences (if accessible)
      if (widget.preferences) {
        console.log(
          "[widget-starter] Current widget preferences:",
          widget.preferences
        );
      }

      // Handle specific preferences for massUpload
      if (widgetEntry === "massUpload") {
        widget.addPreference({
          name: "Email Notification",
          type: "boolean",
          label: "Email Notification",
          defaultValue: false,
        });
      }

      try {
        const module = await (
          widgetModules[widgetEntry] || widgetModules.default
        )();
        module.default();
      } catch (error) {
        console.error(
          `[widget-starter] Error dynamically importing ${widgetEntry}`,
          error
        );
        widget.body.innerHTML =
          "<div style='color: red;'>Error loading widget content.</div>";
      }
    },
    (error: any) => {
      console.error("[widget-starter] initWidget encountered an error:", error);
    }
  );
