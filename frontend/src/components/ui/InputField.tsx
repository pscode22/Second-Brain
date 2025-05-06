import { HTMLInputTypeAttribute, RefObject } from 'react';

interface InputFieldProps {
  labelName: string;
  type: HTMLInputTypeAttribute;
  nameAttr: string;
  placeholder: string;
  required ?: boolean;
  ref: RefObject<HTMLInputElement | null>;
}

export default function InputField({
  labelName,
  type,
  nameAttr,
  placeholder,
  required,
  ref,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-1 block font-medium">{labelName}</label>
      <input
        type={type}
        name={nameAttr}
        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        placeholder={placeholder}
        ref={ref}
        onChange={(e) => {
          return ref.current ? (ref.current.value = e.target.value) : null;
        }}
        required={required}
      />
    </div>
  );
}
