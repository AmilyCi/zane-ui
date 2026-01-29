export interface FocusLayer {
  pause: () => void;
  paused: boolean;
  resume: () => void;
}

export type FocusStack = FocusLayer[];
