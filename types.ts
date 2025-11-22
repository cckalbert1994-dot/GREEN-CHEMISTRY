export interface SlideContent {
  title: string;
  bullets: string[];
  highlight: string;
  imageKeyword: string; // Used to seed the placeholder image
  notes: string;
}

export interface PresentationData {
  topic: string;
  slides: SlideContent[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
