interface INgTranslationSentenceCompPart {
  // the component index, 
  // will be used to get component instance from components properties
  index: number;
  // the trans content string which only belongs to current component
  // e.g. ' str ' is the trans content string of '<0> str </0>'
  content: string;
  // the sentenceList from the trans content string of the current component
  list?: INgTranslationSentencePart[];
}

export type INgTranslationSentencePart = string | INgTranslationSentenceCompPart;
