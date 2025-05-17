import { useState } from "react";
import "../styles/Input.css";
import { Upload, FunnelPlus } from "lucide-react";

export default function Input(props) {
  const {
    type = "text",
    value,
    setValue,
    options,
    onClick,
    children,
    active,
    activeStyle,
    label,
    width = "100%",
    maxWidth = "100%",
    height = "40px",
    borderRadius = "var(--borderRadius)",
    backgroundColor = "var(--accentColor)",
    borderStyle = "solid",
    required = false,
    borderSide,
    customStyle,
    activeTextHidden = false,
    disabled,
  } = props;

  const style = {
    "--input-width": width,
    "--input-max-width": maxWidth,
    "--border-radius": borderRadius,
    "--background-color": backgroundColor,
    "--height": height,
    "--border-style": borderStyle,
    "--border-side": borderSide,
    ...(customStyle || {}),
  };

  // === SELECT ===
  if (type === "select") return renderSelect();

  // === FILE ===
  if (type === "file") return renderFile();

  // === BUTTON ===
  if (type === "button" || type === "submit") return renderButton();

  // === MULTISELECT ===
  if (type === "multiselect") return renderMultiSelect();

  // === TEXT / EMAIL / PASSWORD / DATE / NUMBER ===
  return renderTextOrDate();

  // === Subcomponents ===

  function renderSelect() {
    return (
      <select
        required={required}
        className="custom-input select"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={style}
      >
        <option value="" hidden>
          {label || "Select"}
        </option>
        {options?.map((option, idx) => (
          <option key={idx} value={option.value || option}>
            {option.label || option.value}
          </option>
        ))}
      </select>
    );
  }

  function renderFile() {
    return (
      <label className="custom-input-file-wrapper" style={style}>
        <Upload className="upload-icon" />
        <span>{label}</span>
        <input
          type="file"
          required={required}
          onChange={(e) => setValue(e.target.files[0])}
          className="custom-input-file"
        />
      </label>
    );
  }

  function renderButton() {
    return (
      <button
        type={type}
        className={
          activeStyle != 1
            ? active
              ? "custom-input active-button"
              : "custom-input button"
            : active
            ? "custom-input active2-button"
            : "custom-input button"
        }
        disabled={disabled}
        onClick={onClick}
        style={style}
      >
        {children}
      </button>
    );
  }

  function renderTextOrDate() {
    const inputElement = (
      <input
        type={type}
        className="custom-input text"
        value={value}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        style={style}
      />
    );

    if (!label) return inputElement;

    const labelStyle =
      type === "date"
        ? value
          ? {
              position: "absolute",
              right: "50px",
              transition: "0.25s ease",
            }
          : {
              position: "absolute",
              backgroundColor: "white",
              padding: "0px 5px",
              left: "2px",
              boxSizing: "border-box",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "90%",
              textAlign: "start",
              opacity: 1,
              transition: "0.25s ease",
            }
        : undefined;

    return (
      <div className="custom-input-container" style={{ width, height }}>
        {inputElement}
        <p
          className={value ? "custom-input-text-active" : "custom-input-text"}
          style={{
            ...labelStyle,
            ...(activeTextHidden
              ? {
                  "--custom-active-opacity": 0,
                  "--custom-active-transform": " translateX(60px)",
                }
              : {
                  "--custom-active-opacity": 0.3,
                  "--custom-active-transform": "translateY(-25px)",
                }),
          }}
        >
          {label}
        </p>
      </div>
    );
  }

  function renderMultiSelect() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (val) => {
      if (value.includes(val)) {
        setValue(value.filter((v) => v !== val));
      } else {
        setValue([...value, val]);
      }
    };

    return (
      <div className="custom-input-multiselect" style={style}>
        <div
          className="multiselect-icon"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <FunnelPlus />
        </div>

        {isOpen && (
          <div className="multiselect-popup">
            <p style={{ textAlign: "center", width: "100%", margin: 5 }}>
              Filter Table
            </p>
            {options?.map((option, idx) => {
              const val = option.value || option;
              const label = option.label || val;

              return (
                <label
                  className={
                    value.includes(option)
                      ? "multiselect-input selected"
                      : "multiselect-input"
                  }
                  key={idx}
                >
                  <input
                    type="checkbox"
                    className="multiselect-input-checkbox"
                    checked={value.includes(val)}
                    onChange={() => toggleOption(val)}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
