import { type Component, lazy } from "solid-js";
import type { DependencyNames } from "virtual:component-dependencies";

import { SHOW_COMPOSITES } from "@thewaver/ss-playground/App/App.const";

import type { MenuBranchConfig } from "./App.types";

export {
    LIST_PAGELESS_COMPONENTS,
    SEARCH_FIELD_WIDTH,
    MENU_ID,
    MENU_EDGE,
    PREVIEW_EXCLUDED_PAGES,
    DEPENDENCY_SECTIONS,
    DEPENDENCY_GROUPS,
    FIXED_ANCHOR_RATIO,
} from "@thewaver/ss-playground/App/App.const";

const lazyPage = <K extends string>(load: () => Promise<Record<K, Component>>, key: K) =>
    lazy(() => load().then((module) => ({ default: module[key] })));

const AccordionPage = lazyPage(() => import("./Pages/Accordions/AccordionPage/AccordionPage"), "AccordionPage");
const CollapsiblePage = lazyPage(() => import("./Pages/Accordions/CollapsiblePage/CollapsiblePage"), "CollapsiblePage");
const AudioSwitcherPage = lazyPage(() => import("./Pages/AudioSwitcherPage/AudioSwitcherPage"), "AudioSwitcherPage");
const BracketPage = lazyPage(() => import("./Pages/BracketPage/BracketPage"), "BracketPage");
const BreadcrumbsPage = lazyPage(() => import("./Pages/BreadcrumbsPage/BreadcrumbsPage"), "BreadcrumbsPage");
const ButtonPage = lazyPage(() => import("./Pages/ButtonPage/ButtonPage"), "ButtonPage");
const CalendarPage = lazyPage(() => import("./Pages/CalendarPage/CalendarPage"), "CalendarPage");
const CardStackPage = lazyPage(() => import("./Pages/CardStackPage/CardStackPage"), "CardStackPage");
const CarouselPage = lazyPage(() => import("./Pages/Carousels/CarouselPage/CarouselPage"), "CarouselPage");
const CellAnimationPage = lazyPage(() => import("./Pages/CellAnimationPage/CellAnimationPage"), "CellAnimationPage");
const CheckboxGroupPage = lazyPage(() => import("./Pages/CheckboxGroupPage/CheckboxGroupPage"), "CheckboxGroupPage");
const CheckboxPage = lazyPage(() => import("./Pages/CheckboxPage/CheckboxPage"), "CheckboxPage");
const CirclePackingPage = lazyPage(() => import("./Pages/CirclePackingPage/CirclePackingPage"), "CirclePackingPage");
const ClockPage = lazyPage(() => import("./Pages/ClockPage/ClockPage"), "ClockPage");
const ColorAreaPage = lazyPage(() => import("./Pages/ColorAreaPage/ColorAreaPage"), "ColorAreaPage");
const ColorInputPage = lazyPage(() => import("./Pages/ColorInputPage/ColorInputPage"), "ColorInputPage");
const CornerHighlightPage = lazyPage(
    () => import("./Pages/CornerHighlightPage/CornerHighlightPage"),
    "CornerHighlightPage",
);
const CornerPinPage = lazyPage(() => import("./Pages/CornerPinPage/CornerPinPage"), "CornerPinPage");
const CuboidPage = lazyPage(() => import("./Pages/CuboidPage/CuboidPage"), "CuboidPage");
const CurrencyInputPage = lazyPage(() => import("./Pages/CurrencyInputPage/CurrencyInputPage"), "CurrencyInputPage");
const DateInputPage = lazyPage(() => import("./Pages/DateInputPage/DateInputPage"), "DateInputPage");
const DatePickerPage = lazyPage(() => import("./Pages/DatePickerPage/DatePickerPage"), "DatePickerPage");
const DateRangePickerPage = lazyPage(
    () => import("./Pages/DateRangePickerPage/DateRangePickerPage"),
    "DateRangePickerPage",
);
const DateTimePickerPage = lazyPage(
    () => import("./Pages/DateTimePickerPage/DateTimePickerPage"),
    "DateTimePickerPage",
);
const DiePage = lazyPage(() => import("./Pages/DiePage/DiePage"), "DiePage");
const DrawerPage = lazyPage(() => import("./Pages/DrawerPage/DrawerPage"), "DrawerPage");
const EdgeFaderPage = lazyPage(() => import("./Pages/EdgeFaderPage/EdgeFaderPage"), "EdgeFaderPage");
const FileInputPage = lazyPage(() => import("./Pages/FileInputPage/FileInputPage"), "FileInputPage");
const FlipCardPage = lazyPage(() => import("./Pages/FlipCardPage/FlipCardPage"), "FlipCardPage");
const FlipbookPage = lazyPage(() => import("./Pages/FlipbookPage/FlipbookPage"), "FlipbookPage");
const InfiniteCorridorPage = lazyPage(
    () => import("./Pages/InfiniteCorridorPage/InfiniteCorridorPage"),
    "InfiniteCorridorPage",
);
const FormFieldPage = lazyPage(() => import("./Pages/FormFieldPage/FormFieldPage"), "FormFieldPage");
const FormPage = lazyPage(() => import("./Pages/FormPage/FormPage"), "FormPage");
const FormSectionPage = lazyPage(() => import("./Pages/FormSectionPage/FormSectionPage"), "FormSectionPage");
const FormationPage = lazyPage(() => import("./Pages/FormationPage/FormationPage"), "FormationPage");
const GlassSurfacePage = lazyPage(() => import("./Pages/GlassSurfacePage/GlassSurfacePage"), "GlassSurfacePage");
const HoverCardPage = lazyPage(() => import("./Pages/HoverCardPage/HoverCardPage"), "HoverCardPage");
const IciclePage = lazyPage(() => import("./Pages/IciclePage/IciclePage"), "IciclePage");
const ImageSwitcherPage = lazyPage(() => import("./Pages/ImageSwitcherPage/ImageSwitcherPage"), "ImageSwitcherPage");
const LabelPage = lazyPage(() => import("./Pages/LabelPage/LabelPage"), "LabelPage");
const ListboxPage = lazyPage(() => import("./Pages/ListboxPage/ListboxPage"), "ListboxPage");
const MenubarPage = lazyPage(() => import("./Pages/MenubarPage/MenubarPage"), "MenubarPage");
const FanMenuPage = lazyPage(() => import("./Pages/Menus/FanMenuPage/FanMenuPage"), "FanMenuPage");
const FlyoutMenuPage = lazyPage(() => import("./Pages/Menus/FlyoutMenuPage/FlyoutMenuPage"), "FlyoutMenuPage");
const MenuPage = lazyPage(() => import("./Pages/Menus/MenuPage/MenuPage"), "MenuPage");
const WheelMenuPage = lazyPage(() => import("./Pages/Menus/WheelMenuPage/WheelMenuPage"), "WheelMenuPage");
const ModalPage = lazyPage(() => import("./Pages/ModalPage/ModalPage"), "ModalPage");
const ElementMosaicPage = lazyPage(
    () => import("./Pages/Mosaics/ElementMosaicPage/ElementMosaicPage"),
    "ElementMosaicPage",
);
const ImageMosaicPage = lazyPage(() => import("./Pages/Mosaics/ImageMosaicPage/ImageMosaicPage"), "ImageMosaicPage");
const MultiSelectPage = lazyPage(() => import("./Pages/MultiSelectPage/MultiSelectPage"), "MultiSelectPage");
const NumberInputPage = lazyPage(() => import("./Pages/NumberInputPage/NumberInputPage"), "NumberInputPage");
const FittedTextPage = lazyPage(() => import("./Pages/FittedTextPage/FittedTextPage"), "FittedTextPage");
const MorphTextPage = lazyPage(() => import("./Pages/MorphTextPage/MorphTextPage"), "MorphTextPage");
const SlotTextPage = lazyPage(() => import("./Pages/SlotTextPage/SlotTextPage"), "SlotTextPage");
const PaginatorPage = lazyPage(() => import("./Pages/PaginatorPage/PaginatorPage"), "PaginatorPage");
const PaintedTextPage = lazyPage(() => import("./Pages/PaintedTextPage/PaintedTextPage"), "PaintedTextPage");
const ProximityTextPage = lazyPage(() => import("./Pages/ProximityTextPage/ProximityTextPage"), "ProximityTextPage");
const ParticleFieldPage = lazyPage(() => import("./Pages/ParticleFieldPage/ParticleFieldPage"), "ParticleFieldPage");
const ParticleSpawnerPage = lazyPage(
    () => import("./Pages/ParticleSpawnerPage/ParticleSpawnerPage"),
    "ParticleSpawnerPage",
);
const PatchBoardPage = lazyPage(() => import("./Pages/PatchBoardPage/PatchBoardPage"), "PatchBoardPage");
const LightCatcherPage = lazyPage(
    () => import("./Pages/PointerEffects/LightCatcherPage/LightCatcherPage"),
    "LightCatcherPage",
);
const RGBSplitterPage = lazyPage(
    () => import("./Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage"),
    "RGBSplitterPage",
);
const ShadowCasterPage = lazyPage(
    () => import("./Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage"),
    "ShadowCasterPage",
);
const TilterPage = lazyPage(() => import("./Pages/PointerEffects/TilterPage/TilterPage"), "TilterPage");
const PreviewPage = lazyPage(() => import("./Pages/PreviewPage/PreviewPage"), "PreviewPage");
const ProgressPage = lazyPage(() => import("./Pages/ProgressPage/ProgressPage"), "ProgressPage");
const RadioPage = lazyPage(() => import("./Pages/RadioPage/RadioPage"), "RadioPage");
const RangeCalendarPage = lazyPage(() => import("./Pages/RangeCalendarPage/RangeCalendarPage"), "RangeCalendarPage");
const RangePage = lazyPage(() => import("./Pages/RangePage/RangePage"), "RangePage");
const LensPage = lazyPage(() => import("./Pages/Reveals/LensPage/LensPage"), "LensPage");
const RevealPage = lazyPage(() => import("./Pages/Reveals/RevealPage/RevealPage"), "RevealPage");
const ScratchCardPage = lazyPage(() => import("./Pages/Reveals/ScratchCardPage/ScratchCardPage"), "ScratchCardPage");
const RichTextPage = lazyPage(() => import("./Pages/RichTextPage/RichTextPage"), "RichTextPage");
const SVGFiltersPage = lazyPage(() => import("./Pages/SVGFiltersPage/SVGFiltersPage"), "SVGFiltersPage");
const TimedGradientsPage = lazyPage(
    () => import("./Pages/SVGGradients/TimedGradientsPage/TimedGradientsPage"),
    "TimedGradientsPage",
);
const TrackedGradientsPage = lazyPage(
    () => import("./Pages/SVGGradients/TrackedGradientsPage/TrackedGradientsPage"),
    "TrackedGradientsPage",
);
const TimedPatternsPage = lazyPage(
    () => import("./Pages/SVGPatterns/TimedPatternsPage/TimedPatternsPage"),
    "TimedPatternsPage",
);
const TrackedPatternsPage = lazyPage(
    () => import("./Pages/SVGPatterns/TrackedPatternsPage/TrackedPatternsPage"),
    "TrackedPatternsPage",
);
const SatellitePage = lazyPage(() => import("./Pages/SatellitePage/SatellitePage"), "SatellitePage");
const ScanlineAnimationPage = lazyPage(
    () => import("./Pages/ScanLineAnimationPage/ScanLineAnimationPage"),
    "ScanlineAnimationPage",
);
const ScrambleTextPage = lazyPage(() => import("./Pages/ScrambleTextPage/ScrambleTextPage"), "ScrambleTextPage");
const ScrollerPage = lazyPage(() => import("./Pages/ScrollerPage/ScrollerPage"), "ScrollerPage");
const SegmentedInputPage = lazyPage(
    () => import("./Pages/SegmentedInputPage/SegmentedInputPage"),
    "SegmentedInputPage",
);
const SelectPage = lazyPage(() => import("./Pages/SelectPage/SelectPage"), "SelectPage");
const ShapePage = lazyPage(() => import("./Pages/ShapePage/ShapePage"), "ShapePage");
const SidebarPage = lazyPage(() => import("./Pages/SidebarPage/SidebarPage"), "SidebarPage");
const SlideButtonPage = lazyPage(() => import("./Pages/SlideButtonPage/SlideButtonPage"), "SlideButtonPage");
const SortableGridPage = lazyPage(() => import("./Pages/SortableGridPage/SortableGridPage"), "SortableGridPage");
const SortablePage = lazyPage(() => import("./Pages/SortablePage/SortablePage"), "SortablePage");
const SplitPanePage = lazyPage(() => import("./Pages/SplitPanePage/SplitPanePage"), "SplitPanePage");
const SpotlightGuidePage = lazyPage(
    () => import("./Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage"),
    "SpotlightGuidePage",
);
const SpotlightHintPage = lazyPage(
    () => import("./Pages/Spotlights/SpotlightHintPage/SpotlightHintPage"),
    "SpotlightHintPage",
);
const SpotlightPromptPage = lazyPage(
    () => import("./Pages/Spotlights/SpotlightPromptPage/SpotlightPromptPage"),
    "SpotlightPromptPage",
);
const StaircasePage = lazyPage(() => import("./Pages/StaircasePage/StaircasePage"), "StaircasePage");
const StepperPage = lazyPage(() => import("./Pages/StepperPage/StepperPage"), "StepperPage");
const SunburstPage = lazyPage(() => import("./Pages/SunburstPage/SunburstPage"), "SunburstPage");
const SurfacePage = lazyPage(() => import("./Pages/SurfacePage/SurfacePage"), "SurfacePage");
const TableOfContentsPage = lazyPage(
    () => import("./Pages/TableOfContentsPage/TableOfContentsPage"),
    "TableOfContentsPage",
);
const TablePage = lazyPage(() => import("./Pages/TablePage/TablePage"), "TablePage");
const TabsPage = lazyPage(() => import("./Pages/TabsPage/TabsPage"), "TabsPage");
const TagInputPage = lazyPage(() => import("./Pages/TagInputPage/TagInputPage"), "TagInputPage");
const TextAreaPage = lazyPage(() => import("./Pages/TextAreaPage/TextAreaPage"), "TextAreaPage");
const TextInputPage = lazyPage(() => import("./Pages/TextInputPage/TextInputPage"), "TextInputPage");
const TileBoardPage = lazyPage(() => import("./Pages/TileBoardPage/TileBoardPage"), "TileBoardPage");
const TimeInputPage = lazyPage(() => import("./Pages/TimeInputPage/TimeInputPage"), "TimeInputPage");
const TimePickerPage = lazyPage(() => import("./Pages/TimePickerPage/TimePickerPage"), "TimePickerPage");
const TimelinePage = lazyPage(() => import("./Pages/TimelinePage/TimelinePage"), "TimelinePage");
const ToastsPage = lazyPage(() => import("./Pages/ToastsPage/ToastsPage"), "ToastsPage");
const TogglePage = lazyPage(() => import("./Pages/TogglePage/TogglePage"), "TogglePage");
const ToolbarPage = lazyPage(() => import("./Pages/ToolbarPage/ToolbarPage"), "ToolbarPage");
const TooltipPage = lazyPage(() => import("./Pages/TooltipPage/TooltipPage"), "TooltipPage");
const TrailPage = lazyPage(() => import("./Pages/TrailPage/TrailPage"), "TrailPage");
const WraparoundPage = lazyPage(() => import("./Pages/WraparoundPage/WraparoundPage"), "WraparoundPage");
const TreePage = lazyPage(() => import("./Pages/TreePage/TreePage"), "TreePage");
const TreemapPage = lazyPage(() => import("./Pages/TreemapPage/TreemapPage"), "TreemapPage");
const TypewriterPage = lazyPage(() => import("./Pages/TypewriterPage/TypewriterPage"), "TypewriterPage");
const ViewportWrapperPage = lazyPage(
    () => import("./Pages/ViewportWrapperPage/ViewportWrapperPage"),
    "ViewportWrapperPage",
);
const DrumWheelPage = lazyPage(() => import("./Pages/Wheels/DrumWheelPage/DrumWheelPage"), "DrumWheelPage");
const OverheadWheelPage = lazyPage(
    () => import("./Pages/Wheels/OverheadWheelPage/OverheadWheelPage"),
    "OverheadWheelPage",
);

export const MENU_CONFIGS: MenuBranchConfig[] = [
    {
        name: "Abstracts",
        children: [
            {
                name: "Anchor",
            },
            {
                name: "Carrier",
            },
            {
                name: "CheckedState",
            },
            {
                name: "ColorExtractor",
            },
            {
                name: "Cutout",
            },
            {
                name: "DateTimeValue",
            },
            {
                name: "DateValue",
            },
            {
                name: "Dismisser",
            },
            {
                name: "ElementFader",
            },
            {
                name: "ElementObserver",
            },
            {
                name: "Elevation",
            },
            {
                name: "Flattener",
            },
            {
                name: "FocusManager",
            },
            {
                name: "FrameRateMonitor",
            },
            {
                name: "InteractionTracker",
            },
            {
                name: "LiveAnnouncer",
            },
            {
                name: "MaskedField",
            },
            {
                name: "MediaQueryMonitor",
            },
            {
                name: "Navigator",
            },
            {
                name: "Placement",
            },
            {
                name: "PointerTracker",
            },
            {
                name: "Proximity",
            },
            {
                name: "Rotator",
            },
            {
                name: "Selection",
            },
            {
                name: "ShapeReveal",
            },
            {
                name: "SignalMirror",
            },
            {
                name: "Smoother",
            },
            {
                name: "TextSync",
            },
            {
                name: "Typeahead",
            },
            {
                name: "Viewport",
            },
            {
                name: "Virtualizer",
            },
        ],
    },
    {
        name: "Composites",
        hidden: !SHOW_COMPOSITES,
        children: [
            {
                name: "GlassSurface",
                component: () => <GlassSurfacePage />,
            },
            {
                name: "Surface",
                component: () => <SurfacePage />,
            },
        ],
    },
    {
        name: "Essentials",
        children: [
            {
                name: "Accordions",
                children: [
                    {
                        name: "Accordion",
                        component: () => <AccordionPage />,
                    },
                    {
                        name: "Collapsible",
                        component: () => <CollapsiblePage />,
                    },
                ],
            },
            {
                name: "Breadcrumbs",
                component: () => <BreadcrumbsPage />,
            },
            {
                name: "Buttons",
                children: [
                    {
                        name: "Button",
                        component: () => <ButtonPage />,
                    },
                    {
                        name: "SlideButton",
                        component: () => <SlideButtonPage />,
                    },
                ],
            },
            {
                name: "Carousel",
                component: () => <CarouselPage />,
            },
            {
                name: "EdgeFader",
                component: () => <EdgeFaderPage />,
            },
            {
                name: "Form",
                component: () => <FormPage />,
            },
            {
                name: "Input",
                children: [
                    {
                        name: "Calendar",
                        component: () => <CalendarPage />,
                    },
                    {
                        name: "Checkbox",
                        component: () => <CheckboxPage />,
                    },
                    {
                        name: "CheckboxGroup",
                        component: () => <CheckboxGroupPage />,
                    },
                    {
                        name: "Clock",
                        component: () => <ClockPage />,
                    },
                    {
                        name: "ColorArea",
                        component: () => <ColorAreaPage />,
                    },
                    {
                        name: "ColorInput",
                        component: () => <ColorInputPage />,
                    },
                    {
                        name: "CurrencyInput",
                        component: () => <CurrencyInputPage />,
                    },
                    {
                        name: "DateInput",
                        component: () => <DateInputPage />,
                    },
                    {
                        name: "DatePicker",
                        component: () => <DatePickerPage />,
                    },
                    {
                        name: "DateRangePicker",
                        component: () => <DateRangePickerPage />,
                    },
                    {
                        name: "DateTimePicker",
                        component: () => <DateTimePickerPage />,
                    },
                    {
                        name: "FileInput",
                        component: () => <FileInputPage />,
                    },
                    {
                        name: "FormField",
                        component: () => <FormFieldPage />,
                    },
                    {
                        name: "FormSection",
                        component: () => <FormSectionPage />,
                    },
                    {
                        name: "Label",
                        component: () => <LabelPage />,
                    },
                    {
                        name: "Listbox",
                        component: () => <ListboxPage />,
                    },
                    {
                        name: "MultiSelect",
                        component: () => <MultiSelectPage />,
                    },
                    {
                        name: "NumberInput",
                        component: () => <NumberInputPage />,
                    },
                    {
                        name: "Radio",
                        component: () => <RadioPage />,
                    },
                    {
                        name: "Range",
                        component: () => <RangePage />,
                    },
                    {
                        name: "RangeCalendar",
                        component: () => <RangeCalendarPage />,
                    },
                    {
                        name: "SegmentedInput",
                        component: () => <SegmentedInputPage />,
                    },
                    {
                        name: "Select",
                        component: () => <SelectPage />,
                    },
                    {
                        name: "TagInput",
                        component: () => <TagInputPage />,
                    },
                    {
                        name: "TextArea",
                        component: () => <TextAreaPage />,
                    },
                    {
                        name: "TextInput",
                        component: () => <TextInputPage />,
                    },
                    {
                        name: "TimeInput",
                        component: () => <TimeInputPage />,
                    },
                    {
                        name: "TimePicker",
                        component: () => <TimePickerPage />,
                    },
                    {
                        name: "Toggle",
                        component: () => <TogglePage />,
                    },
                ],
            },
            {
                name: "MediaSwitchers",
                children: [
                    {
                        name: "AudioSwitcher",
                        component: () => <AudioSwitcherPage />,
                    },
                    {
                        name: "ImageSwitcher",
                        component: () => <ImageSwitcherPage />,
                    },
                ],
            },
            {
                name: "Menubar",
                component: () => <MenubarPage />,
            },
            {
                name: "Menus",
                children: [
                    {
                        name: "FanMenu",
                        component: () => <FanMenuPage />,
                    },
                    {
                        name: "FlyoutMenu",
                        component: () => <FlyoutMenuPage />,
                    },
                    {
                        name: "Menu",
                        component: () => <MenuPage />,
                    },
                    {
                        name: "WheelMenu",
                        component: () => <WheelMenuPage />,
                    },
                ],
            },
            {
                name: "Overlays",
                children: [
                    {
                        name: "Drawer",
                        component: () => <DrawerPage />,
                    },
                    {
                        name: "HoverCard",
                        component: () => <HoverCardPage />,
                    },
                    {
                        name: "Modal",
                        component: () => <ModalPage />,
                    },
                    {
                        name: "Sidebar",
                        component: () => <SidebarPage />,
                    },
                    {
                        name: "Spotlights",
                        children: [
                            {
                                name: "SpotlightGuide",
                                component: () => <SpotlightGuidePage />,
                            },
                            {
                                name: "SpotlightHint",
                                component: () => <SpotlightHintPage />,
                            },
                            {
                                name: "SpotlightPrompt",
                                component: () => <SpotlightPromptPage />,
                            },
                        ],
                    },
                    {
                        name: "Toasts",
                        component: () => <ToastsPage />,
                    },
                    {
                        name: "Tooltip",
                        component: () => <TooltipPage />,
                    },
                ],
            },
            {
                name: "Paginator",
                component: () => <PaginatorPage />,
            },
            {
                name: "Preview",
                component: () => <PreviewPage />,
            },
            {
                name: "Progress",
                component: () => <ProgressPage />,
            },
            {
                name: "Scroller",
                component: () => <ScrollerPage />,
            },
            {
                name: "Sortable",
                component: () => <SortablePage />,
            },
            {
                name: "SplitPane",
                component: () => <SplitPanePage />,
            },
            {
                name: "Stepper",
                component: () => <StepperPage />,
            },
            {
                name: "Table",
                component: () => <TablePage />,
            },
            {
                name: "TableOfContents",
                component: () => <TableOfContentsPage />,
            },
            {
                name: "Tabs",
                component: () => <TabsPage />,
            },
            {
                name: "Toolbar",
                component: () => <ToolbarPage />,
            },
            {
                name: "Tree",
                component: () => <TreePage />,
            },
            {
                name: "ViewportWrapper",
                component: () => <ViewportWrapperPage />,
            },
        ],
    },
    {
        name: "Exotics",
        children: [
            {
                name: "Animations",
                children: [
                    {
                        name: "CellAnimation",
                        component: () => <CellAnimationPage />,
                    },
                    {
                        name: "ScanlineAnimation",
                        component: () => <ScanlineAnimationPage />,
                    },
                ],
            },
            {
                name: "Arrangements",
                children: [
                    {
                        name: "Formation",
                        component: () => <FormationPage />,
                    },
                    {
                        name: "Satellite",
                        component: () => <SatellitePage />,
                    },
                    {
                        name: "Staircase",
                        component: () => <StaircasePage />,
                    },
                ],
            },
            {
                name: "CardStack",
                component: () => <CardStackPage />,
            },
            {
                name: "Charts",
                children: [
                    {
                        name: "CirclePacking",
                        component: () => <CirclePackingPage />,
                    },
                    {
                        name: "Icicle",
                        component: () => <IciclePage />,
                    },
                    {
                        name: "Sunburst",
                        component: () => <SunburstPage />,
                    },
                    {
                        name: "Treemap",
                        component: () => <TreemapPage />,
                    },
                ],
            },
            {
                name: "CornerHighlight",
                component: () => <CornerHighlightPage />,
            },
            {
                name: "Diagrams",
                children: [
                    {
                        name: "Bracket",
                        component: () => <BracketPage />,
                    },
                    {
                        name: "PatchBoard",
                        component: () => <PatchBoardPage />,
                    },
                    {
                        name: "Timeline",
                        component: () => <TimelinePage />,
                    },
                ],
            },
            {
                name: "Mosaics",
                children: [
                    {
                        name: "ElementMosaic",
                        component: () => <ElementMosaicPage />,
                    },
                    {
                        name: "ImageMosaic",
                        component: () => <ImageMosaicPage />,
                    },
                ],
            },
            {
                name: "Particles",
                children: [
                    {
                        name: "ParticleField",
                        component: () => <ParticleFieldPage />,
                    },
                    {
                        name: "ParticleSpawner",
                        component: () => <ParticleSpawnerPage />,
                    },
                ],
            },
            {
                name: "Perspective",
                children: [
                    {
                        name: "CornerPin",
                        component: () => <CornerPinPage />,
                    },
                    {
                        name: "Cuboid",
                        component: () => <CuboidPage />,
                    },
                    {
                        name: "Die",
                        component: () => <DiePage />,
                    },
                    {
                        name: "FlipCard",
                        component: () => <FlipCardPage />,
                    },
                    {
                        name: "Flipbook",
                        component: () => <FlipbookPage />,
                    },
                    {
                        name: "InfiniteCorridor",
                        component: () => <InfiniteCorridorPage />,
                    },
                ],
            },
            {
                name: "PointerEffects",
                children: [
                    {
                        name: "LightCatcher",
                        component: () => <LightCatcherPage />,
                    },
                    {
                        name: "RGBSplitter",
                        component: () => <RGBSplitterPage />,
                    },
                    {
                        name: "ShadowCaster",
                        component: () => <ShadowCasterPage />,
                    },
                    {
                        name: "Tilter",
                        component: () => <TilterPage />,
                    },
                ],
            },
            {
                name: "Reveals",
                children: [
                    {
                        name: "Lens",
                        component: () => <LensPage />,
                    },
                    {
                        name: "Reveal",
                        component: () => <RevealPage />,
                    },
                    {
                        name: "ScratchCard",
                        component: () => <ScratchCardPage />,
                    },
                ],
            },
            {
                name: "Shape",
                component: () => <ShapePage />,
            },
            {
                name: "SortableGrid",
                component: () => <SortableGridPage />,
            },
            {
                name: "Text",
                children: [
                    {
                        name: "FittedText",
                        component: () => <FittedTextPage />,
                    },
                    {
                        name: "MorphText",
                        component: () => <MorphTextPage />,
                    },
                    {
                        name: "SlotText",
                        component: () => <SlotTextPage />,
                    },
                    {
                        name: "PaintedText",
                        component: () => <PaintedTextPage />,
                    },
                    {
                        name: "ProximityText",
                        component: () => <ProximityTextPage />,
                    },
                    {
                        name: "RichText",
                        component: () => <RichTextPage />,
                    },
                    {
                        name: "ScrambleText",
                        component: () => <ScrambleTextPage />,
                    },
                    {
                        name: "Typewriter",
                        component: () => <TypewriterPage />,
                    },
                ],
            },
            {
                name: "TileBoard",
                component: () => <TileBoardPage />,
            },
            {
                name: "Trail",
                component: () => <TrailPage />,
            },
            {
                name: "Wheels",
                children: [
                    {
                        name: "DrumWheel",
                        component: () => <DrumWheelPage />,
                    },
                    {
                        name: "OverheadWheel",
                        component: () => <OverheadWheelPage />,
                    },
                ],
            },
            {
                name: "Wraparound",
                component: () => <WraparoundPage />,
            },
        ],
    },
    {
        name: "Generators",
        children: [
            {
                name: "CellAnimationBreakpoints",
            },
            {
                name: "CellAnimationKeyframes",
            },
            {
                name: "CellAnimationPlayback",
            },
            {
                name: "CellAnimationWeights",
            },
            {
                name: "CellAnimationZones",
            },
            {
                name: "PlacementLayouts",
            },
            {
                name: "ProximityEffects",
            },
            {
                name: "SVGDefs",
                children: [
                    {
                        name: "SVGAnimations",
                    },
                    {
                        name: "SVGFilters",
                        component: () => <SVGFiltersPage />,
                    },
                    {
                        name: "SVGGradients",
                        children: [
                            {
                                name: "SVGGradients",
                            },
                            {
                                name: "TimedGradients",
                                component: () => <TimedGradientsPage />,
                            },
                            {
                                name: "TrackedGradients",
                                component: () => <TrackedGradientsPage />,
                            },
                        ],
                    },
                    {
                        name: "SVGPatterns",
                        children: [
                            {
                                name: "SVGPatterns",
                            },
                            {
                                name: "TimedPatterns",
                                component: () => <TimedPatternsPage />,
                            },
                            {
                                name: "TrackedPatterns",
                                component: () => <TrackedPatternsPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        name: "Primitives",
        children: [
            {
                name: "Barrel",
            },
            {
                name: "BinarySwitch",
            },
            {
                name: "InteractionWrapper",
            },
            {
                name: "Mosaic",
            },
            {
                name: "PlacementBox",
            },
            {
                name: "PlacementItem",
            },
            {
                name: "Popover",
            },
            {
                name: "PopupTrigger",
            },
            {
                name: "Spine",
            },
            {
                name: "Spotlight",
            },
            {
                name: "TextField",
            },
            {
                name: "Wheel",
            },
        ],
    },
];

export const EMPTY_DEPENDENCY_NAMES: DependencyNames = {
    abstracts: [],
    generators: [],
    primitives: [],
    components: [],
};
