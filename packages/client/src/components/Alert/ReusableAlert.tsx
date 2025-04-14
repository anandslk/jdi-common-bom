import Alert from "react-bootstrap/Alert";

const ReusableAlert = ({
  variant = "info",
  message,
  show = true,
  className = "",
}: {
  variant: string;
  message: string | React.ReactNode;
  show?: boolean;
  className: string;
}) => {
  if (!show) return null;

  return (
    <Alert variant={variant} className={className}>
      {typeof message === "string" ? message : message}
    </Alert>
  );
};

export default ReusableAlert;
