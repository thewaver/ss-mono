import { type Page, expect, test } from "@playwright/test";

/**
 * The React bracket connector samples, each joining the matches of its own board. The React `Bracket` spec paints
 * with connectors of the story's own; this one holds the samples themselves to what `e2e/bracket.spec.ts` asks of
 * the Solid ones on the Playground: one line per feeding match, and every line leaving one match's edge and arriving
 * at another's. The edges are measured off the rendered boxes, and the line ends off the rendered paths, so nothing
 * here depends on the story's node size or gaps.
 *
 * Both orientations are mounted, since which axis a line bends on is the sample's to work out from the orientation.
 */
const STORY = "Samples/BracketConnectors/Boards";
const CONNECTOR_SAMPLES = ["flat", "rounded", "curved", "ballAndArrow"];
const ORIENTATIONS = ["horizontal", "vertical"];
const EDGE_TOLERANCE = 1;

const board = (key: string) => `[data-connector="${key}"]`;

/**
 * Every match's box and both ends of every drawn line, in the page's own pixels. A path's ends come from the path
 * itself, mapped through its screen transform, rather than from its `d`, so a sample that draws its line any way it
 * likes is still measured the same.
 */
const readBoard = (page: Page, key: string) =>
    page.evaluate((selector) => {
        const root = document.querySelector(selector)!;
        const toScreen = (element: SVGGraphicsElement, x: number, y: number) => {
            const matrix = element.getScreenCTM()!;

            return { x: x * matrix.a + y * matrix.c + matrix.e, y: x * matrix.b + y * matrix.d + matrix.f };
        };

        return {
            boxes: [...root.querySelectorAll("li")].map((item) => {
                const rect = item.getBoundingClientRect();

                return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
            }),
            lines: [...root.querySelectorAll("svg path")].map((element) => {
                const path = element as SVGPathElement;
                const start = path.getPointAtLength(0);
                const end = path.getPointAtLength(path.getTotalLength());

                return { start: toScreen(path, start.x, start.y), end: toScreen(path, end.x, end.y) };
            }),
            balls: [...root.querySelectorAll("svg circle")].map((element) => {
                const circle = element as SVGCircleElement;

                return toScreen(circle, circle.cx.baseVal.value, circle.cy.baseVal.value);
            }),
        };
    }, board(key));

type Box = { left: number; top: number; right: number; bottom: number };
type Point = { x: number; y: number };

const isWithin = (value: number, from: number, to: number) =>
    value >= from - EDGE_TOLERANCE && value <= to + EDGE_TOLERANCE;

const isOnEdge = (point: Point, box: Box) =>
    isWithin(point.x, box.left, box.right) &&
    isWithin(point.y, box.top, box.bottom) &&
    Math.min(
        Math.abs(point.x - box.left),
        Math.abs(point.x - box.right),
        Math.abs(point.y - box.top),
        Math.abs(point.y - box.bottom),
    ) <= EDGE_TOLERANCE;

const touchedBy = (point: Point, boxes: Box[]) => boxes.findIndex((box) => isOnEdge(point, box));

for (const orientation of ORIENTATIONS) {
    test(`every sample draws one line per feeding match, ${orientation}`, async ({ mount, page }) => {
        await mount(STORY, { orientation });

        for (const key of CONNECTOR_SAMPLES) {
            const { boxes, lines } = await readBoard(page, key);

            expect(boxes.length, `the ${key} board has its matches`).toBeGreaterThan(1);
            expect(lines.length, `every match but the final is joined to the one it feeds, by ${key}`).toBe(
                boxes.length - 1,
            );
        }
    });

    test(`every line leaves one match's edge and arrives at another's, ${orientation}`, async ({ mount, page }) => {
        await mount(STORY, { orientation });

        for (const key of CONNECTOR_SAMPLES) {
            const { boxes, lines } = await readBoard(page, key);

            for (const line of lines) {
                const from = touchedBy(line.start, boxes);
                const to = touchedBy(line.end, boxes);

                expect(from, `a ${key} line starts on a match's edge`).toBeGreaterThanOrEqual(0);
                expect(to, `and ends on a match's edge`).toBeGreaterThanOrEqual(0);
                expect(to, `and the two are different matches`).not.toBe(from);
            }
        }
    });
}

test("the ball sits where each line arrives", async ({ mount, page }) => {
    await mount(STORY);

    const { boxes, lines, balls } = await readBoard(page, "ballAndArrow");

    expect(balls.length, "one ball per line").toBe(lines.length);

    for (const [index, ball] of balls.entries()) {
        expect(touchedBy(ball, boxes), "the ball is on a match's edge").toBeGreaterThanOrEqual(0);
        expect(ball.x, "at the end of its own line").toBeCloseTo(lines[index].end.x, 0);
        expect(ball.y).toBeCloseTo(lines[index].end.y, 0);
    }
});
