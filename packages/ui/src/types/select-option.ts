export interface SelectOption<Result = unknown> {
  isValueOnly?: boolean;
  label: string;
  value: string;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  description?: React.ReactNode;
  keywords?: string[];
  result?: Result | null;
}
