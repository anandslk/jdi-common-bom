import CustomModal from "../Modal/customModal";

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
}: {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}) => {
  return (
    <CustomModal
      show={show}
      onHide={onHide}
      title="Confirmation"
      footerButtons={[
        {
          label: "Cancel",
          variant: "danger",
          onClick: onHide,
        },
        {
          label: "Confirm",
          variant: "success",
          onClick: onConfirm,
        },
      ]}
    >
      <p>Are you sure you want to submit?</p>
    </CustomModal>
  );
};

export default ConfirmationModal;
