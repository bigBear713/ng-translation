interface INgTranslationSentenceCompPart {
  index: number;
  content: any;
  list?: INgTranslationSentencePart[];
}

export type INgTranslationSentencePart = string | INgTranslationSentenceCompPart;
