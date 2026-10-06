import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";

import type { AnchorPlacement, SelectOption, Toast } from "@thewaver/ss-components-react";
import { Button, Range, Select, Toasts, ViewportWrapper, useViewportContext } from "@thewaver/ss-components-react";
import { ViewportWrapperKnobs } from "@thewaver/ss-playground/App/Knobs/ViewportWrappers.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ViewportWrapperPage/ViewportWrapperPage.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import { PageVariants } from "../../PageComponents/Variants/Variants";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { renderPageHighlightFloater } from "../../StyledComponents/GlideFloater/GlideFloater";
import { PagePopoverSurface } from "../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageRangeContent } from "../../StyledComponents/RangeContent/RangeContent";
import { PageSelectContent } from "../../StyledComponents/SelectContent/SelectContent";
import { PageSelectOptionContent } from "../../StyledComponents/SelectOptionContent/SelectOptionContent";
import { PageToastContent } from "../../StyledComponents/ToastContent/ToastContent";
import type { ToastDefs } from "../../StyledComponents/ToastContent/ToastContent.types";
import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";

const COUNTRIES: SelectOption<string>[] = [
    { value: "Belgium" },
    { value: "Denmark" },
    { value: "Estonia" },
    { value: "Finland" },
    { value: "Germany" },
    { value: "Iceland" },
    { value: "Ireland" },
    { value: "Latvia" },
    { value: "Norway" },
    { value: "Poland" },
    { value: "Portugal" },
    { value: "Sweden" },
];

const PERCENT = 100;

const SCROLL_SIZE = { width: styles.HOST_SIZE, height: styles.HOST_SIZE };
const INNER_TOAST_GAP = 10;
const INNER_TOAST_MARGIN = 10;
const INNER_TOAST_MESSAGE = "Raised inside the square.";

const renderTooltip = (text: string) => ({
    placement: { x: "center", y: "top-out" } as const,
    offset: { x: 0, y: 10 },
    renderContent: (visibilityTarget: 0 | 1, transitionDurationMs: number) => (
        <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
            {text}
        </PageTooltipContent>
    ),
});

const renderCountryPopup = (
    renderOptions: () => ReactNode,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
) => (
    <PagePopoverSurface
        visibilityTarget={visibilityTarget}
        transitionDurationMs={transitionDurationMs}
        placement={placement}
    >
        {renderOptions()}
    </PagePopoverSurface>
);

const ViewportReadout = () => {
    const context = useViewportContext();

    return (
        <div className={[styles.readout, styles.cornerReadout].join(" ")} data-inner-readout="">
            {`${context.getScale().toFixed(2)}× of ${Math.round(context.getSize().width)}×${Math.round(context.getSize().height)}`}
        </div>
    );
};

export const ViewportWrapperPage = () => {
    const [roamerX, setRoamerX] = useState(ViewportWrapperKnobs.STARTING_ROAMER_X);
    const [roamerY, setRoamerY] = useState(ViewportWrapperKnobs.STARTING_ROAMER_Y);
    const [scalePercent, setScalePercent] = useState(PERCENT);
    const [roamingValue, setRoamingValue] = useState<string | undefined>();
    const innerToasts = useState<Toast<ToastDefs>[]>([]);
    const [scrolledValue, setScrolledValue] = useState<string | undefined>();

    const stageSize = useMemo(() => {
        const side = Math.round((styles.HOST_SIZE * PERCENT) / scalePercent);

        return { width: side, height: side };
    }, [scalePercent]);

    const toastCountRef = useRef(0);

    return (
        <PageVariants
            minColumnWidth={styles.MIN_COLUMN_WIDTH}
            items={[
                {
                    key: "roaming",
                    name: "A control roaming the viewport",
                    component: () => (
                        <div className={styles.sectionBody}>
                            <div>
                                The dashed square is a viewport of its own, so it is the boundary that counts. Park the
                                control against any edge of it: its tooltip and its list turn around rather than cross
                                that edge, keep the side of the control they are on, and are cut by the square when
                                there is not enough room. The scale slider changes the resolution the square is designed
                                for, so everything inside it grows or shrinks while the boundary stays where it is.
                            </div>

                            <div className={styles.controls}>
                                <div>Across</div>
                                <Range
                                    value={[roamerX, setRoamerX]}
                                    id={"roamerX"}
                                    ariaLabel={"Horizontal position"}
                                    thumbSize={RANGE_THUMB_SIZE}
                                    renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
                                />

                                <div>Down</div>
                                <Range
                                    value={[roamerY, setRoamerY]}
                                    id={"roamerY"}
                                    ariaLabel={"Vertical position"}
                                    thumbSize={RANGE_THUMB_SIZE}
                                    renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
                                />

                                <div>Scale</div>
                                <Range
                                    value={[scalePercent, setScalePercent]}
                                    id={"viewportScale"}
                                    ariaLabel={"Viewport scale"}
                                    min={ViewportWrapperKnobs.SCALE_MIN}
                                    max={ViewportWrapperKnobs.SCALE_MAX}
                                    step={ViewportWrapperKnobs.SCALE_STEP}
                                    thumbSize={RANGE_THUMB_SIZE}
                                    renderContent={(renderProps) => <PageRangeContent renderProps={renderProps} />}
                                />
                            </div>

                            <div className={styles.readout} data-readout="">
                                {`x: ${roamerX}% | y: ${roamerY}% | scale: ${scalePercent}% of ${styles.HOST_SIZE}px`}
                            </div>

                            <div className={styles.host} data-stage="">
                                <ViewportWrapper size={stageSize}>
                                    <div
                                        className={styles.roamer}
                                        style={{
                                            left: `${roamerX}%`,
                                            top: `${roamerY}%`,
                                            transform: `translate(-${roamerX}%, -${roamerY}%)`,
                                        }}
                                    >
                                        <Select
                                            renderHighlightFloater={renderPageHighlightFloater}
                                            value={[roamingValue, setRoamingValue]}
                                            options={COUNTRIES}
                                            id={"roamingCountry"}
                                            ariaLabel={"Roaming country"}
                                            tooltipDefs={renderTooltip("My tooltip has the same boundary I do.")}
                                            renderContent={(selectedOption, flags) => (
                                                <PageSelectContent flags={flags}>
                                                    {selectedOption?.value ?? "Pick one"}
                                                </PageSelectContent>
                                            )}
                                            renderOption={(option, flags) => (
                                                <PageSelectOptionContent isGliding flags={flags}>
                                                    {option.value}
                                                </PageSelectOptionContent>
                                            )}
                                            renderPopup={renderCountryPopup}
                                        />
                                    </div>

                                    <div className={styles.toastRaiser}>
                                        <Button
                                            id={"raiseInnerToast"}
                                            ariaLabel={"Notify inside the viewport"}
                                            renderContent={(flags) => (
                                                <PageButtonContent flags={flags}>Notify</PageButtonContent>
                                            )}
                                            onClick={() => {
                                                toastCountRef.current += 1;

                                                const id = `innerToast${toastCountRef.current}`;

                                                innerToasts[1]((prev) => [
                                                    ...prev,
                                                    { id, value: { kind: "info", message: INNER_TOAST_MESSAGE } },
                                                ]);
                                            }}
                                        />
                                    </div>

                                    <Toasts
                                        toasts={innerToasts}
                                        ariaLabel={"Viewport notifications"}
                                        alignment={"bottom-center"}
                                        margins={{
                                            marginTop: INNER_TOAST_MARGIN,
                                            marginRight: INNER_TOAST_MARGIN,
                                            marginBottom: INNER_TOAST_MARGIN,
                                            marginLeft: INNER_TOAST_MARGIN,
                                        }}
                                        renderToast={(toast, visibilityTarget, transitionDurationMs, state) => (
                                            <PageToastContent
                                                toast={toast}
                                                state={state}
                                                animation={"fade"}
                                                stacking={"flow"}
                                                dir={"column"}
                                                gap={INNER_TOAST_GAP}
                                                visibilityTarget={visibilityTarget}
                                                transitionDurationMs={transitionDurationMs}
                                                onDismiss={() => {
                                                    innerToasts[1]((prev) =>
                                                        prev.filter((candidate) => candidate.id !== toast.id),
                                                    );
                                                }}
                                            />
                                        )}
                                    />

                                    <ViewportReadout />
                                </ViewportWrapper>
                            </div>
                        </div>
                    ),
                },
                {
                    key: "scrolled",
                    name: "An anchor inside a scrolled box",
                    component: () => (
                        <div className={styles.sectionBody}>
                            <div>
                                A viewport of the same size with a scrolling area inside it. Scrolling moves the anchor
                                without moving the page, so an open list has to follow it, stay off it, and stop at the
                                square.
                            </div>

                            <div className={styles.host}>
                                <ViewportWrapper size={SCROLL_SIZE}>
                                    <div className={styles.scrollBox} data-scroll-box="">
                                        <div className={styles.scrollFiller} />

                                        <Select
                                            renderHighlightFloater={renderPageHighlightFloater}
                                            value={[scrolledValue, setScrolledValue]}
                                            options={COUNTRIES}
                                            id={"scrolledCountry"}
                                            ariaLabel={"Scrolled country"}
                                            renderContent={(selectedOption, flags) => (
                                                <PageSelectContent flags={flags}>
                                                    {selectedOption?.value ?? "Pick one"}
                                                </PageSelectContent>
                                            )}
                                            renderOption={(option, flags) => (
                                                <PageSelectOptionContent isGliding flags={flags}>
                                                    {option.value}
                                                </PageSelectOptionContent>
                                            )}
                                            renderPopup={renderCountryPopup}
                                        />

                                        <div className={styles.scrollFiller} />
                                    </div>
                                </ViewportWrapper>
                            </div>
                        </div>
                    ),
                },
            ]}
        />
    );
};
