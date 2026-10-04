import { MathUtils, type Point2d, Point2dUtils, type Size2d, StoreUtils } from "@thewaver/ss-utils";

import type { WraparoundPlane, WraparoundPlaneOpts, WraparoundPlaneState, WraparoundTile } from "./Wraparound.types";

/** How far the pointer must travel before a press counts as a drag rather than a tap. */
const DRAG_SLOP_PX = 4;

/** How far back the pointer's last positions are read to tell how fast it was moving when it let go. */
const VELOCITY_WINDOW_MS = 100;

/** Below this speed, in pixels per millisecond, a coasting plane is taken to have stopped. */
const MIN_SPEED_PX_PER_MS = 0.02;

/** How many pixels one line of a line-based wheel is taken to scroll. */
const WHEEL_LINE_PX = 16;

/** How much of the window a page key moves, keeping a strip of what was showing for the eye to follow. */
const PAGE_SHARE = 0.9;

/** Elements a press is left to, since dragging from one would take away selecting its text. */
const TEXT_ENTRY_SELECTOR = "input, textarea, select, [contenteditable]";

const ORIGIN: Point2d = { x: 0, y: 0 };

const ORIGINAL_TILE: WraparoundTile = { column: 0, row: 0 };

type PointerSample = {
    point: Point2d;
    timeMs: number;
};

type Motion =
    | { kind: "glide"; from: Point2d; to: Point2d; startMs: number; durationMs: number }
    | { kind: "coast"; velocity: Point2d; lastMs: number };

type Press = {
    pointerId: number;
    start: Point2d;
    startOffset: Point2d;
    samples: PointerSample[];
    isDragging: boolean;
    isFromOriginal: boolean;
};

const getIsSameTile = (a: WraparoundTile, b: WraparoundTile) => a.column === b.column && a.row === b.row;

const easeOut = (ratio: number) => 1 - (1 - ratio) ** 3;

const getSpeed = (velocity: Point2d) => Math.hypot(velocity.x, velocity.y);

/** How far a span must move to lie wholly inside the window, or to start at its start when it is bigger. */
const getFitDelta = (position: number, extent: number, view: number) => {
    if (position < 0 || extent >= view) return 0 - position;
    if (position + extent > view) return view - (position + extent);

    return 0;
};

/** One axis of {@link WraparoundUtils.computeReveal}. */
const revealAlong = (position: number, extent: number, period: number, view: number) => {
    const nearest = period >= 1 ? Math.round((view * 0.5 - (position + extent * 0.5)) / period) : 0;

    return [0, nearest - 1, nearest, nearest + 1]
        .map((shift) => ({ shift, delta: getFitDelta(position + shift * period, extent, view) }))
        .reduce((best, candidate) =>
            Math.abs(candidate.delta) < Math.abs(best.delta) ||
            (Math.abs(candidate.delta) === Math.abs(best.delta) && Math.abs(candidate.shift) < Math.abs(best.shift))
                ? candidate
                : best,
        );
};

/**
 * Repeats whatever arrangement it holds in every direction, so it can be moved forever.
 *
 * The content is drawn once for real — the original — and as many inert copies as it takes to cover the window,
 * laid edge to edge on a grid whose cell is the content's own size. Moving changes one offset; which grid cells are
 * drawn follows from it, so a tile leaving one edge is the same as a copy coming in at the other.
 *
 * The original is not tied to one cell. Every cell looks the same, so the original can be handed to any of them
 * without anything visible changing, and that is how everything that needs the real content is served: the pointer
 * hands it the cell it is over, so hover and clicks land on real elements, and a focused item hands it the cell
 * nearest the window, so tabbing to an item brings the item itself into view.
 */
export namespace WraparoundUtils {
    /**
     * Where a cell of the grid sits in the window.
     *
     * @param tile The cell.
     * @param offset How far the plane has been moved.
     * @param tileSize The content's size, which is the cell's.
     * @returns The cell's top-left corner, in the window's pixels.
     */
    export const getTilePosition = (tile: WraparoundTile, offset: Point2d, tileSize: Size2d): Point2d => ({
        x: offset.x + tile.column * tileSize.width,
        y: offset.y + tile.row * tileSize.height,
    });

    /**
     * Which cell of the grid lies under a point of the window.
     *
     * @param point The point, in the window's pixels.
     * @param offset How far the plane has been moved.
     * @param tileSize The content's size. A side under one pixel answers column or row `0`.
     */
    export const findTileAt = (point: Point2d, offset: Point2d, tileSize: Size2d): WraparoundTile => ({
        column: tileSize.width >= 1 ? Math.floor((point.x - offset.x) / tileSize.width) : 0,
        row: tileSize.height >= 1 ? Math.floor((point.y - offset.y) / tileSize.height) : 0,
    });

    /**
     * The cells to draw copies in: every one that shows in the window, the original's included.
     *
     * The original's cell gets a copy too, hidden by the caller while the original covers it, so that moving the
     * original from one cell to another changes which copy is hidden rather than which copies exist. A copy built
     * fresh needs a frame to draw, and rebuilding one on every move is what made tiles blink under a moving pointer.
     *
     * @param offset How far the plane has been moved.
     * @param tileSize The content's size. Under one pixel on either side there is nothing to repeat, and no copies
     * are drawn.
     * @param viewportSize The window's size.
     * @param maxCopies The most copies drawn. Content tiny next to its window would otherwise ask for thousands; past
     * the limit the window's far side is left uncovered rather than the page brought to a halt.
     * @returns The cells, row by row.
     */
    export const computeTiles = (
        offset: Point2d,
        tileSize: Size2d,
        viewportSize: Size2d,
        maxCopies: number,
    ): WraparoundTile[] => {
        if (tileSize.width < 1 || tileSize.height < 1) return [];

        const first = findTileAt(ORIGIN, offset, tileSize);
        const last = findTileAt(
            { x: Math.max(viewportSize.width - 1, 0), y: Math.max(viewportSize.height - 1, 0) },
            offset,
            tileSize,
        );

        const tiles: WraparoundTile[] = [];

        for (let row = first.row; row <= last.row; row++) {
            for (let column = first.column; column <= last.column; column++) {
                if (tiles.length >= maxCopies) return tiles;
                tiles.push({ column, row });
            }
        }

        return tiles;
    };

    /**
     * How to bring a part of the content into the window, moving as little as possible.
     *
     * The original may first move to a neighboring cell, which shows no change since every cell looks the same,
     * when that leaves less of a move; then the plane moves just far enough for the part to be wholly in view, or
     * for its start edge to be, when it is bigger than the window. A part already wholly in view moves nowhere and
     * keeps its cell, so a focus ring never jumps from one tile to another.
     *
     * @param tilePosition Where the original's cell sits in the window now.
     * @param rect The part, relative to the original's own top-left corner.
     * @param tileSize The content's size.
     * @param viewportSize The window's size.
     * @returns `shift`, how many cells across and down to move the original, and `delta`, how far to move the plane.
     */
    export const computeReveal = (
        tilePosition: Point2d,
        rect: { x: number; y: number; width: number; height: number },
        tileSize: Size2d,
        viewportSize: Size2d,
    ) => {
        const across = revealAlong(tilePosition.x + rect.x, rect.width, tileSize.width, viewportSize.width);
        const down = revealAlong(tilePosition.y + rect.y, rect.height, tileSize.height, viewportSize.height);

        return {
            shift: { column: across.shift, row: down.shift } satisfies WraparoundTile,
            delta: { x: across.delta, y: down.delta },
        };
    };

    /**
     * How fast the pointer was moving at the end of a drag.
     *
     * @param samples The pointer's positions through the drag, oldest first.
     * @param windowMs How far back from the last one to read.
     * @returns Pixels per millisecond on each axis, or none while fewer than two samples fall in the window.
     */
    export const computeVelocity = (samples: readonly PointerSample[], windowMs = VELOCITY_WINDOW_MS): Point2d => {
        const last = samples[samples.length - 1];
        const first = last && samples.find((sample) => last.timeMs - sample.timeMs <= windowMs);
        const elapsedMs = first ? last.timeMs - first.timeMs : 0;

        if (!first || elapsedMs <= 0) return ORIGIN;

        return { x: (last.point.x - first.point.x) / elapsedMs, y: (last.point.y - first.point.y) / elapsedMs };
    };

    /**
     * Moves a coasting plane on by the time that has passed, slowing it as it goes.
     *
     * The speed decays exponentially, by the same share in every equal stretch of time, so the coast lasts as long
     * on any frame rate; the distance is the exact sum of that decaying speed rather than a frame-by-frame guess.
     *
     * @param velocity How fast the plane is moving, in pixels per millisecond.
     * @param elapsedMs How long has passed.
     * @param momentumMs How slowly it loses speed: after this long about 63% of it is gone. `0` or less stops at once.
     * @returns How far it moved, and how fast it is moving now.
     */
    export const stepCoast = (velocity: Point2d, elapsedMs: number, momentumMs: number) => {
        if (momentumMs <= 0) return { distance: ORIGIN, velocity: ORIGIN };

        const kept = Math.exp(-Math.max(elapsedMs, 0) / momentumMs);
        const travelled = momentumMs * (1 - kept);

        return {
            distance: { x: velocity.x * travelled, y: velocity.y * travelled },
            velocity: { x: velocity.x * kept, y: velocity.y * kept },
        };
    };

    /**
     * How far a key moves the plane.
     *
     * The keys move the view the way a scrolled page's do — the right arrow shows more of what is to the right — so
     * the plane moves the other way.
     *
     * @param key The key's `KeyboardEvent.key`.
     * @param stepPx How far an arrow moves.
     * @param viewportSize The window's size, which a page key moves by most of.
     * @returns The plane's movement, or `undefined` for a key that does not move it.
     */
    export const computeKeyDelta = (key: string, stepPx: number, viewportSize: Size2d): Point2d | undefined => {
        const page = viewportSize.height * PAGE_SHARE;

        switch (key) {
            case "ArrowLeft":
                return { x: stepPx, y: 0 };
            case "ArrowRight":
                return { x: -stepPx, y: 0 };
            case "ArrowUp":
                return { x: 0, y: stepPx };
            case "ArrowDown":
                return { x: 0, y: -stepPx };
            case "PageUp":
                return { x: 0, y: page };
            case "PageDown":
                return { x: 0, y: -page };
        }
    };

    /**
     * Holds where a `Wraparound` has been moved to, and moves it.
     *
     * `observe` attaches every route to the window element: a drag that coasts on after the pointer lets go, the
     * wheel, the arrow and page keys while the window itself has focus, and `Home` back to where it started. It
     * also keeps the original under the pointer, so hovering and clicking reach real elements, and brings a focused
     * item into view, unless the focus arrived from a press. A drag that moved does not also click what it started
     * on; a tap on a copy clicks the matching element in the original.
     *
     * @param opts What the plane reads, at the moment it needs it.
     * @returns The plane.
     */
    export const createPlane = (opts: WraparoundPlaneOpts): WraparoundPlane => {
        const store = StoreUtils.create<WraparoundPlaneState>({
            offset: ORIGIN,
            original: ORIGINAL_TILE,
            isDragging: false,
        });

        let motion: Motion | undefined;
        let frame: number | undefined;
        let press: Press | undefined;

        const setOffset = (offset: Point2d) => store.update((state) => ({ ...state, offset }));

        const setOriginal = (original: WraparoundTile) =>
            store.update((state) => (getIsSameTile(state.original, original) ? state : { ...state, original }));

        const stopMotion = () => {
            motion = undefined;

            if (frame !== undefined) cancelAnimationFrame(frame);

            frame = undefined;
        };

        const tick = (nowMs: number) => {
            frame = undefined;

            if (!motion) return;

            if (motion.kind === "glide") {
                const ratio = MathUtils.clamp01((nowMs - motion.startMs) / motion.durationMs);
                const eased = easeOut(ratio);

                setOffset(Point2dUtils.lerp(motion.from, motion.to, eased));

                if (ratio >= 1) motion = undefined;
            } else {
                const step = stepCoast(motion.velocity, nowMs - motion.lastMs, opts.getMomentumMs());
                const { offset } = store.get();

                setOffset({ x: offset.x + step.distance.x, y: offset.y + step.distance.y });

                motion =
                    getSpeed(step.velocity) < MIN_SPEED_PX_PER_MS ? undefined : { ...motion, ...step, lastMs: nowMs };
            }

            if (motion) frame = requestAnimationFrame(tick);
        };

        const startMotion = (next: Motion) => {
            stopMotion();

            motion = next;
            frame = requestAnimationFrame(tick);
        };

        const moveBy = (delta: Point2d, isGliding = false) => {
            const from = store.get().offset;
            const base = motion?.kind === "glide" ? motion.to : from;
            const to = { x: base.x + delta.x, y: base.y + delta.y };
            const durationMs = opts.getGlideDurationMs();

            if (!isGliding || durationMs <= 0) {
                stopMotion();
                setOffset(to);

                return;
            }

            startMotion({ kind: "glide", from, to, startMs: performance.now(), durationMs });
        };

        const getOriginalPosition = () => getTilePosition(store.get().original, store.get().offset, opts.getTileSize());

        const reveal = (element: HTMLElement, isGliding = true) => {
            const original = opts.getOriginal();

            if (!original?.contains(element)) return;

            stopMotion();

            const box = original.getBoundingClientRect();
            const target = element.getBoundingClientRect();
            const { shift, delta } = computeReveal(
                getOriginalPosition(),
                { x: target.left - box.left, y: target.top - box.top, width: target.width, height: target.height },
                opts.getTileSize(),
                opts.getViewportSize(),
            );
            const { original: tile } = store.get();

            setOriginal({ column: tile.column + shift.column, row: tile.row + shift.row });
            moveBy(delta, isGliding);
        };

        const reset = () => {
            stopMotion();

            const tileSize = opts.getTileSize();
            const tile = findTileAt(
                { x: tileSize.width * 0.5, y: tileSize.height * 0.5 },
                store.get().offset,
                tileSize,
            );

            setOriginal(tile);

            const position = getOriginalPosition();

            moveBy({ x: -position.x, y: -position.y }, true);
        };

        const observe = (root: HTMLElement) => {
            const toLocal = (event: PointerEvent): Point2d => {
                const box = root.getBoundingClientRect();

                return { x: event.clientX - box.left, y: event.clientY - box.top };
            };

            const moveOriginalUnder = (event: PointerEvent) =>
                setOriginal(findTileAt(toLocal(event), store.get().offset, opts.getTileSize()));

            const suppressNextClick = () => {
                const handleClick = (event: MouseEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                };

                root.addEventListener("click", handleClick, { capture: true, once: true });
                setTimeout(() => root.removeEventListener("click", handleClick, { capture: true }));
            };

            const handlePointerDown = (event: PointerEvent) => {
                if (opts.getIsDisabled() || event.button !== 0) return;
                if (event.target instanceof Element && event.target.closest(TEXT_ENTRY_SELECTOR)) return;

                stopMotion();
                moveOriginalUnder(event);

                const target = event.target;

                press = {
                    pointerId: event.pointerId,
                    start: { x: event.clientX, y: event.clientY },
                    startOffset: store.get().offset,
                    samples: [{ point: { x: event.clientX, y: event.clientY }, timeMs: event.timeStamp }],
                    isDragging: false,
                    isFromOriginal: target instanceof Node && (opts.getOriginal()?.contains(target) ?? false),
                };
            };

            const handlePointerMove = (event: PointerEvent) => {
                if (!press) {
                    const isFocusShown = opts.getOriginal()?.querySelector(":focus-visible") !== null;

                    if (event.pointerType === "mouse" && !isFocusShown && !opts.getIsDisabled()) {
                        moveOriginalUnder(event);
                    }

                    return;
                }

                if (event.pointerId !== press.pointerId) return;

                const moved = { x: event.clientX - press.start.x, y: event.clientY - press.start.y };

                if (!press.isDragging && Math.hypot(moved.x, moved.y) > DRAG_SLOP_PX) {
                    press.isDragging = true;
                    root.setPointerCapture(event.pointerId);
                    store.update((state) => ({ ...state, isDragging: true }));
                }

                if (!press.isDragging) return;

                press.samples.push({ point: { x: event.clientX, y: event.clientY }, timeMs: event.timeStamp });
                press.samples = press.samples.filter((sample) => event.timeStamp - sample.timeMs <= VELOCITY_WINDOW_MS);

                setOffset({ x: press.startOffset.x + moved.x, y: press.startOffset.y + moved.y });
            };

            const endPress = () => {
                press = undefined;
                store.update((state) => (state.isDragging ? { ...state, isDragging: false } : state));
            };

            const handlePointerUp = (event: PointerEvent) => {
                if (!press || event.pointerId !== press.pointerId) return;

                const ended = press;

                endPress();

                if (ended.isDragging) {
                    suppressNextClick();

                    const velocity = computeVelocity(ended.samples);

                    if (opts.getMomentumMs() > 0 && getSpeed(velocity) >= MIN_SPEED_PX_PER_MS) {
                        startMotion({ kind: "coast", velocity, lastMs: performance.now() });
                    }

                    return;
                }

                if (ended.isFromOriginal) return;

                const hit = document.elementFromPoint(event.clientX, event.clientY);

                if (hit instanceof HTMLElement && opts.getOriginal()?.contains(hit)) hit.click();
            };

            const handleWheel = (event: WheelEvent) => {
                if (opts.getIsDisabled()) return;

                event.preventDefault();

                const scale =
                    event.deltaMode === WheelEvent.DOM_DELTA_LINE
                        ? WHEEL_LINE_PX
                        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
                          ? opts.getViewportSize().height
                          : 1;

                moveBy({ x: -event.deltaX * scale, y: -event.deltaY * scale });
            };

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.target !== root || opts.getIsDisabled()) return;

                if (event.key === "Home") {
                    event.preventDefault();
                    reset();

                    return;
                }

                const delta = computeKeyDelta(event.key, opts.getKeyStepPx(), opts.getViewportSize());

                if (!delta) return;

                event.preventDefault();
                moveBy(delta, true);
            };

            const handleFocusIn = (event: FocusEvent) => {
                if (press || event.target === root || !(event.target instanceof HTMLElement)) return;

                reveal(event.target);
            };

            const handleDragStart = (event: DragEvent) => event.preventDefault();

            root.addEventListener("pointerdown", handlePointerDown);
            root.addEventListener("pointermove", handlePointerMove);
            root.addEventListener("pointerup", handlePointerUp);
            root.addEventListener("pointercancel", endPress);
            root.addEventListener("wheel", handleWheel, { passive: false });
            root.addEventListener("keydown", handleKeyDown);
            root.addEventListener("focusin", handleFocusIn);
            root.addEventListener("dragstart", handleDragStart);

            return () => {
                root.removeEventListener("pointerdown", handlePointerDown);
                root.removeEventListener("pointermove", handlePointerMove);
                root.removeEventListener("pointerup", handlePointerUp);
                root.removeEventListener("pointercancel", endPress);
                root.removeEventListener("wheel", handleWheel);
                root.removeEventListener("keydown", handleKeyDown);
                root.removeEventListener("focusin", handleFocusIn);
                root.removeEventListener("dragstart", handleDragStart);
                endPress();
            };
        };

        return {
            get: store.get,
            subscribe: store.subscribe,
            observe,
            moveBy,
            reveal,
            reset,
            destroy: stopMotion,
        };
    };
}
