import { globalStyle, style } from "@vanilla-extract/css";

export const patchBoardRoot = style({
    display: "block",
    position: "relative",
    pointerEvents: "all",
});

export const patchBoardCables = style({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "visible",
    pointerEvents: "none",
});

export const patchBoardSlot = style({
    position: "absolute",
    pointerEvents: "none",
});

export const patchBoardNodeHolder = style({
    position: "absolute",
    inset: 0,
    pointerEvents: "all",
});

globalStyle(`${patchBoardNodeHolder} > *`, {
    width: "100%",
    height: "100%",
});

export const patchBoardNode = style({
    display: "flex",
    flex: "1 1 auto",
    minWidth: 0,
    position: "relative",
    touchAction: "none",
    pointerEvents: "all",
});

export const patchBoardSocketHolder = style({
    position: "absolute",
    transform: "translate(-50%, -50%)",
    pointerEvents: "all",
});

globalStyle(`${patchBoardSocketHolder} > *`, {
    width: "100%",
    height: "100%",
});

export const patchBoardSocket = style({
    display: "flex",
    flex: "1 1 auto",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minWidth: 0,
    touchAction: "none",
    pointerEvents: "all",
});
