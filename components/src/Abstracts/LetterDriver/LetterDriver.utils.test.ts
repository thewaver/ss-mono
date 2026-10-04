import { describe, expect, it } from "vitest";

import { LetterDriverUtils } from "./LetterDriver.utils";

describe("indexSegments", () => {
    it("counts a run of text by character and an image or a break as one", () => {
        const { segments, count } = LetterDriverUtils.indexSegments([
            { type: "text", text: "ab", metrics: {}, nonMetrics: {}, meta: { common: { dataset: {}, title: "" } } },
            { type: "linebreak" },
            { type: "text", text: "😀c", metrics: {}, nonMetrics: {}, meta: { common: { dataset: {}, title: "" } } },
        ]);

        expect(segments.map((segment) => segment.startIndex)).toEqual([0, 2, 3]);
        expect(count).toBe(5);
    });
});

describe("getCharacters", () => {
    it("spells text as itself, and an image and a break as the letters a drawer reports for them", () => {
        const { segments } = LetterDriverUtils.indexSegments([
            { type: "text", text: "ab", metrics: {}, nonMetrics: {}, meta: { common: { dataset: {}, title: "" } } },
            { type: "linebreak" },
            { type: "atomic", element: {} as HTMLElement, width: 10, height: 10 },
        ]);

        expect(LetterDriverUtils.getCharacters(segments)).toEqual(["a", "b", "\n", "\uFFFC"]);
    });
});
