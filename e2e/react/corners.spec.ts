import { expect, test } from "@playwright/test";

import { computedStyle } from "../helpers";

/**
 * The React `Corners`. There is no Solid spec for it to follow, so these cases state what it draws: one mark per
 * visible corner, each a pair of arms of the length and thickness it was given, in a glow layer that is hidden from
 * assistive technology and follows a change of color over the transition it was given — with the consumer's content
 * underneath, untouched.
 */
const FRAME = '[data-testid="frame"]';
const MARKS = `${FRAME} svg`;

test("every corner is marked unless told otherwise, and the content is kept", async ({ mount }) => {
    const component = await mount("Exotics/Corners/Bare");

    await expect(component.locator(MARKS), "one mark per corner").toHaveCount(4);
    await expect(component.getByTestId("content"), "and the consumer's content beneath them").toHaveText("Framed");
    expect(
        await computedStyle(component.locator(MARKS).first(), "color"),
        "with no color of its own, a mark takes the surrounding text color",
    ).toBe(await computedStyle(component.locator(FRAME), "color"));
});

test("only the corners asked for are drawn", async ({ mount }) => {
    const component = await mount("Exotics/Corners/Default", { visibleCorners: ["topLeft", "bottomRight"] });

    await expect(component.locator(MARKS), "a corner left out is not drawn at all").toHaveCount(2);
});

test("each mark is a pair of arms of the length and thickness it was given", async ({ mount }) => {
    const component = await mount("Exotics/Corners/Default");
    const mark = component.locator(MARKS).first();

    await expect(mark).toHaveAttribute("width", "24");
    await expect(mark).toHaveAttribute("height", "16");
    await expect(
        mark.locator("polygon"),
        "the arms run out along both edges and back in by the thickness",
    ).toHaveAttribute("points", "0,0 24,0 21,3 3,3 3,13 0,16");
});

test("the marks are decoration, and follow a change of color over the transition", async ({ mount }) => {
    const component = await mount("Exotics/Corners/Default");
    const glow = component.locator(`${FRAME} [aria-hidden="true"]`);

    await expect(glow, "the glow layer holding the marks is hidden from assistive technology").toHaveCount(1);
    await expect(glow.locator("svg")).toHaveCount(4);
    expect(await computedStyle(glow, "transition-duration"), "color and glow share the given duration").toBe(
        "0.3s, 0.3s",
    );

    const before = await computedStyle(glow, "filter");

    await component.locator('[data-action="color"]').click();

    await expect
        .poll(() => computedStyle(glow, "filter"), { message: "the glow is relit in the new color" })
        .not.toBe(before);
});
