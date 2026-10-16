import type { TubeLayoutDefs, WallsLayoutDefs } from "@thewaver/ss-components";

import type { Knobs } from "../PageComponents/Knobs/KnobDefs.types";

export namespace CorridorLayoutKnobs {
    export const WALLS_KNOBS: Knobs<WallsLayoutDefs> = {
        nearAngleDegrees: {
            kind: "number",
            label: "Near angle (°)",
            hint: "How far the items level with the viewer turn away from facing it. 90 lays them flat against their wall, like a maze seen from inside; lower turns them towards the viewer, and the items close up into two angled stacks.",
            min: 10,
            max: 90,
            step: 5,
        },
        farAngleDegrees: {
            kind: "number",
            label: "Far angle (°)",
            hint: "How far the items at the end of what is drawn turn away from facing the viewer. The angle turns evenly from the near one to this, and the spacing follows it, so items still meet edge to edge.",
            min: 10,
            max: 90,
            step: 5,
        },
        visibleCards: {
            kind: "number",
            label: "Cards drawn",
            hint: "How many card lengths each wall runs from the nearest to the farthest before items fade, empty slots included. It is the depth of the corridor, whatever the item count.",
            min: 1,
            max: 40,
            step: 1,
        },
        farWidthRatio: {
            kind: "number",
            label: "Far width",
            hint: "How wide the corridor looks at its far end, as a share of the box width. Level with the viewer the walls always stand at the box edges: 1 keeps them there all the way down, 0 brings them together.",
            min: 0,
            max: 1,
            step: 0.05,
        },
        minSkipCount: {
            kind: "number",
            label: "Min skip",
            hint: "The fewest slots left empty after an item. Each gap is drawn between this and the max, the same for an item every time it comes round.",
            min: 0,
            max: 6,
            step: 1,
        },
        maxSkipCount: {
            kind: "number",
            label: "Max skip",
            hint: "The most slots left empty after an item. The slots take turns left and right, so a gap of 1 keeps the next item on the same wall.",
            min: 0,
            max: 6,
            step: 1,
        },
        heightRatio: {
            kind: "number",
            label: "Item height",
            hint: "How tall an item is, as a share of the box height.",
            min: 0.1,
            max: 1,
            step: 0.05,
        },
        aspectRatio: {
            kind: "number",
            label: "Item aspect",
            hint: "An item's width over its height. Below 1 is portrait, above 1 landscape.",
            min: 0.3,
            max: 2.5,
            step: 0.05,
        },
        perspectivePx: {
            kind: "number",
            label: "Perspective (px)",
            hint: "How far away the viewer sits. Lower is a wider angle, with the corridor rushing off to its far end; higher flattens it.",
            min: 200,
            max: 3000,
            step: 50,
        },
        viewDistance: {
            kind: "number",
            label: "View distance",
            hint: "How many slots down the corridor a room is brought when it is tabbed to from out of view.",
            min: 0,
            max: 10,
            step: 0.5,
        },
    };

    export const TUBE_KNOBS: Knobs<TubeLayoutDefs> = {
        sides: {
            kind: "number",
            label: "Sides",
            hint: "How many flat sides the tube has, which is how many items one ring holds with nothing skipped.",
            min: 3,
            max: 24,
            step: 1,
        },
        visibleRings: {
            kind: "number",
            label: "Rings drawn",
            hint: "How many rings stay drawn before they fade at the far end. More rings means more items on the page.",
            min: 1,
            max: 20,
            step: 1,
        },
        farWidthRatio: {
            kind: "number",
            label: "Far width",
            hint: "How wide the hole at the far end looks, as a share of the tube's near width. 1 keeps the tube the same width all the way down, 0 closes it to a point.",
            min: 0,
            max: 1,
            step: 0.05,
        },
        minSkipCount: {
            kind: "number",
            label: "Min skip",
            hint: "The fewest sides left empty after an item. Each gap is drawn between this and the max, the same for an item every time it comes round.",
            min: 0,
            max: 11,
            step: 1,
        },
        maxSkipCount: {
            kind: "number",
            label: "Max skip",
            hint: "The most sides left empty after an item. The gaps carry on round into the next ring.",
            min: 0,
            max: 11,
            step: 1,
        },
        radiusRatio: {
            kind: "number",
            label: "Radius",
            hint: "How far the tube's sides stand from its axis level with the viewer, as a share of half the box's longer side.",
            min: 0.2,
            max: 2,
            step: 0.05,
        },
        depthRatio: {
            kind: "number",
            label: "Item length",
            hint: "How long each item runs down the tube, as a share of its width level with the viewer.",
            min: 0.2,
            max: 3,
            step: 0.05,
        },
        tiltDegrees: {
            kind: "number",
            label: "Lean (°)",
            hint: "How far each item leans back from facing the viewer. 90 lies along the tube's side; lower stands it up towards the viewer.",
            min: 0,
            max: 180,
            step: 5,
        },
        twistDegrees: {
            kind: "number",
            label: "Twist (°)",
            hint: "How far each ring turns round from the one behind it, which bends the rings into a corkscrew that turns as the corridor moves.",
            min: -90,
            max: 90,
            step: 1,
        },
        perspectivePx: {
            kind: "number",
            label: "Perspective (px)",
            hint: "How far away the viewer sits. Lower is a wider angle; higher flattens the tube.",
            min: 200,
            max: 3000,
            step: 50,
        },
        viewRings: {
            kind: "number",
            label: "View rings",
            hint: "How many rings down the tube a room is brought when it is tabbed to from out of view.",
            min: 0,
            max: 10,
            step: 0.5,
        },
    };

    export const KNOBS_BY_FAMILY = {
        tube: TUBE_KNOBS,
        walls: WALLS_KNOBS,
    };

    export const MIN_SPIN_DEGREES_PER_SECOND = -180;
    export const MAX_SPIN_DEGREES_PER_SECOND = 180;
    export const SPIN_STEP_DEGREES_PER_SECOND = 5;
    export const STARTING_SPIN_DEGREES_PER_SECOND = 0;
}
