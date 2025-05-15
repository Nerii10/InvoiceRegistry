import { useState } from "react";
import Input from "./Input";

export default function RenderInputs({
  form = false,
  data = [],
  formClassName = "",
  className = "",
  onSubmit,
  formStyle,
}) {
  const [submitted, setSubmitted] = useState(false);

  const content = data.map((section, sectionIndex) => (
    <div className={className} key={sectionIndex}>
      {section.map((input, inputIndex) => (
        <Input
          validated={submitted}
          key={input.key || `${sectionIndex}-${inputIndex}`}
          {...input}
        />
      ))}
    </div>
  ));

  if (form) {
    return (
      <form
        style={formStyle}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
          setSubmitted(true);
        }}
        className={formClassName}
      >
        {content}
      </form>
    );
  }

  return content;
}
