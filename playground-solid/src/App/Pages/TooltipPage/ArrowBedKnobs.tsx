import { access } from "@thewaver/ss-components-solid";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import {
    ARROW_BED_ARROWS,
    ARROW_BED_SHAPES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import { TOOLTIP_ARROW_LABELS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import type { ArrowBedKnobsProps } from "./TooltipPageSolid.types";

type Props = ArrowBedKnobsProps;

export const ArrowBedKnobs = (props: Props) => (
    <>
        <PageProp
            key={`${access(props.keyPrefix)}Arrow`}
            label={"Arrow"}
            hint={"Which arrow every tooltip here grows."}
            controls={"Picks the template handed to ShapeUtils.attachArrow"}
        >
            <PageSelectField
                value={props.arrow[0]}
                values={ARROW_BED_ARROWS}
                computeLabel={(arrow) => TOOLTIP_ARROW_LABELS[arrow]}
                width={FIELD_WIDTH}
                ariaLabel={"Arrow"}
                onChange={(arrow) => props.arrow[1](() => arrow)}
            />
        </PageProp>

        <PageProp
            key={`${access(props.keyPrefix)}Width`}
            label={"Arrow width (px)"}
            hint={
                "How wide every arrow is across its base. Past twice the length, a corner arrow's sides lean 45° or more."
            }
            controls={"Sets the arrow width handed to the template"}
        >
            <PageNumberField
                value={props.arrowWidth[0]}
                min={TooltipKnobs.MIN_ARROW_SIZE}
                max={TooltipKnobs.MAX_ARROW_SIZE}
                step={TooltipKnobs.ARROW_SIZE_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Arrow width"}
                onInput={props.arrowWidth[1]}
            />
        </PageProp>

        <PageProp
            key={`${access(props.keyPrefix)}Length`}
            label={"Arrow length (px)"}
            hint={"How far every arrow's tip stands off its tooltip."}
            controls={"Sets the arrow length handed to the template"}
        >
            <PageNumberField
                value={props.arrowLength[0]}
                min={TooltipKnobs.MIN_ARROW_SIZE}
                max={TooltipKnobs.MAX_ARROW_SIZE}
                step={TooltipKnobs.ARROW_SIZE_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Arrow length"}
                onInput={props.arrowLength[1]}
            />
        </PageProp>

        <PageProp
            key={`${access(props.keyPrefix)}Shape`}
            label={"Shape"}
            hint={
                "The contour every tooltip here is cut to, which is what each arrow's base is walked along from where it attaches."
            }
            controls={"Picks the contour handed to ShapeUtils.attachArrow"}
        >
            <PageSelectField
                value={props.shape[0]}
                values={ARROW_BED_SHAPES}
                width={FIELD_WIDTH}
                ariaLabel={"Shape"}
                onChange={(shape) => props.shape[1](() => shape)}
            />
        </PageProp>
    </>
);
