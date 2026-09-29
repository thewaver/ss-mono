import { describe, expect, it } from "vitest";

import type { TableOfContentsLink } from "./TableOfContents.types";
import { TableOfContentsUtils } from "./TableOfContents.utils";

const LINKS: TableOfContentsLink<string>[] = [
    { value: "intro", target: undefined },
    { value: "usage", target: undefined },
];

describe("computeCurrentValue", () => {
    it("names the section whose link is current", () => {
        expect(TableOfContentsUtils.computeCurrentValue(LINKS, 1)).toBe("usage");
    });

    it("names nothing above the first section, or past the end of the list", () => {
        expect(TableOfContentsUtils.computeCurrentValue(LINKS, undefined)).toBeUndefined();
        expect(TableOfContentsUtils.computeCurrentValue(LINKS, 5)).toBeUndefined();
    });
});
