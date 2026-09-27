import { expect, test } from "@playwright/test";

/** `TypeaheadReactUtils.useBuffer`: the typed query as state, over the framework-free buffer. */
const STORY = "Abstracts/Typeahead/Default";

const query = '[data-readout="query"]';

test("typed characters build up into one query", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("field").press("a");
    await component.getByTestId("field").press("b");

    await expect(component.locator(query)).toHaveText('"ab"');
});

test("the query expires after the timeout, so the next keystroke starts over", async ({ mount }) => {
    const component = await mount(STORY, { timeoutMs: 150 });

    await component.getByTestId("field").press("a");
    await expect(component.locator(query)).toHaveText('"a"');

    await expect(component.locator(query), "the buffer clears itself once typing stops").toHaveText('""');
});

test("a space on its own is not taken, since it selects rather than searches", async ({ mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("field").press(" ");

    await expect(component.locator(query)).toHaveText('""');
});
