import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import type { StepperConnectorDefs } from "./Stepper.types";

/** What the library prints when a stepper is handed both a layout and a body painter. */
const IGNORED_BODY_WARNING =
    "Stepper: renderBody is ignored when computeLayout is given. A body is a panel beside a straight connector and a laid-out stepper has nowhere to put one — drop one of them.";

/** The part of a stepper that is not about drawing it: what a connector is told, and which props cannot be combined. */
export namespace StepperUtils {
    /**
     * Warns, in the console, that a stepper's body painter is being ignored.
     *
     * Call it once per stepper, when it is set up. It says nothing unless both a layout and a body painter were given,
     * since a laid-out stepper has no straight connector for a body to sit beside and so draws none.
     *
     * @param hasLayout Whether the stepper was given `computeLayout`.
     * @param hasBody Whether it was given `renderBody`.
     */
    export const warnIfBodyIgnored = (hasLayout: boolean, hasBody: boolean) => {
        if (hasLayout && hasBody) console.warn(IGNORED_BODY_WARNING);
    };

    /**
     * What the connector leaving one step is told about the run it has to draw.
     *
     * A straight run needs only its index. A laid-out one is handed the placements of the step it leaves and the
     * step it reaches, and the layout's center and radii, so it can follow the curve the steps sit on rather than cut
     * across it.
     *
     * @param index The step the connector leaves, counting from zero.
     * @param layout The layout the steps were placed by, if any.
     * @returns The connector's defs. Without a layout only `index` is set.
     */
    export const computeConnectorDefs = (index: number, layout: PlacementLayout | undefined): StepperConnectorDefs => ({
        index,
        from: layout?.placements[index],
        to: layout?.placements[index + 1],
        origin: layout?.origin,
        radii: layout?.radii,
    });
}
