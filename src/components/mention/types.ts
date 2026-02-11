export type MentionOption = {
  value?: string;
  label?: string;
  disabled?: boolean;
  [key: string]: any;
}

export type MentionOptionProps = {
  value?: string;
  label?: string;
  disabled?: string;
  [key: string]: string | undefined;
}

export type MentionCtx = {
  pattern: string;
  start: number;
  end: number;
  prefix: string;
  prefixIndex: number;
  splitIndex: number;
  selectionEnd: number;
}
