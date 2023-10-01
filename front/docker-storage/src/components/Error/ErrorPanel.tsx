interface Props {
  text: string;
}

export function ErrorPanel({ text }: Props) {
  return (
    <div>
      <p style={TextStyle}>{text}</p>
    </div>
  );
}

const TextStyle: React.CSSProperties = {
  color: 'red',
  fontSize: 22,
};
