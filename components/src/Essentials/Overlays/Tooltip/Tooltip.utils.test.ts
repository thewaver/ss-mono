import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipUtils } from "./Tooltip.utils";

/**
 * `followFocusWithin` and `observePointerExit` are left to the specs, since they are about where focus and the
 * pointer go in a real page. What is tested here touches nothing but attributes, which a stand-in holds honestly.
 */

class FakeElement {
    attributes = new Map<string, string>();
    id = "";
    tooltipAncestor: FakeElement | null = null;

    getAttribute(name: string) {
        return this.attributes.get(name) ?? null;
    }

    setAttribute(name: string, value: string) {
        this.attributes.set(name, value);
    }

    removeAttribute(name: string) {
        this.attributes.delete(name);
    }

    hasAttribute(name: string) {
        return this.attributes.has(name);
    }

    closest() {
        return this.tooltipAncestor;
    }
}

const createAnchor = (describedBy?: string) => {
    const anchor = new FakeElement();

    if (describedBy !== undefined) anchor.setAttribute("aria-describedby", describedBy);

    return anchor;
};

const asHTMLElement = (element: FakeElement) => element as unknown as HTMLElement;

describe("TooltipUtils.describe", () => {
    it("adds the tooltip beside the ids already there, and takes only it back out", () => {
        const anchor = createAnchor("hint");
        const undescribe = TooltipUtils.describe(asHTMLElement(anchor), "tip");

        expect(anchor.getAttribute("aria-describedby")).toBe("hint tip");

        undescribe();

        expect(anchor.getAttribute("aria-describedby")).toBe("hint");
    });

    it("keeps ids someone else added while it was described", () => {
        const anchor = createAnchor();
        const undescribe = TooltipUtils.describe(asHTMLElement(anchor), "tip");

        anchor.setAttribute("aria-describedby", `${anchor.getAttribute("aria-describedby")} later`);
        undescribe();

        expect(anchor.getAttribute("aria-describedby")).toBe("later");
    });

    it("removes the attribute outright once nothing is left in it", () => {
        const anchor = createAnchor();
        const undescribe = TooltipUtils.describe(asHTMLElement(anchor), "tip");

        undescribe();

        expect(anchor.hasAttribute("aria-describedby")).toBe(false);
    });

    it("adds nothing for an id that is already there", () => {
        const anchor = createAnchor("tip");

        TooltipUtils.describe(asHTMLElement(anchor), "tip");

        expect(anchor.getAttribute("aria-describedby")).toBe("tip");
    });
});

describe("TooltipUtils.findDescribingTooltip", () => {
    beforeEach(() => {
        vi.stubGlobal("Element", FakeElement);
        vi.stubGlobal("HTMLElement", FakeElement);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    const createTooltip = (id: string) => {
        const tooltip = new FakeElement();
        const inside = new FakeElement();

        tooltip.id = id;
        inside.tooltipAncestor = tooltip;

        return { tooltip, inside };
    };

    it("finds the tooltip the pointer went onto while the anchor is described by it", () => {
        const { tooltip, inside } = createTooltip("tip");

        expect(TooltipUtils.findDescribingTooltip(asHTMLElement(createAnchor("tip")), inside as never)).toBe(tooltip);
    });

    it("finds nothing for a tooltip describing some other anchor", () => {
        const { inside } = createTooltip("tip");

        expect(
            TooltipUtils.findDescribingTooltip(asHTMLElement(createAnchor("other")), inside as never),
        ).toBeUndefined();
    });

    it("finds nothing when the pointer went anywhere but a tooltip, or came from no anchor", () => {
        const { inside } = createTooltip("tip");

        expect(TooltipUtils.findDescribingTooltip(asHTMLElement(createAnchor("tip")), new FakeElement() as never)).toBe(
            undefined,
        );
        expect(TooltipUtils.findDescribingTooltip(asHTMLElement(createAnchor("tip")), null)).toBeUndefined();
        expect(TooltipUtils.findDescribingTooltip(undefined, inside as never)).toBeUndefined();
    });
});

describe("TooltipUtils.getGlideTransition", () => {
    it("eases only the move, over the tooltip's own duration", () => {
        expect(TooltipUtils.getGlideTransition(150)).toBe("transform 150ms ease");
    });
});
