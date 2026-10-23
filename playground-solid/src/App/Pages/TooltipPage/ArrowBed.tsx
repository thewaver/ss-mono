import { createSignal } from "solid-js";

import { Shape } from "@thewaver/ss-components-solid";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import {
    ARROW_BED_ARROWS,
    ARROW_BED_SHAPES,
    type ArrowBedShape,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { computeArrowBedPoints } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.utils";
import {
    TOOLTIP_ARROW_LABELS,
    TOOLTIP_ARROW_TEMPLATES,
    type TooltipArrow,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import * as tooltipStyles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { type ShapeArrowAim, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";

const SHARP_RADII = [0];

const ROUNDED_RADII = [BORDER_RADIUS_FULL];

export const createArrowBed = () => {
    const [getArrow, setArrow] = createSignal<Exclude<TooltipArrow, "none">>(TooltipKnobs.STARTING_ARROW_BED_ARROW);
    const [getArrowWidth, setArrowWidth] = createSignal(TooltipKnobs.STARTING_ARROW_WIDTH);
    const [getArrowLength, setArrowLength] = createSignal(TooltipKnobs.STARTING_ARROW_LENGTH);
    const [getShape, setShape] = createSignal<ArrowBedShape>(TooltipKnobs.STARTING_ARROW_BED_SHAPE);

    const renderTooltip = (computeAim: (size: Size2d) => ShapeArrowAim | undefined, getLabel: () => string) => (
        <div class={tooltipStyles.tooltipShadow}>
            <Shape
                computePoints={(size) =>
                    ShapeUtils.attachArrow(
                        {
                            points: computeArrowBedPoints(getShape(), size),
                            joinRadii: getShape() === "rounded_box" ? ROUNDED_RADII : SHARP_RADII,
                        },
                        computeAim(size),
                        TOOLTIP_ARROW_TEMPLATES[getArrow()](getArrowWidth(), getArrowLength()),
                    )
                }
                computeFillDefs={() => [{ color: themeVars.color.surface.dark }]}
                renderChildren={() => <div class={styles.arrowBedLabel}>{getLabel()}</div>}
            />
        </div>
    );

    const renderKnobs = () => (
        <>
            <PageProp
                key={"arrowBedArrow"}
                label={"Arrow"}
                hint={"Which arrow every tooltip here grows."}
                controls={"Picks the template handed to ShapeUtils.attachArrow"}
            >
                <PageSelectField
                    value={getArrow}
                    values={ARROW_BED_ARROWS}
                    computeLabel={(arrow) => TOOLTIP_ARROW_LABELS[arrow]}
                    width={FIELD_WIDTH}
                    ariaLabel={"Arrow"}
                    onChange={(arrow) => setArrow(() => arrow)}
                />
            </PageProp>

            <PageProp
                key={"arrowBedWidth"}
                label={"Arrow width (px)"}
                hint={
                    "How wide every arrow is across its base. Past twice the length, a corner arrow's sides lean 45° or more."
                }
                controls={"Sets the arrow width handed to the template"}
            >
                <PageNumberField
                    value={getArrowWidth}
                    min={TooltipKnobs.MIN_ARROW_SIZE}
                    max={TooltipKnobs.MAX_ARROW_SIZE}
                    step={TooltipKnobs.ARROW_SIZE_STEP}
                    width={FIELD_WIDTH}
                    ariaLabel={"Arrow width"}
                    onInput={setArrowWidth}
                />
            </PageProp>

            <PageProp
                key={"arrowBedLength"}
                label={"Arrow length (px)"}
                hint={"How far every arrow's tip stands off its tooltip."}
                controls={"Sets the arrow length handed to the template"}
            >
                <PageNumberField
                    value={getArrowLength}
                    min={TooltipKnobs.MIN_ARROW_SIZE}
                    max={TooltipKnobs.MAX_ARROW_SIZE}
                    step={TooltipKnobs.ARROW_SIZE_STEP}
                    width={FIELD_WIDTH}
                    ariaLabel={"Arrow length"}
                    onInput={setArrowLength}
                />
            </PageProp>

            <PageProp
                key={"arrowBedShape"}
                label={"Shape"}
                hint={
                    "The contour every tooltip here is cut to, which is what each arrow's base is walked along from where it attaches."
                }
                controls={"Picks the contour handed to ShapeUtils.attachArrow"}
            >
                <PageSelectField
                    value={getShape}
                    values={ARROW_BED_SHAPES}
                    width={FIELD_WIDTH}
                    ariaLabel={"Shape"}
                    onChange={(shape) => setShape(() => shape)}
                />
            </PageProp>
        </>
    );

    return { renderTooltip, renderKnobs };
};
