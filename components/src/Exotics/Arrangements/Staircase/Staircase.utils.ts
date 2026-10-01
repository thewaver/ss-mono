import type { StaircaseDir, StaircaseStepDefs } from "./Staircase.types";

/** One step, for turning a count into the last index. */
const SINGLE = 1;
/** The smallest indent a step can have. */
const NO_INDENT = 0;

/**
 * Works out where each step of a staircase sits and how far it is set in.
 *
 * The indent function is only ever asked about a staircase that runs downwards. One that runs upwards is the same
 * staircase with its steps handed over back to front, so a consumer writes one function and gets both directions.
 */
export namespace StaircaseUtils {
    /**
     * What a step's indent function is told about it.
     *
     * @param index Where the step is shown, counting from the top.
     * @param stepCount How many steps there are.
     * @param dir Which way the staircase runs.
     * @param indent How far one step is set in from the one before it.
     * @returns The step's place in the run as the indent function reads it — its own index running down, and the index
     * counted from the bottom running up — with the count and the indent passed through.
     */
    export const computeStepDefs = (
        index: number,
        stepCount: number,
        dir: StaircaseDir,
        indent: number,
    ): StaircaseStepDefs => ({
        index: dir === "down" ? index : stepCount - SINGLE - index,
        stepCount,
        indent,
    });

    /**
     * The indent a staircase uses when the consumer gives none: one `indent` per step.
     *
     * @param defs What {@link computeStepDefs} answered for the step.
     */
    export const computeDefaultStepIndent = (defs: StaircaseStepDefs) => defs.index * defs.indent;

    /**
     * How far a step is set in on each side.
     *
     * @param defs What {@link computeStepDefs} answered for the step.
     * @param computeStepIndent The consumer's indent function, or `undefined` for {@link computeDefaultStepIndent}.
     * @returns The function's answer, with anything below nought read as nought, since a step cannot stick out
     * past the staircase.
     */
    export const computeStepIndent = (
        defs: StaircaseStepDefs,
        computeStepIndent: ((defs: StaircaseStepDefs) => number) | undefined,
    ) => Math.max(NO_INDENT, (computeStepIndent ?? computeDefaultStepIndent)(defs));
}
