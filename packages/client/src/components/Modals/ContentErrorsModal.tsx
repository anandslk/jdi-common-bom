import CustomModal from "../Modal/customModal";
import ErrorPopup from "../ErrorPopup/ErrorPopup";

const ContentErrorsModal = ({
  show,
  onHide,
  errors,
}: {
  show: boolean;
  onHide: () => void;
  errors: Array<string>;
}) => {
  console.log(`[ContentErrorsModal.jsx] errors:`, errors);
  return (
    <CustomModal
      show={show}
      onHide={onHide}
      title="Content Errors"
      footerButtons={[
        {
          label: "Close",
          variant: "danger",
          onClick: onHide,
        },
      ]}
    >
      <ErrorPopup errors={errors} />
    </CustomModal>
  );
};

export default ContentErrorsModal;
