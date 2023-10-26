interface Props {
  icon: React.FC;
  onClick: () => void;
  showTitle?: boolean;
  title?: string;
  width?: string;
}

/**
 * name was inspired from https://mantine.dev/core/action-icon/
 */
export const ActionIcon = ({
  icon: Icon,
  onClick,
  showTitle,
  title,
  width,
}: Props) => {
  return (
    <button onClick={onClick} title={title}>
      <Icon />
      {showTitle && <span>{title}</span>}
      <style jsx>{`
        button {
          width: ${width ?? '30px'};
        }
      `}</style>
    </button>
  );
};
