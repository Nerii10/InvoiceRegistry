import Input from "./Input";

export default function RenderInputs({data, className }) {
  return data?.map((section, index) => {
    return (
      <div key={index} className={className}>
        {section.map((input) => {
          return (
            <Input
              type={input.type}
              borderStyle={input.borderStyle}
              width={input.width}
              disabled={input.disabled}
              label={input.label}
              required={input.required}
              value={input.value}
              setValue={input.setValue}
              borderRadius={input.borderRadius}
              options={input.options}
              onClick={input.onClick}
              customStyle={input.customStyle}
              children={input.children}
            ></Input>
          );
        })}
      </div>
    );
  });
}
