import { ReactElement } from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick? : React.MouseEventHandler<HTMLButtonElement>
}

const defaultClasses =
  'flex items-center gap-2 px-4 py-2 rounded-md font-normal cursor-pointer border-0 outline-0';

const variantClasses = {
  primary: 'bg-purple-600 text-white',
  secondary: 'bg-purple-200 text-purple-600',
};

export function Button(props: ButtonProps) {
  const { variant, text, startIcon, endIcon, onClick } = props;

  return (
    <button className={`${defaultClasses} ${variantClasses[variant]}`} onClick={onClick}>
      {startIcon}
      {text}
      {endIcon}
    </button>
  );
}
