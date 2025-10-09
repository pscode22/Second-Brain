export default function SideArrowIcon({ isLeft = false }: { isLeft: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={isLeft ? 'm8.25 4.5 7.5 7.5-7.5 7.5' : 'M15.75 19.5 8.25 12l7.5-7.5'}
      />
    </svg>
  );
}
