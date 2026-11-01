import type { fpsCounterVariants } from "./StressTest.css";

const CLOSE_ENOUGH_RATIO = 0.99;

export namespace StressTestUtils {
    export const getGrade = (fps: number): keyof typeof fpsCounterVariants => {
        if (fps >= CLOSE_ENOUGH_RATIO * 720) return "incredible";
        if (fps >= CLOSE_ENOUGH_RATIO * 240) return "superb";
        if (fps >= CLOSE_ENOUGH_RATIO * 120) return "great";
        if (fps >= CLOSE_ENOUGH_RATIO * 60) return "good";
        if (fps >= CLOSE_ENOUGH_RATIO * 30) return "mid";
        if (fps >= CLOSE_ENOUGH_RATIO * 1) return "bad";
        return "slideshow";
    };
}
