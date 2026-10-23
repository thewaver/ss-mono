import { CSSUtils, EasingUtils, MathUtils, type Point2d, type Span, type SwipeDirection } from "@thewaver/ss-utils";

import type {
    CarouselAxis,
    CarouselOrientation,
    CarouselPlacement,
    CarouselPlacementGroup,
    CarouselStep,
} from "./Carousel.types";

/** Halfway, for comparing a turn against half the item count. */
const HALF = 0.5;

/** How finely layers are told apart once they become whole-number `z-index` values. */
const LAYER_RESOLUTION = 100;

/** A whole turn over, which is how a slide's back is drawn facing the other way. */
const TURNED_OVER_DEGREES = 180;

/** A slide's center, where it turns and scales about unless its placement says otherwise. */
const CENTER: Point2d = { x: 0.5, y: 0.5 };

const PERCENT = 100;

/** The furthest a swipe is allowed to drag the slides, as a share of one slide. */
const SWIPE_RATIO_LIMIT = 1;

/** What the library prints when the groups a consumer handed over had to be fixed before they could be used. */
const FIXED_GROUPS_WARNING = "Carousel: the ranges computeGroups returned had to be fixed —";

/** What the library prints when nothing usable was left of the groups a consumer handed over. */
const FALLBACK_GROUPS_WARNING =
    "Carousel: computeGroups returned no range holding a slide, so every slide is its own group.";

/** One group per slide, which is how a carousel without groups moves. */
const toSingleGroups = (count: number): Span[] =>
    Array.from({ length: Math.max(count, 0) }, (_, index) => ({ start: index, end: index + 1 }));

/** Orders groups by their start, and a tie by their end, so every pair compares the same way each time. */
const compareGroups = (a: Span, b: Span) => a.start - b.start || a.end - b.end;

/** Moves a carousel's index around, taking the shorter way round. */
export namespace CarouselUtils {
    /** How far across the viewport a swipe has to travel, as a share of it, before letting go steps the carousel. */
    export const SWIPE_COMMIT_RATIO = 0.2;

    /** The fewest slides a carousel can move between. Below it, nothing steps, swipes or rotates. */
    export const MIN_ROTATABLE_COUNT = 2;

    /** Brings an index into range, wrapping at both ends. */
    export const wrapIndex = MathUtils.wrapIndex;

    /**
     * Where an index lands, or nowhere when it runs off the end of a carousel that does not loop.
     *
     * The one rule for every way a carousel moves — a step, a swipe, a pick, the next turn of automatic
     * rotation — so none of them can wrap where another would stop.
     *
     * @param index The index asked for, which may lie outside the range.
     * @param count How many items there are.
     * @param isLooping Whether running off one end comes round to the other.
     * @returns The index brought into range, or `undefined` when it is outside the range and the carousel
     * does not loop.
     */
    export const resolveIndex = (index: number, count: number, isLooping: boolean) => {
        if (!isLooping && (index < 0 || index >= count)) return undefined;

        return wrapIndex(index, count);
    };

    /**
     * Which item a step moves to.
     *
     * @param step `"previous"` or `"next"`.
     * @param index The current item.
     * @param count How many items there are.
     * @param isLooping Whether stepping past either end continues round. Defaults to `true`.
     * @returns The new index — wrapped when looping, and otherwise the current index where the step would
     * run off the end, so a step there can tell it has nowhere to go.
     */
    export const getStepTarget = (step: CarouselStep, index: number, count: number, isLooping = true) =>
        resolveIndex(index + (step === "previous" ? -1 : 1), count, isLooping) ?? wrapIndex(index, count);

    /**
     * Whether a step has nowhere to go.
     *
     * @param step `"previous"` or `"next"`.
     * @param index The current item.
     * @param count How many items there are.
     * @param isLooping Whether stepping past either end continues round.
     * @returns `true` only on a carousel that does not loop, for Previous on the first item and Next on the
     * last; a looping carousel always has somewhere to step.
     */
    export const getIsStepAtEnd = (step: CarouselStep, index: number, count: number, isLooping: boolean) =>
        resolveIndex(index + (step === "previous" ? -1 : 1), count, isLooping) === undefined;

    /**
     * How many places to turn to get from one item to another, the shorter way round.
     *
     * The sign is what matters: a carousel of ten going from item 1 to item 9 turns two places backwards
     * rather than eight forwards, so the animation goes the way the user expects.
     *
     * @param from The current item.
     * @param to The item to reach.
     * @param count How many items there are.
     * @returns The number of places, negative to go backwards. Ties go forwards.
     */
    export const getTurnSteps = (from: number, to: number, count: number) => {
        if (count <= 0) return 0;

        const forward = wrapIndex(to - from, count);

        return forward > count * HALF ? forward - count : forward;
    };

    /**
     * Whether the slides travel across the screen rather than up and down it, which is the way a swipe is taken.
     *
     * @param orientation Which way the carousel runs.
     * @returns `true` when the slides move left and right.
     */
    export const getTravelsAcross = (orientation: CarouselOrientation) => orientation === "horizontal";

    /**
     * Whether swipes and presses on the slides are refused.
     *
     * A carousel whose `progress` is written from outside — by a scroll position, say — is moved by that consumer, so
     * its swipes are left to the browser and its axis is never claimed. A disabled carousel, or one with nothing to
     * move between, refuses too. Any other carousel takes them, whether or not the consumer built buttons on its
     * controller: the carousel draws no controls of its own, so it cannot tell.
     *
     * @param isDrivenFromOutside Whether the consumer writes `progress`.
     * @param isDisabled Whether the carousel is disabled.
     * @param count How many slides there are.
     * @returns `true` when the swipe is to be left to the browser.
     */
    export const getIsSwipeDisabled = (isDrivenFromOutside: boolean, isDisabled: boolean, count: number) =>
        isDrivenFromOutside || isDisabled || count < MIN_ROTATABLE_COUNT;

    /**
     * Holds a swipe's progress to at most one slide either way.
     *
     * @param progressRatio The swipe's progress as a signed share of the viewport.
     * @returns The progress, held between `-1` and `1`.
     */
    export const clampSwipeRatio = (progressRatio: number) =>
        MathUtils.clamp(progressRatio, -SWIPE_RATIO_LIMIT, SWIPE_RATIO_LIMIT);

    /**
     * Which way a committed swipe steps the carousel.
     *
     * Pushing the slides left or up brings the next one in, the way a page is turned; pushing them right or
     * down goes back.
     *
     * @param direction The way the swipe committed.
     * @returns `1` to step forwards, `-1` to step back.
     */
    export const getSwipeStep = (direction: SwipeDirection) => (direction === "left" || direction === "up" ? 1 : -1);

    /**
     * Whether a step is refused.
     *
     * @param step `"previous"` or `"next"`.
     * @param index The current slide.
     * @param count How many slides there are.
     * @param isLooping Whether stepping past either end continues round.
     * @param isDisabled Whether the whole carousel is disabled.
     * @returns `true` for a disabled carousel, one with nothing to step between, and a step at the end of a
     * carousel that does not loop.
     */
    export const getIsStepDisabled = (
        step: CarouselStep,
        index: number,
        count: number,
        isLooping: boolean,
        isDisabled: boolean,
    ) => isDisabled || count < MIN_ROTATABLE_COUNT || getIsStepAtEnd(step, index, count, isLooping);

    /**
     * Whether the carousel is advancing by itself right now.
     *
     * It needs a delay to advance on, playback switched on, and more than one slide; and it holds while the
     * pointer or focus is inside it, while a swipe is under way, and while it is disabled.
     *
     * @param defs.autoplayDelayMs How long each slide is held. Without one the carousel never advances itself.
     * @param defs.isPlaying Whether playback is on.
     * @param defs.isHeld Whether the pointer, focus or a hidden tab is holding it.
     * @param defs.isSwiping Whether a swipe is under way.
     * @param defs.isDisabled Whether the carousel is disabled.
     * @param defs.count How many slides there are.
     * @returns Whether the next slide is on a timer.
     */
    export const getIsRotating = (defs: {
        autoplayDelayMs: number | undefined;
        isPlaying: boolean;
        isHeld: boolean;
        isSwiping: boolean;
        isDisabled: boolean;
        count: number;
    }) =>
        defs.autoplayDelayMs !== undefined &&
        defs.isPlaying &&
        !defs.isHeld &&
        !defs.isSwiping &&
        !defs.isDisabled &&
        defs.count >= MIN_ROTATABLE_COUNT;

    /**
     * Whether playback should switch itself off, because a carousel that does not loop has reached its last slide.
     *
     * Rotation on such a carousel has nowhere to go from the end, so it stops there for good rather than
     * springing back to the start; switching playback off is what makes the play control say so.
     *
     * @param defs.isLooping Whether the carousel loops. A looping one never stops.
     * @param defs.autoplayDelayMs How long each slide is held, or `undefined` for a carousel that never rotates.
     * @param defs.isPlaying Whether playback is on.
     * @param defs.isDisabled Whether the carousel is disabled.
     * @param defs.count How many slides there are.
     * @param defs.index The current slide.
     * @returns `true` when playback should be set to `false`.
     */
    export const getIsPlaybackAtEnd = (defs: {
        isLooping: boolean;
        autoplayDelayMs: number | undefined;
        isPlaying: boolean;
        isDisabled: boolean;
        count: number;
        index: number;
    }) =>
        !defs.isLooping &&
        defs.autoplayDelayMs !== undefined &&
        defs.isPlaying &&
        !defs.isDisabled &&
        defs.count >= MIN_ROTATABLE_COUNT &&
        defs.index === defs.count - 1;

    /**
     * Whether a change of slide should be announced.
     *
     * A move the user made — a step, a pick, a swipe — is announced; a move made by automatic rotation is not,
     * since reading out every slide as it passes would talk over whatever the user is actually doing.
     *
     * @param previousIndex The slide before, or `undefined` before there was one.
     * @param index The slide now.
     * @param isRotating Whether the carousel is advancing by itself.
     * @returns `true` when the new slide's label should be announced.
     */
    export const getIsAnnounced = (previousIndex: number | undefined, index: number, isRotating: boolean) =>
        previousIndex !== undefined && previousIndex !== index && !isRotating;

    /**
     * Whether a slide is built, for a carousel that builds only what its placement draws.
     *
     * @param distance How far the slide is from where the carousel is, from {@link getDistance}.
     * @param reach How far either side the placement draws — see `CarouselPlacementRule.reach`. Missing means the
     * rule cannot say, so every slide is built.
     * @param isWindowed Whether the carousel asked to build only what is drawn.
     * @returns `true` unless the carousel is windowed and the slide is further away than the rule draws.
     */
    export const getIsBuilt = (distance: number, reach: number | undefined, isWindowed: boolean) =>
        !isWindowed || reach === undefined || Math.abs(distance) <= reach;

    /**
     * How far one slide is from where the carousel is, in slides.
     *
     * On a looping carousel it is the short way round, so with the last slide showing the first sits at `1` rather
     * than at the far end; that is what puts the first slide beside the last instead of rewinding past every slide
     * in between.
     *
     * @param index The slide.
     * @param position Where the carousel is, from {@link toGroupPosition}.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     * @returns The signed distance: positive for a slide still to come, negative for one already passed.
     */
    export const getDistance = (index: number, position: number, count: number, isLooping: boolean) => {
        const straight = index - position;

        if (!isLooping || count <= 0) return straight;

        const forward = MathUtils.wrap(straight, count);

        return forward > count * HALF ? forward - count : forward;
    };

    /**
     * How many times the slides are drawn round a looping carousel, so its placement rule finds a slide at every
     * distance it reaches, on both sides at once.
     *
     * A ring has room for `reach` slides either side of the one showing only when it holds at least `2 × reach + 1`;
     * with fewer, the slide furthest round has to swap from one end to the other while it is still drawn. The whole
     * list is repeated rather than single slides, so every slide keeps the same neighbors in every copy.
     *
     * @param count How many slides there are.
     * @param reach How far either side the rule draws — see `CarouselPlacementRule.reach`.
     * @param isLooping Whether the carousel loops.
     * @returns How many times the list is drawn: `1` on a carousel that does not loop, with fewer than two slides, or
     * for a rule with no reach.
     */
    export const getCopyCount = (count: number, reach: number | undefined, isLooping: boolean) =>
        !isLooping || reach === undefined || count < MIN_ROTATABLE_COUNT
            ? 1
            : Math.max(1, Math.ceil((2 * reach + 1) / count));

    /**
     * Where a looping carousel is round its ring of copies, following its position as it moves.
     *
     * The position runs round one lap of the real slides, so on its own it cannot say which copy of the slide showing
     * is in front. This keeps to the copy nearest where the ring was, so the ring turns on continuously as the
     * position comes round a lap instead of jumping back to its first copy.
     *
     * @param previous Where the ring was, or `undefined` before it had been placed.
     * @param position Where the carousel is, from {@link toGroupPosition}, as it is drawn.
     * @param count How many slides there are.
     * @param copies How many times the list is drawn, from {@link getCopyCount}.
     * @returns A position counted in slides round the ring of `count × copies`.
     */
    export const followCopies = (previous: number | undefined, position: number, count: number, copies: number) => {
        if (copies <= 1 || previous === undefined) return position;

        const ring = count * copies;
        let nearest = position;
        let nearestGap = Infinity;

        for (let copy = 0; copy < copies; copy++) {
            const candidate = position + copy * count;
            const gap = Math.abs(getDistance(candidate, previous, ring, true));

            if (gap < nearestGap) {
                nearest = candidate;
                nearestGap = gap;
            }
        }

        return nearest;
    };

    /**
     * Which place round the ring of copies shows a slide, when the slides are drawn more than once.
     *
     * Of the copies of the slide, the one nearest where the ring is — the one a glide to that slide is heading for.
     *
     * @param index The slide, counting the real ones from zero.
     * @param ringPosition Where the ring is, from {@link followCopies}.
     * @param count How many slides there are.
     * @param copies How many times the list is drawn.
     * @returns The place round the ring, from `0` to `count × copies - 1`.
     */
    export const getNearestCopy = (index: number, ringPosition: number, count: number, copies: number) => {
        const ring = count * copies;
        let nearest = index;
        let nearestGap = Infinity;

        for (let copy = 0; copy < copies; copy++) {
            const place = index + copy * count;
            const gap = Math.abs(getDistance(place, ringPosition, ring, true));

            if (gap < nearestGap) {
                nearest = place;
                nearestGap = gap;
            }
        }

        return nearest;
    };

    /**
     * Where to glide to so that a slide is the one showing, starting from a position.
     *
     * @param position Where the carousel is now.
     * @param index The slide to bring up.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops, in which case the glide goes the short way round.
     * @returns The position to end at, which on a looping carousel may lie past either end of the lap.
     */
    export const getGlideTarget = (position: number, index: number, count: number, isLooping: boolean) =>
        isLooping ? position + getDistance(index, position, count, isLooping) : index;

    /**
     * The groups a carousel moves between, made safe to use.
     *
     * Without `computeGroups` every slide is its own group, which is how a carousel moves when it has none. What a
     * consumer's `computeGroups` returned is held inside the list and to whole slides, empty ranges are dropped and
     * the rest put in order of their start; overlapping and repeated ranges are kept. A console warning names what
     * had to be fixed, and when nothing usable is left the carousel falls back to one group per slide, with a
     * warning of its own. An empty list has no groups and warns about nothing.
     *
     * @param groups What `computeGroups` returned, or `undefined` when the carousel has none.
     * @param count How many slides there are.
     * @returns The groups, each a range of slide indices with `end` excluded, in order of their start.
     */
    export const resolveGroups = (groups: readonly Span[] | undefined, count: number): Span[] => {
        if (groups === undefined || count <= 0) return toSingleGroups(count);

        const held = groups.map((group) => ({
            start: MathUtils.clamp(Math.round(group.start), 0, count),
            end: MathUtils.clamp(Math.round(group.end), 0, count),
        }));
        const kept = held.filter((group) => group.end > group.start);

        if (kept.length < 1) {
            console.warn(FALLBACK_GROUPS_WARNING);

            return toSingleGroups(count);
        }

        const ordered = [...kept].sort(compareGroups);
        const fixes = [
            held.some((group, index) => group.start !== groups[index].start || group.end !== groups[index].end)
                ? "held inside the list, to whole slides"
                : undefined,
            kept.length < held.length ? "empty ones dropped" : undefined,
            ordered.some((group, index) => group !== kept[index]) ? "put in order of their start" : undefined,
        ].filter((fix) => fix !== undefined);

        if (fixes.length > 0) console.warn(`${FIXED_GROUPS_WARNING} ${fixes.join(", ")}.`);

        return ordered;
    };

    /**
     * Where the carousel rests while a group shows, in slides: the middle of the group's slides.
     *
     * A group of one rests on its slide, so a carousel without groups rests where it always did; a pair rests
     * halfway between its two slides, which is what puts them at `-0.5` and `0.5` from where the carousel is.
     *
     * @param group A range of slide indices, `end` excluded.
     */
    export const getGroupRest = (group: Span) => (group.start + group.end - 1) * HALF;

    /**
     * How many slides one whole run of `progress` covers when the carousel moves between groups: the whole ring on a
     * looping carousel, and from where the first group rests to where the last one does on one that stops at its
     * ends. With one group per slide it is the slide count on a looping carousel and one fewer on one that stops.
     *
     * @param rests Where each group rests, from {@link getGroupRest}, in order.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel comes round from its last group to its first.
     */
    export const getGroupLapLength = (rests: readonly number[], count: number, isLooping: boolean) =>
        Math.max(isLooping ? count : (rests.at(-1) ?? 0) - (rests[0] ?? 0), 0);

    /**
     * Where a progress puts a carousel that moves between groups, in slides. `0` is the first group at rest; on one
     * that stops at its ends `1` is the last group at rest, and on a looping one it is a whole lap round to the first
     * again. With one group per slide, a progress is that share of the lap counted in slides.
     *
     * @param progress How far along, `0` to `1`.
     * @param rests Where each group rests, from {@link getGroupRest}, in order.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     * @returns A position counted in slides from the first, fractional between two of them.
     */
    export const toGroupPosition = (progress: number, rests: readonly number[], count: number, isLooping: boolean) =>
        (rests[0] ?? 0) + MathUtils.clamp01(progress) * getGroupLapLength(rests, count, isLooping);

    /**
     * The progress that describes a position, the reverse of {@link toGroupPosition}.
     *
     * @param position A position counted in slides from the first, which on a looping carousel may have run past
     * either end of the lap.
     * @param rests Where each group rests, from {@link getGroupRest}, in order.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     * @returns `0` to `1`, and `0` when there is nothing to move between.
     */
    export const toGroupProgress = (position: number, rests: readonly number[], count: number, isLooping: boolean) => {
        const lap = getGroupLapLength(rests, count, isLooping);
        const offset = position - (rests[0] ?? 0);

        if (lap <= 0) return 0;

        return isLooping ? MathUtils.wrap(offset, lap) / lap : MathUtils.clamp01(offset / lap);
    };

    /**
     * Which group a position is nearest to, which is the group counted as showing.
     *
     * Nearest is measured to where each group rests, the short way round on a looping carousel; between two equally
     * near, the one still to come wins, as rounding a position up does. With one group per slide it is the
     * nearest slide.
     *
     * @param position Where the carousel is, from {@link toGroupPosition}.
     * @param rests Where each group rests, from {@link getGroupRest}, in order.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     * @returns The group's index, or `0` when there are none.
     */
    export const getNearestGroup = (position: number, rests: readonly number[], count: number, isLooping: boolean) => {
        let nearest = 0;
        let nearestDistance = Infinity;

        rests.forEach((rest, group) => {
            const distance = getDistance(rest, position, count, isLooping);
            const gap = Math.abs(distance);
            const nearestGap = Math.abs(nearestDistance);

            if (gap < nearestGap || (gap === nearestGap && distance > nearestDistance)) {
                nearest = group;
                nearestDistance = distance;
            }
        });

        return nearest;
    };

    /**
     * Which group a press on a slide brings up: of the groups holding the slide, the one resting nearest where the
     * carousel is, so the carousel moves as little as it can to show the slide.
     *
     * @param index The slide pressed.
     * @param groups The groups, from {@link resolveGroups}.
     * @param position Where the carousel is.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     * @returns The group's index, or `undefined` when no group holds the slide.
     */
    export const getNearestGroupHolding = (
        index: number,
        groups: readonly Span[],
        position: number,
        count: number,
        isLooping: boolean,
    ) => {
        let nearest: number | undefined;
        let nearestGap = Infinity;

        groups.forEach((group, groupIndex) => {
            if (index < group.start || index >= group.end) return;

            const gap = Math.abs(getDistance(getGroupRest(group), position, count, isLooping));

            if (gap < nearestGap) {
                nearest = groupIndex;
                nearestGap = gap;
            }
        });

        return nearest;
    };

    /**
     * Which place round the ring of copies holds the first slide of a group, when the slides are drawn more than
     * once: the copy whose middle is nearest where the ring is. With the slides drawn once it is the group's start.
     *
     * @param group A range of slide indices, `end` excluded.
     * @param ringPosition Where the ring is, from {@link followCopies}.
     * @param count How many slides there are.
     * @param copies How many times the list is drawn, from {@link getCopyCount}.
     * @returns The place round the ring, which the group's slides follow one after another.
     */
    export const getGroupPlace = (group: Span, ringPosition: number, count: number, copies: number) => {
        const rest = getGroupRest(group);

        return getNearestCopy(rest, ringPosition, count, copies) - (rest - group.start);
    };

    /**
     * Whether a place round the ring holds one of a group's slides.
     *
     * @param place The place, from `0` to `ringCount - 1`.
     * @param groupPlace Where the group's first slide is, from {@link getGroupPlace}.
     * @param size How many slides the group holds.
     * @param ringCount How many places the ring has: the slide count times the copies.
     */
    export const getIsInGroupPlace = (place: number, groupPlace: number, size: number, ringCount: number) =>
        MathUtils.wrap(place - groupPlace, ringCount) < size;

    /**
     * A slide as a group of one, which is how every slide is placed on a carousel without groups.
     *
     * @param distance The slide's distance, from {@link getDistance}.
     * @param index The slide's place, counting from zero round a looping carousel's ring.
     * @param count How many places there are.
     * @returns The group a placement rule is handed: the slide's own distance, index and count, alone in its group.
     */
    export const toSlideGroup = (distance: number, index: number, count: number): CarouselPlacementGroup => ({
        distance,
        index,
        count,
        slot: 0,
        size: 1,
    });

    /**
     * Which groups hold each slide, and where in each it sits, worked out once so placing a slide on every frame does
     * not search the groups again.
     *
     * @param groups The groups, from {@link resolveGroups}.
     * @param count How many slides there are.
     * @returns For each slide, every group holding it, in the groups' order: the group's index, the slide's slot in it
     * and the group's size. A slide no group holds has none.
     */
    export const getGroupMemberships = (groups: readonly Span[], count: number) => {
        const memberships = Array.from(
            { length: Math.max(count, 0) },
            () => [] as Pick<CarouselPlacementGroup, "index" | "slot" | "size">[],
        );

        groups.forEach((group, index) => {
            for (let slide = group.start; slide < group.end; slide++) {
                memberships[slide]?.push({ index, slot: slide - group.start, size: group.end - group.start });
            }
        });

        return memberships;
    };

    /**
     * Where a position is counted in groups rather than slides: `2` while the third group rests, `2.5` halfway from it
     * to the fourth, however many slides apart the two rest.
     *
     * Between two groups it runs evenly from one to the other; on a looping carousel the last group runs on to the
     * first. Past either end of one that stops, it carries on at the rate of the nearest two groups, or a group a
     * slide while there is only one. Where groups nest, so that one rests before the group listed ahead of it, there
     * is no even run between them and the position counts as the nearest group.
     *
     * @param position Where the carousel is, in slides.
     * @param rests Where each group rests, from {@link getGroupRest}, in order.
     * @param count How many slides there are.
     * @param isLooping Whether the carousel loops.
     * @returns A position counted in groups from the first, fractional between two of them; `0` with no groups.
     */
    export const toGroupCoordinate = (
        position: number,
        rests: readonly number[],
        count: number,
        isLooping: boolean,
    ) => {
        const last = rests.length - 1;

        if (last < 0) return 0;

        const ends = isLooping ? [...rests, rests[0] + count] : rests;
        const at = isLooping && count > 0 ? rests[0] + MathUtils.wrap(position - rests[0], count) : position;

        for (let group = 0; group < ends.length - 1; group++) {
            const gap = ends[group + 1] - ends[group];

            if (gap > 0 && at >= ends[group] && at <= ends[group + 1]) return group + (at - ends[group]) / gap;
        }

        if (!isLooping && (at < rests[0] || at > rests[last])) {
            const isBefore = at < rests[0];
            const gap = isBefore
                ? (rests[1] ?? rests[0] + 1) - rests[0]
                : rests[last] - (rests[last - 1] ?? rests[last] - 1);
            const from = isBefore ? 0 : last;

            if (gap > 0) return from + (at - rests[from]) / gap;
        }

        return getNearestGroup(position, rests, count, isLooping);
    };

    /**
     * The group a placement rule is handed for one slide: which group it is drawn in, how far that group is from where
     * the carousel is, and the slide's slot in it.
     *
     * A slide held by one group is drawn in it. One held by several is drawn in the group nearest where the carousel
     * is, and while the carousel is between two of them it moves from its slot in one to its slot in the other as the
     * carousel does, so it never jumps: its distance, slot and size are each that far from one to the other, and it
     * counts as the nearer of the two. At rest on a group that holds it, that group is the one. A slide no group holds
     * is drawn alone, at the distance in groups of where it would rest.
     *
     * @param defs.place The slide's place round the ring, from `0` to `count × copies - 1`.
     * @param defs.groupPosition Where the carousel is round the ring, in groups, from {@link toGroupCoordinate}.
     * @param defs.memberships Which groups hold each real slide, from {@link getGroupMemberships}.
     * @param defs.rests Where each group round the ring rests, in slides, for a slide no group holds.
     * @param defs.count How many real slides there are.
     * @param defs.groupCount How many real groups there are.
     * @param defs.copies How many times the list is drawn, from {@link getCopyCount}.
     * @param defs.isLooping Whether the carousel loops.
     */
    export const getPlacementGroup = (defs: {
        place: number;
        groupPosition: number;
        memberships: readonly (readonly Pick<CarouselPlacementGroup, "index" | "slot" | "size">[])[];
        rests: readonly number[];
        count: number;
        groupCount: number;
        copies: number;
        isLooping: boolean;
    }): CarouselPlacementGroup => {
        const ringGroupCount = defs.groupCount * defs.copies;
        const copy = defs.count > 0 ? Math.floor(defs.place / defs.count) : 0;
        const held = defs.memberships[defs.count > 0 ? defs.place % defs.count : 0] ?? [];
        const toDistance = (index: number) => getDistance(index, defs.groupPosition, ringGroupCount, defs.isLooping);

        if (held.length < 1) {
            const coordinate = toGroupCoordinate(defs.place, defs.rests, defs.count * defs.copies, defs.isLooping);

            return {
                distance: toDistance(coordinate),
                index: Math.round(coordinate),
                count: ringGroupCount,
                slot: 0,
                size: 1,
            };
        }

        const placed = held.map((membership) => {
            const index = membership.index + copy * defs.groupCount;

            return { ...membership, index, count: ringGroupCount, distance: toDistance(index) };
        });

        let before: CarouselPlacementGroup | undefined;
        let after: CarouselPlacementGroup | undefined;
        let nearest = placed[0];

        for (const group of placed) {
            if (group.distance <= 0 && (before === undefined || group.distance > before.distance)) before = group;
            if (group.distance >= 0 && (after === undefined || group.distance < after.distance)) after = group;
            if (Math.abs(group.distance) < Math.abs(nearest.distance)) nearest = group;
        }

        if (before === undefined || after === undefined || before.distance === after.distance) return nearest;

        const ratio = -before.distance / (after.distance - before.distance);

        return {
            distance: 0,
            index: ratio < HALF ? before.index : after.index,
            count: ringGroupCount,
            slot: MathUtils.lerp(before.slot, after.slot, ratio),
            size: MathUtils.lerp(before.size, after.size, ratio),
        };
    };

    /**
     * Moves a position from one place to another over a time, on every animation frame, easing in and out.
     *
     * @param defs.from Where to start.
     * @param defs.to Where to end.
     * @param defs.durationMs How long the move takes. `0` or less lands at once.
     * @param defs.onFrame Called with the position on each frame, and with `to` at the end.
     * @param defs.onEnd Called once the move has arrived.
     * @returns Stops the move where it is.
     */
    export const glide = (defs: {
        from: number;
        to: number;
        durationMs: number;
        onFrame: (position: number) => void;
        onEnd?: () => void;
    }) => {
        let frameId: number | undefined;

        if (defs.durationMs <= 0 || defs.from === defs.to) {
            defs.onFrame(defs.to);
            defs.onEnd?.();

            return () => undefined;
        }

        const startMs = performance.now();

        const advance = () => {
            const ratio = MathUtils.clamp01((performance.now() - startMs) / defs.durationMs);

            frameId = undefined;
            defs.onFrame(MathUtils.lerp(defs.from, defs.to, EasingUtils.ease(ratio)));

            if (ratio >= 1) {
                defs.onEnd?.();

                return;
            }

            frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        return () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
        };
    };

    /**
     * The CSS that puts one slide where its placement says.
     *
     * @param placement What the carousel's placement rule answered for the slide.
     * @param distance The slide's distance, which decides its layer when the placement names none.
     * @returns `transform`, `filter`, `transform-origin` and `z-index`, as dashed CSS properties.
     */
    export const toSlideStyle = (placement: CarouselPlacement, distance: number) => {
        const { transform, filter } = CSSUtils.toAnimationStyle(placement.effect);
        const origin = placement.origin ?? CENTER;

        return {
            "transform": transform || "none",
            "filter": filter || "none",
            "transform-origin": `${origin.x * PERCENT}% ${origin.y * PERCENT}%`,
            "z-index": `${Math.round((placement.layer ?? -Math.abs(distance)) * LAYER_RESOLUTION)}`,
        };
    };

    /**
     * What a slide turns over about, from its placement or else from the way the carousel runs.
     *
     * @param placement What the carousel's placement rule answered for the slide.
     * @param orientation Which way the carousel runs.
     */
    export const getTurnAxis = (placement: CarouselPlacement, orientation: CarouselOrientation): CarouselAxis =>
        placement.axis ?? (orientation === "horizontal" ? "row" : "column");

    /**
     * The transform that turns a slide's back to face the other way, so it shows once the slide has turned over.
     *
     * @param axis What the slide turns over about, from {@link getTurnAxis}.
     */
    export const getBackTransform = (axis: CarouselAxis) =>
        `rotate${axis === "row" ? "Y" : "X"}(${TURNED_OVER_DEGREES}deg)`;

    /**
     * Which slide a press landed on, among the ones drawn beside the slide showing.
     *
     * Slides overlap — a placement that fans or stacks them leaves most of each one under its neighbor — so the
     * topmost box under the press is often not the slide being aimed at. Of every slide whose drawn box holds the
     * point, the one whose middle is nearest wins, which is the one most of the press fell on.
     *
     * @param rects Each slide's drawn box, by index, as the browser reports it after the transform — the box of what
     * the slide draws rather than of the whole carousel it fills; `undefined` for a slide not to be picked.
     * @param point Where the press landed, in the same coordinates.
     * @returns The slide's index, or `undefined` when the press missed every one.
     */
    export const computeHitIndex = (rects: readonly (DOMRect | undefined)[], point: Point2d) => {
        let best: number | undefined;
        let bestDistance = Infinity;

        rects.forEach((rect, index) => {
            if (!rect) return;
            if (point.x < rect.left || point.x > rect.right || point.y < rect.top || point.y > rect.bottom) return;

            const distance = Math.hypot(
                point.x - (rect.left + rect.width * HALF),
                point.y - (rect.top + rect.height * HALF),
            );

            if (distance < bestDistance) {
                best = index;
                bestDistance = distance;
            }
        });

        return best;
    };
}
