import { Form } from "react-bootstrap";
import "./customSelect.css";

const CustomSelect = ({
  index,
  selectedValue,
  options,
  onChange,
  size,
  className,
}: any) => {
  const handleChange = (e: any) => {
    // If index is provided use it, otherwise just pass the value
    if (index !== undefined) {
      onChange(index, e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <Form.Select
      aria-label="Attribute selection"
      value={selectedValue || ""}
      onChange={handleChange}
      size={size}
      className={className}
    >
      <option value="">{options.defaultLabel}</option> {/* Default option */}
      {options.list.map((option: any, attrIndex: any) => (
        <option key={attrIndex} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
};

export default CustomSelect;
