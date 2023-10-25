interface Props {
  icon: React.FC;
  onClick: () => void;
  title: string;
  width?: string;
}

/**
 * name was inspired from https://mantine.dev/core/action-icon/
 */
export const ActionIcon = ({ icon: Icon, onClick, title, width }: Props) => {
  return (
    <button onClick={onClick} title={title}>
      <Icon />
      <style jsx>{`
        button {
          width: ${width ?? '30px'};
        }
      `}</style>
    </button>
  );
};
