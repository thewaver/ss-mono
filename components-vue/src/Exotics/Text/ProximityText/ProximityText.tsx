import {
    type CSSProperties,
    Fragment,
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    shallowRef,
} from "vue";

import {
    LetterDriverStyles,
    LetterDriverUtils,
    type LetterSegment,
    type LetterState,
    PROXIMITY_TEXT_DEFAULTS,
    ProximityTextStyles,
    ProximityTextUtils,
    ViewportUtils,
} from "@thewaver/ss-components";
import { type Rect, StringUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { provideLetterDriverContext } from "../../../Abstracts/LetterDriver/LetterDriver.context";
import { PointerTrackerVueUtils } from "../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps } from "../../../Utils/propUtils";
import { useStableList } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ProximityTextProps, ProximityTextSlots } from "./ProximityText.types";

const RESTING_STRENGTH = 0;
const NO_TIME = 0;
const CUSTOM_PROPERTY_PREFIX = "--";
const DATA_PREFIX = "data-";
const NO_BOX: Rect = { x: 0, y: 0, width: 0, height: 0 };

const toVueStyle = (style: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [
            key.startsWith(CUSTOM_PROPERTY_PREFIX) ? key : StringUtils.kebabToCamelCase(key),
            value,
        ]),
    ) as CSSProperties;

const toDataAttributes = (dataset: DOMStringMap) =>
    Object.fromEntries(
        Object.entries(dataset).map(([key, value]) => [`${DATA_PREFIX}${StringUtils.camelToKebabCase(key)}`, value]),
    );

export const ProximityText = defineComponent(
    (props: ProximityTextProps, { slots }: SlotsContext<ProximityTextSlots>) => {
        const viewportContext = useViewportContext();

        const rootRef = shallowRef<HTMLDivElement>();
        const containerRef = shallowRef<HTMLDivElement>();
        const restRef = shallowRef<HTMLDivElement>();
        const restBoxes = shallowRef<Rect[]>([]);

        const restLetterRefs: (HTMLElement | undefined)[] = [];

        const getComputeAnimationName = () =>
            props.computeAnimationName ?? PROXIMITY_TEXT_DEFAULTS.computeAnimationName;
        const getReachPx = () => props.reachPx ?? PROXIMITY_TEXT_DEFAULTS.reachPx;
        const getIsDisabled = () => props.isDisabled ?? false;

        const registry = LetterDriverUtils.createRegistry();
        const registryState = useStore(registry);
        const drivenCharacters = useStore(registry, (state) => state.characters);
        const drivenEntries = useStore(registry, (state) => state.entries);
        const getIsDriven = () => registryState.value.entries.length > 0;

        const layout = ProximityTextUtils.createLayout({
            getContainer: () => containerRef.value,
            getComputeAnimationName,
            getIsDriven,
        });

        const segments = useStore(layout, (state) => state.segments);
        const width = useStore(layout, (state) => state.width);

        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            rootRef,
            getIsDisabled,
            () => props.pointSource,
        );

        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const characters = useStableList(() =>
            getIsDriven() ? drivenCharacters.value : LetterDriverUtils.getCharacters(segments.value),
        );

        const animationNames = useStableList(() => {
            const computeAnimationName = getComputeAnimationName();

            return characters.value.map((character, index) =>
                computeAnimationName(character, index, characters.value.length),
            );
        });

        const drivenBoxes = computed(() => {
            const root = rootRef.value;

            void size.value;

            if (!root) return [];

            const rootRect = ViewportUtils.getAdjustedBoundingClientRect(root, viewportContext);

            return drivenEntries.value.flatMap((entry) => {
                const entryRect = ViewportUtils.getAdjustedBoundingClientRect(entry.element, viewportContext);
                const dx = entryRect.x - rootRect.x;
                const dy = entryRect.y - rootRect.y;

                return entry.boxes.map((box) => ({ ...box, x: box.x + dx, y: box.y + dy }));
            });
        });

        const strengths = computed(() =>
            ProximityTextUtils.computeStrengths(
                getIsDriven() ? drivenBoxes.value : restBoxes.value,
                ProximityTextUtils.toPoint(reading.value, isPointerPresent.value && !getIsDisabled(), size.value),
                getReachPx(),
            ),
        );

        const computeLetterAnimation = (index: number, isResting: boolean) =>
            ProximityTextUtils.toLetterAnimation(
                animationNames.value[index],
                isResting ? RESTING_STRENGTH : (strengths.value[index] ?? RESTING_STRENGTH),
            );

        const measureRest = () => {
            restBoxes.value = restLetterRefs.slice(0, characters.value.length).map((element) =>
                element
                    ? {
                          x: element.offsetLeft,
                          y: element.offsetTop,
                          width: element.offsetWidth,
                          height: element.offsetHeight,
                      }
                    : NO_BOX,
            );
        };

        watchAfterRender([restRef], ([rest]) => {
            if (!rest) return;

            const observer = new ResizeObserver(measureRest);

            observer.observe(rest);

            return () => observer.disconnect();
        });

        watchAfterRender([() => segments.value], () => measureRest());

        let previousNamed = { names: animationNames.value, characters: characters.value };

        watchAfterRender([() => animationNames.value], ([names]) => {
            const previous = previousNamed;

            previousNamed = { names, characters: characters.value };

            if (previous.names !== names && previous.characters === previousNamed.characters) layout.update(true);
        });

        const getLetterState = (index: number): LetterState => ({
            isHidden: false,
            animation: computeLetterAnimation(index, false),
        });

        provideLetterDriverContext({
            registry,
            getLetterState,
            getIsAnimating: () => true,
            getIsHidden: () => false,
            getComputePushingAnimationName: getComputeAnimationName,
        });

        watchAfterRender([], () => {
            const container = containerRef.value;

            return container ? layout.observe(container) : undefined;
        });

        return () => {
            const isDriven = getIsDriven();
            const lineWidth = `${width.value ?? 0}px`;

            const getLetterStyle = (index: number, isResting: boolean) =>
                toVueStyle(
                    LetterDriverUtils.computeAnimationStyle(
                        computeLetterAnimation(index, isResting),
                        LetterDriverStyles.letterDriverTimeVar,
                    ),
                );

            const setRestLetterRef = (index: number, isResting: boolean) => (element: unknown) => {
                if (isResting) restLetterRefs[index] = element instanceof HTMLElement ? element : undefined;
            };

            const renderSegment = (segment: LetterSegment, isResting: boolean): VNodeChild => {
                switch (segment.type) {
                    case "atomic":
                        return (
                            <span
                                ref={(node) => {
                                    setRestLetterRef(segment.startIndex, isResting)(node);

                                    if (
                                        !isResting &&
                                        node instanceof HTMLElement &&
                                        node.firstChild !== segment.element
                                    ) {
                                        node.replaceChildren(segment.element);
                                    }
                                }}
                                class={
                                    segment.isBlockLike
                                        ? ProximityTextStyles.proximityTextBlockLikeAtomic
                                        : ProximityTextStyles.proximityTextLetter
                                }
                                style={{
                                    ...getLetterStyle(segment.startIndex, isResting),
                                    ...(isResting
                                        ? { width: `${segment.width}px`, height: `${segment.height}px` }
                                        : {}),
                                }}
                            />
                        );
                    case "linebreak":
                        return (
                            <br
                                ref={(node) => {
                                    if (LetterDriverUtils.getIsAnimated(segment)) {
                                        setRestLetterRef(segment.startIndex, isResting)(node);
                                    }
                                }}
                            />
                        );
                    case "text": {
                        const style = toVueStyle({ ...segment.nonMetrics, ...segment.metrics });
                        const common = isResting
                            ? {}
                            : {
                                  title: segment.meta?.common.title,
                                  ...toDataAttributes(segment.meta?.common.dataset ?? {}),
                              };
                        const letters = Array.from(segment.text).map((character, offset) => (
                            <span
                                key={offset}
                                ref={setRestLetterRef(segment.startIndex + offset, isResting)}
                                class={ProximityTextStyles.proximityTextLetter}
                                style={getLetterStyle(segment.startIndex + offset, isResting)}
                            >
                                {character}
                            </span>
                        ));

                        return !isResting && segment.meta?.anchor ? (
                            <a style={style} {...common} {...segment.meta.anchor}>
                                {letters}
                            </a>
                        ) : (
                            <span style={style} {...common}>
                                {letters}
                            </span>
                        );
                    }
                }
            };

            return (
                <div
                    ref={rootRef}
                    class={ProximityTextStyles.proximityTextRoot}
                    style={assignInlineVars({
                        [LetterDriverStyles.letterDriverTimeVar]: LetterDriverUtils.getTimeValue(NO_TIME),
                    })}
                >
                    <div
                        ref={containerRef}
                        class={isDriven ? undefined : ProximityTextStyles.proximityTextChildrenWrap}
                        aria-hidden={isDriven ? undefined : "true"}
                        inert={!isDriven}
                    >
                        {slots.default?.()}
                    </div>

                    {!isDriven && segments.value.length > 0 && (
                        <>
                            <div class={ProximityTextStyles.proximityTextLines} style={{ width: lineWidth }}>
                                {segments.value.map((segment, index) => (
                                    <Fragment key={index}>{renderSegment(segment, false)}</Fragment>
                                ))}
                            </div>

                            <div
                                ref={restRef}
                                class={ProximityTextStyles.proximityTextRestLines}
                                style={{ width: lineWidth }}
                                aria-hidden="true"
                            >
                                {segments.value.map((segment, index) => (
                                    <Fragment key={index}>{renderSegment(segment, true)}</Fragment>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            );
        };
    },
    {
        name: "ProximityText",
        slots: Object as SlotsType<ProximityTextSlots>,
        props: declareProps<ProximityTextProps>({
            computeAnimationName: null,
            reachPx: null,
            pointSource: null,
            isDisabled: Boolean,
        }),
    },
);
