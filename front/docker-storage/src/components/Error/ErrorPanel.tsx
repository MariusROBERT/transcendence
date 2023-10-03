interface Props {
  text: string;
}

export function ErrorPanel({ text }: Props) {
  return (
    <p style={TextStyle}>
      {text}
    </p>
  );
}

const TextStyle: React.CSSProperties = {
  color: 'red',
  fontSize: 22,
  margin: 0,
};
