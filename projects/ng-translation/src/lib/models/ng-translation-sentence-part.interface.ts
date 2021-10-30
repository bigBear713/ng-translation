interface NgTranslationSentenceCompPart {
  index: number;
  content: any;
  list?: INgTranslationSentencePart[];
}

export type INgTranslationSentencePart = string | NgTranslationSentenceCompPart;
