import { type Page, expect, test } from "@playwright/test";

import { demo, example, prop, revealProp } from "./helpers";

/**
 * A particle is in the page only while it lives: the field adds an element when a cell spawns and removes it once
 * the particle's lifetime is over. None of the examples print a reading, so the spec keeps its own log, installed
 * in the page, of every particle element added and removed and of where each one was placed. A particle's place is
 * the inline `left`/`top` the component writes on it, in the field's own layout pixels, so the window's scale never
 * enters a comparison.
 *
 * Particles are not scattered on this page unless asked, so a particle sits at its cell's center and two particles
 * sharing a place means two particles sharing a cell.
 */
const FIELD = '[role="presentation"][aria-hidden="true"]';
const WATCH_MS = 2500;

type Placement = { x: number; y: number; width: number; height: number };

type FieldLog = {
    added: number;
    removed: number;
    placements: Placement[];
    sharedCell: boolean;
};

const installLog = (page: Page, key: string) =>
    page.evaluate(
        (selector) => {
            const field = document.querySelector(selector) as HTMLElement;
            const log: FieldLog = { added: 0, removed: 0, placements: [], sharedCell: false };

            const placementOf = (element: HTMLElement): Placement => ({
                x: parseFloat(element.style.left),
                y: parseFloat(element.style.top),
                width: field.offsetWidth,
                height: field.offsetHeight,
            });

            new MutationObserver((records) => {
                for (const record of records) {
                    for (const node of record.addedNodes) {
                        if (!(node instanceof HTMLElement)) continue;

                        log.added++;
                        log.placements.push(placementOf(node));
                    }

                    log.removed += record.removedNodes.length;
                }

                const places = [...field.children].map(
                    (child) => `${(child as HTMLElement).style.left},${(child as HTMLElement).style.top}`,
                );

                if (new Set(places).size !== places.length) log.sharedCell = true;
            }).observe(field, { childList: true });

            (window as unknown as { __fieldLog: FieldLog }).__fieldLog = log;
        },
        `${demo(key)} ${FIELD}`,
    );

const readLog = (page: Page) => page.evaluate(() => (window as unknown as { __fieldLog: FieldLog }).__fieldLog);

const setNumber = async (page: Page, key: string, value: number) => {
    await page.locator(`${prop(key)} input`).fill(String(value));
    await page.locator(`${prop(key)} input`).blur();
};

const placesOf = (page: Page, key: string) =>
    page
        .locator(`${demo(key)} ${FIELD} > div`)
        .evaluateAll((elements) =>
            elements.map((element) => `${(element as HTMLElement).style.left},${(element as HTMLElement).style.top}`),
        );

test.beforeEach(async ({ page }) => {
    await page.goto("/particle-field");
    await expect(page.locator(example("default"))).toBeVisible();
});

/**
 * A pass spawns every cell once and every particle it spawns also finishes inside it, so over a few passes the
 * field both adds and removes particles, and never puts two in one cell.
 */
test("the field spawns particles in place and removes them, one per cell", async ({ page }) => {
    await installLog(page, "default");
    await page.waitForTimeout(WATCH_MS);

    const log = await readLog(page);

    expect(log.added, "cells spawn").toBeGreaterThan(0);
    expect(log.removed, "and their particles are removed once they have lived").toBeGreaterThan(0);
    expect(log.sharedCell, "a cell never holds two particles at once").toBe(false);
});

/**
 * A chance of 0 lets no cell through in any pass, however the weights and the passes fall.
 */
test("at a spawn chance of 0 nothing spawns", async ({ page }) => {
    await setNumber(page, "spawnChance", 0);
    await installLog(page, "default");
    await page.waitForTimeout(WATCH_MS);

    expect((await readLog(page)).added, "no cell wins a roll it cannot win").toBe(0);
});

/**
 * Below 1, each cell is decided once per pass and the decision is kept, so dragging away from a point in the pass and
 * back to it shows exactly the particles it showed before rather than rolling again.
 */
test("a pass decided by chance shows the same particles each time it is revisited", async ({ page }) => {
    await page.locator("#particleFieldPlayback").click();
    await setNumber(page, "spawnChance", 0.5);

    const slider = page.locator("#particleFieldProgress [role=slider], #particleFieldProgress").first();

    await slider.focus();
    await page.keyboard.press("Home");

    const first = await placesOf(page, "default");

    await page.keyboard.press("End");
    await expect.poll(() => placesOf(page, "default"), { message: "the far end of the pass is empty" }).toEqual([]);
    await page.keyboard.press("Home");

    expect(first.length, "some cells won their roll").toBeGreaterThan(0);
    await expect
        .poll(() => placesOf(page, "default"), { message: "and the same ones show on the way back" })
        .toEqual(first);
});

/**
 * Stopped, the field is drawn at whatever its progress holds and nothing else moves it: the same particles stay in
 * the same places while time passes. Pressing Pause beside the slider stops it, and moving the slider writes the progress, and the field
 * is redrawn at the new point, so the start and the end of a pass show different particles. Every particle a pass
 * spawns is gone by its end, which is what makes the two ends different whatever the weights are.
 */
test("stopped, the field holds still, and the slider moves it through the pass", async ({ page }) => {
    await page.locator("#particleFieldPlayback").click();

    const slider = page.locator("#particleFieldProgress [role='slider'], #particleFieldProgress").first();

    await slider.focus();
    await page.keyboard.press("Home");

    const atStart = await placesOf(page, "default");

    await page.waitForTimeout(WATCH_MS / 5);

    expect(await placesOf(page, "default"), "nothing moves while stopped").toEqual(atStart);
    expect(atStart.length, "the pass's first particles are showing at its start").toBeGreaterThan(0);

    await page.keyboard.press("End");

    await expect
        .poll(() => placesOf(page, "default"), { message: "at the end of the pass every particle is gone" })
        .toEqual([]);
});

/**
 * The lozenge is the set of points whose distances from the box's middle, as shares of the box's width and height,
 * add up to no more than a half — the shape's own definition, so a restyled page cannot move it. A particle sits at
 * its cell's center, and a cell spawns only when that center is inside, so every particle lands inside.
 */
test("a shaped field spawns only inside its shape", async ({ page }) => {
    await page.locator(example("shaped")).scrollIntoViewIfNeeded();
    await revealProp(page, "shapeKind", "shaped");
    await page.locator(`${prop("shapeKind")} [role="combobox"]`).click();
    await page.getByRole("option", { name: "lozenge", exact: true }).click();
    await page.keyboard.press("Escape");

    await installLog(page, "shaped");
    await page.waitForTimeout(WATCH_MS);

    const { placements } = await readLog(page);
    const outside = placements.filter(
        ({ x, y, width, height }) => Math.abs(x / width - 0.5) + Math.abs(y / height - 0.5) > 0.5,
    );

    expect(placements.length, "the shape has cells inside it, and they spawn").toBeGreaterThan(0);
    expect(outside, "no particle is placed outside the lozenge").toEqual([]);
});
