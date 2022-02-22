export interface INgTransSentenceCompPart {
  // the component index, 
  // will be used to get component instance from components properties
  index: number;
  // the content which will be rendered in html
  content: string;
  // the sentenceList from the trans content string of the current component
  list?: INgTransSentencePart[];
}

export type INgTransSentencePart = string | INgTransSentenceCompPart;
