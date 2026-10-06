import {
    type BracketConnectorPathFn,
    BracketConnectorPaths,
    type BracketNode,
    type BracketOrientation,
    type BracketStep,
} from "@thewaver/ss-components";

import { CONTROL_GLYPHS } from "../../StyledComponents/ControlButtonContent/ControlButtonContent.const";

export const NOTHING_PICKED = "nothing picked yet";

export const describeFamily = (rootValue: string, anchorValue: string | undefined) =>
    anchorValue === undefined
        ? `the top — ${rootValue} and what feeds it`
        : `what feeds ${anchorValue}, and what feeds those`;

export const seed = (value: string): BracketNode<string> => ({ value });

export const branch = (value: string, ...children: BracketNode<string>[]): BracketNode<string> => ({
    value,
    children,
});

export const computeFamilySteps = (
    orientation: BracketOrientation,
): { step: BracketStep; label: string; glyph: string }[] => [
    { step: "toLeaves", label: "Previous stage", glyph: CONTROL_GLYPHS.previous },
    { step: "toRoot", label: "Next stage", glyph: CONTROL_GLYPHS.next },
    {
        step: "previous",
        label: orientation === "horizontal" ? "Upper" : "Left",
        glyph: orientation === "horizontal" ? CONTROL_GLYPHS.up : CONTROL_GLYPHS.left,
    },
    {
        step: "next",
        label: orientation === "horizontal" ? "Lower" : "Right",
        glyph: orientation === "horizontal" ? CONTROL_GLYPHS.down : CONTROL_GLYPHS.right,
    },
];

export const BEAM_PATHS: Record<string, BracketConnectorPathFn> = {
    flat: BracketConnectorPaths.elbow,
    rounded: BracketConnectorPaths.roundedElbow,
    curved: BracketConnectorPaths.curve,
    ball_and_arrow: BracketConnectorPaths.roundedElbow,
};

const ID_SEPARATOR = ".";

const getDepth = (id: string) => id.split(ID_SEPARATOR).length;

export const toConnectorBoard = (defs: { id: string; parentId: string; childId: string }) =>
    defs.id.slice(0, defs.id.length - `-${defs.parentId}-${defs.childId}`.length);

export const computeRouteSpan = (
    lengths: Record<string, { board: string; childId: string; lengthPx: number }>,
    board: string,
    childId: string,
) => {
    const onBoard = Object.values(lengths).filter((entry) => entry.board === board);

    return {
        startPx: onBoard
            .filter((entry) => getDepth(entry.childId) > getDepth(childId))
            .reduce((sum, entry) => sum + entry.lengthPx, 0),
        totalPx: onBoard.reduce((sum, entry) => sum + entry.lengthPx, 0),
    };
};
