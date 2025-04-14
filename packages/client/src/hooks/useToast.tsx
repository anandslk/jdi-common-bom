import { toast, ToastOptions, TypeOptions } from "react-toastify";

const useToast = () => {
  const showToast = (
    message: string,
    type: TypeOptions = "default",
    options: ToastOptions = {},
  ) => {
    if (type === "default") toast(message, options);
    else toast[type](message, options);
  };

  const showSuccessToast = (message: string, options: ToastOptions = {}) => {
    showToast(message, "success", options);
  };

  const showErrorToast = (message: string, options: ToastOptions = {}) => {
    showToast(message, "error", options);
  };

  const showInfoToast = (message: string, options: ToastOptions = {}) => {
    showToast(message, "info", options);
  };

  const showWarningToast = (message: string, options: ToastOptions = {}) => {
    showToast(message, "warning", options);
  };

  return {
    showToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  };
};

export default useToast;
