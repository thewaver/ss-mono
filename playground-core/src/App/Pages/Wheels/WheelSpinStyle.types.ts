import type { RotatorSpinDefs } from "@thewaver/ss-components";

export type WheelSpinStyleFn = (index: number, wedgeCount: number, turns: number) => RotatorSpinDefs;

export type WheelSpinStyleKey = "rigid" | "bouncy";
