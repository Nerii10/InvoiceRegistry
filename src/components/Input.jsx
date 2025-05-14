import { useState } from "react";
import "../styles/Input.css";
import { Upload, FunnelPlus } from "lucide-react";

export default function Input({
  type = "text",
  value,
  setValue,
  options,
  onClick,
  children,
  active,
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
  disabled,
}) {
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

  if (type === "select") {
    return (
      <select
        required={required}
        className="custom-input select"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={style}
      >
        {options &&
          options?.map((option, idx) => (
            <option key={idx} value={option.value || option}>
              {option.label || option.value}
            </option>
          ))}
      </select>
    );
  }

  if (type === "file") {
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

  if (type == "button" || type == "submit") {
    return (
      <button
        type={`${type}`}
        className={
          active ? "custom-input active-button" : "custom-input button"
        }
        disabled={disabled}
        onClick={onClick}
        style={style}
      >
        {children}
      </button>
    );
  }

  if (type === "text") {
    if (!label) {
      return (
        <input
          type={type}
          className="custom-input text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={style}
          required={required}
        />
      );
    } else {
      return (
        <>
          <div
            className="custom-input-container"
            style={{
              width: width,
              height: height,
            }}
          >
            <input
              type={type}
              className="custom-input text"
              value={value}
              required={required}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              style={style}
            />

            <p
              className={
                value ? "custom-input-text-active" : "custom-input-text"
              }
            >
              {label}
            </p>
          </div>
        </>
      );
    }
  }

  if (type == "date") {
    if (!label) {
      return (
        <input
          type={type}
          required={required}
          className="custom-input text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={style}
        />
      );
    } else {
      return (
        <>
          <div
            className="custom-input-container"
            style={{
              width: width,
              height: height,
            }}
          >
            <input
              type={type}
              required={required}
              className="custom-input"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              style={style}
            />

            <p
              className={
                value ? "custom-input-text-active" : "custom-input-text"
              }
              style={
                value
                  ? {
                      position: "absolute",
                      right: "50px",
                      opacity: 0,
                      transition: "0.25s ease",
                    }
                  : {
                      position: "absolute",
                      backgroundColor: "rgb(255, 255, 255)",
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
              }
            >
              {label}
            </p>
          </div>
        </>
      );
    }
  }

  if (type === "multiselect") {
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
            <p style={{textAlign:"center", width:"100%", margin:5}}>Filter Table</p>
            {options?.map((option, idx) => {
              const val = option.value || option;
              const label = option.label || val;

              return (
                <label className={value.includes(option) ? "multiselect-input selected" : "multiselect-input"} key={idx}>
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
