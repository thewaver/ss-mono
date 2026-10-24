const NON_WORD_PATTERN = /[^\p{L}\p{N}]+/gu;

export const toDocsSectionId = (title: string) =>
    `docs-section-${title.trim().toLowerCase().replace(NON_WORD_PATTERN, "-")}`;
