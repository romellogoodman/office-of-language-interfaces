interface InlineCodeProps {
  code: string;
}

export default function InlineCode({ code }: InlineCodeProps) {
  return <code className="inline-code">{code}</code>;
}