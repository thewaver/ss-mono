import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The React `ParticleField`. The cases follow `e2e/particleField.spec.ts`, which covers the Solid one. A particle is in
 * the page only while it lives, so the spec keeps its own log, installed in the page, of every particle element added
 * and removed and of where each was placed — the inline `left`/`top` the component writes, in the field's own pixels.
 * Particles are not scattered in this story, so a particle sits at its cell's center and two sharing a place means two
 * sharing a cell.
 */
const STORY = "Exotics/ParticleField/Default";
const FIELD = '[data-testid="field"] > [role="presentation"][aria-hidden="true"]';
const WATCH_MS = 2500;

type Placement = { x: number; y: number; width: number; height: number };
type FieldLog = { added: number; removed: number; placements: Placement[]; sharedCell: boolean };

const installLog = (page: Page) =>
    page.evaluate((selector) => {
        const field = document.querySelector(selector) as HTMLElement;
        const log: FieldLog = { added: 0, removed: 0, placements: [], sharedCell: false };

        new MutationObserver((records) => {
            for (const record of records) {
                for (const node of record.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;

                    log.added++;
                    log.placements.push({
                        x: parseFloat(node.style.left),
                        y: parseFloat(node.style.top),
                        width: field.offsetWidth,
                        height: field.offsetHeight,
                    });
                }

                log.removed += record.removedNodes.length;
            }

            const places = [...field.children].map(
                (child) => `${(child as HTMLElement).style.left},${(child as HTMLElement).style.top}`,
            );

            if (new Set(places).size !== places.length) log.sharedCell = true;
        }).observe(field, { childList: true });

        (window as unknown as { __fieldLog: FieldLog }).__fieldLog = log;
    }, FIELD);

const readLog = (page: Page) => page.evaluate(() => (window as unknown as { __fieldLog: FieldLog }).__fieldLog);

const placesOf = (component: Locator) =>
    component
        .locator(`${FIELD} > div`)
        .evaluateAll((elements) =>
            elements.map((element) => `${(element as HTMLElement).style.left},${(element as HTMLElement).style.top}`),
        );

test("the field spawns particles in place and removes them, one per cell", async ({ page, mount }) => {
    await mount(STORY);
    await installLog(page);
    await page.waitForTimeout(WATCH_MS);

    const log = await readLog(page);

    expect(log.added, "cells spawn").toBeGreaterThan(0);
    expect(log.removed, "and their particles are removed once they have lived").toBeGreaterThan(0);
    expect(log.sharedCell, "a cell never holds two particles at once").toBe(false);
});

test("at a spawn chance of 0 nothing spawns", async ({ page, mount }) => {
    await mount(STORY, { spawnChance: 0 });
    await installLog(page);
    await page.waitForTimeout(WATCH_MS);

    expect((await readLog(page)).added, "no cell wins a roll it cannot win").toBe(0);
});

test("a pass decided by chance shows the same particles each time it is revisited", async ({ page, mount }) => {
    const component = await mount(STORY, { spawnChance: 0.5 });

    await component.getByTestId("playback").click();
    await component.getByTestId("progress").focus();
    await page.keyboard.press("Home");

    const first = await placesOf(component);

    await page.keyboard.press("End");
    await expect.poll(() => placesOf(component), { message: "the far end of the pass is empty" }).toEqual([]);
    await page.keyboard.press("Home");

    expect(first.length, "some cells won their roll").toBeGreaterThan(0);
    await expect.poll(() => placesOf(component), { message: "and the same ones show on the way back" }).toEqual(first);
});

test("stopped, the field holds still, and the slider moves it through the pass", async ({ page, mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("playback").click();
    await component.getByTestId("progress").focus();
    await page.keyboard.press("Home");

    const atStart = await placesOf(component);

    await page.waitForTimeout(WATCH_MS / 5);

    expect(await placesOf(component), "nothing moves while stopped").toEqual(atStart);
    expect(atStart.length, "the pass's first particles are showing at its start").toBeGreaterThan(0);

    await page.keyboard.press("End");
    await expect
        .poll(() => placesOf(component), { message: "at the end of the pass every particle is gone" })
        .toEqual([]);
});

test("a particle is handed how far through its life it is, and the animation follows it", async ({ page, mount }) => {
    const component = await mount(STORY);

    await component.getByTestId("playback").click();
    await component.getByTestId("progress").focus();
    await page.keyboard.press("Home");

    const lives = await component
        .locator(`${FIELD} [data-life]`)
        .evaluateAll((elements) => elements.map((element) => Number(element.getAttribute("data-life"))));

    expect(lives.length).toBeGreaterThan(0);
    expect(
        lives.every((life) => life >= 0 && life <= 1),
        "a life runs from 0 to 1",
    ).toBe(true);

    const bodies = await component
        .locator(`${FIELD} > div > div`)
        .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).style.transform));

    expect(
        bodies.every((transform) => transform.startsWith("scale(")),
        "and each body is drawn by it",
    ).toBe(true);
});

test("a shaped field spawns only inside its shape", async ({ page, mount }) => {
    await mount(STORY, { isShaped: true });
    await installLog(page);
    await page.waitForTimeout(WATCH_MS);

    const { placements } = await readLog(page);
    const outside = placements.filter(
        ({ x, y, width, height }) => Math.abs(x / width - 0.5) + Math.abs(y / height - 0.5) > 0.5,
    );

    expect(placements.length, "the shape has cells inside it, and they spawn").toBeGreaterThan(0);
    expect(outside, "no particle is placed outside the lozenge").toEqual([]);
});
