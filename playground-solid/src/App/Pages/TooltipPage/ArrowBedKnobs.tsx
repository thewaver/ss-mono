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
        <PageProp key={`${access(props.keyPrefix)}Arrow`} {...TooltipKnobs.ARROW_TEXT}>
            <PageSelectField
                value={props.arrow[0]}
                values={ARROW_BED_ARROWS}
                computeLabel={(arrow) => TOOLTIP_ARROW_LABELS[arrow]}
                width={FIELD_WIDTH}
                ariaLabel={"Arrow"}
                onChange={(arrow) => props.arrow[1](() => arrow)}
            />
        </PageProp>

        <PageProp key={`${access(props.keyPrefix)}Width`} {...TooltipKnobs.ARROW_WIDTH_PX_TEXT}>
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

        <PageProp key={`${access(props.keyPrefix)}Length`} {...TooltipKnobs.ARROW_LENGTH_PX_TEXT}>
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

        <PageProp key={`${access(props.keyPrefix)}Shape`} {...TooltipKnobs.SHAPE_TEXT}>
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
