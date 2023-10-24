interface Props {
  icon: React.FC;
  onClick: () => void;
  title: string;
  className?: string;
}

/**
 * name was inspired from https://mantine.dev/core/action-icon/
 */
export const ActionIcon = ({
  icon: Icon,
  onClick,
  title,
  className,
}: Props) => {
  return (
    <button onClick={onClick} title={title}>
      <Icon />
      <style jsx>{`
        button {
          width: 34px;
          height: 64px;
          padding: 0 5px;
        }
      `}</style>
    </button>
  );
};
