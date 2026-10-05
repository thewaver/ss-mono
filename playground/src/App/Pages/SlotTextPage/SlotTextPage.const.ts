export const WORD_LETTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const WORD_LENGTH = 7;

export const WORDS = ["LONDON", "PARIS", "TOKYO", "BERLIN", "OSLO", "MADRID", "LIMA"].map((word) =>
    word.padEnd(WORD_LENGTH),
);
