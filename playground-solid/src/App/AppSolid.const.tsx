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

const AccordionDocs = lazyPage(() => import("./Pages/Accordions/AccordionPage/AccordionDocs"), "AccordionDocs");
const CollapsibleDocs = lazyPage(() => import("./Pages/Accordions/CollapsiblePage/CollapsibleDocs"), "CollapsibleDocs");
const AudioSwitcherDocs = lazyPage(() => import("./Pages/AudioSwitcherPage/AudioSwitcherDocs"), "AudioSwitcherDocs");
const BracketPage = lazyPage(() => import("./Pages/BracketPage/BracketPage"), "BracketPage");
const BreadcrumbsDocs = lazyPage(() => import("./Pages/BreadcrumbsPage/BreadcrumbsDocs"), "BreadcrumbsDocs");
const ButtonDocs = lazyPage(() => import("./Pages/ButtonPage/ButtonDocs"), "ButtonDocs");
const CalendarDocs = lazyPage(() => import("./Pages/CalendarPage/CalendarDocs"), "CalendarDocs");
const CardStackPage = lazyPage(() => import("./Pages/CardStackPage/CardStackPage"), "CardStackPage");
const CarouselDocs = lazyPage(() => import("./Pages/Carousels/CarouselPage/CarouselDocs"), "CarouselDocs");
const CellAnimationPage = lazyPage(() => import("./Pages/CellAnimationPage/CellAnimationPage"), "CellAnimationPage");
const CheckboxGroupDocs = lazyPage(() => import("./Pages/CheckboxGroupPage/CheckboxGroupDocs"), "CheckboxGroupDocs");
const CheckboxDocs = lazyPage(() => import("./Pages/CheckboxPage/CheckboxDocs"), "CheckboxDocs");
const CirclePackingPage = lazyPage(() => import("./Pages/CirclePackingPage/CirclePackingPage"), "CirclePackingPage");
const ClockDocs = lazyPage(() => import("./Pages/ClockPage/ClockDocs"), "ClockDocs");
const ColorAreaDocs = lazyPage(() => import("./Pages/ColorAreaPage/ColorAreaDocs"), "ColorAreaDocs");
const ColorInputDocs = lazyPage(() => import("./Pages/ColorInputPage/ColorInputDocs"), "ColorInputDocs");
const CornerHighlightPage = lazyPage(
    () => import("./Pages/CornerHighlightPage/CornerHighlightPage"),
    "CornerHighlightPage",
);
const CornerPinPage = lazyPage(() => import("./Pages/CornerPinPage/CornerPinPage"), "CornerPinPage");
const CuboidPage = lazyPage(() => import("./Pages/CuboidPage/CuboidPage"), "CuboidPage");
const CurrencyInputDocs = lazyPage(() => import("./Pages/CurrencyInputPage/CurrencyInputDocs"), "CurrencyInputDocs");
const DateInputDocs = lazyPage(() => import("./Pages/DateInputPage/DateInputDocs"), "DateInputDocs");
const DatePickerDocs = lazyPage(() => import("./Pages/DatePickerPage/DatePickerDocs"), "DatePickerDocs");
const DateRangePickerDocs = lazyPage(
    () => import("./Pages/DateRangePickerPage/DateRangePickerDocs"),
    "DateRangePickerDocs",
);
const DateTimePickerDocs = lazyPage(
    () => import("./Pages/DateTimePickerPage/DateTimePickerDocs"),
    "DateTimePickerDocs",
);
const DiePage = lazyPage(() => import("./Pages/DiePage/DiePage"), "DiePage");
const DrawerDocs = lazyPage(() => import("./Pages/DrawerPage/DrawerDocs"), "DrawerDocs");
const EdgeFaderDocs = lazyPage(() => import("./Pages/EdgeFaderPage/EdgeFaderDocs"), "EdgeFaderDocs");
const FileInputDocs = lazyPage(() => import("./Pages/FileInputPage/FileInputDocs"), "FileInputDocs");
const FlipCardPage = lazyPage(() => import("./Pages/FlipCardPage/FlipCardPage"), "FlipCardPage");
const FlipbookPage = lazyPage(() => import("./Pages/FlipbookPage/FlipbookPage"), "FlipbookPage");
const InfiniteCorridorPage = lazyPage(
    () => import("./Pages/InfiniteCorridorPage/InfiniteCorridorPage"),
    "InfiniteCorridorPage",
);
const FormFieldDocs = lazyPage(() => import("./Pages/FormFieldPage/FormFieldDocs"), "FormFieldDocs");
const FormDocs = lazyPage(() => import("./Pages/FormPage/FormDocs"), "FormDocs");
const FormSectionDocs = lazyPage(() => import("./Pages/FormSectionPage/FormSectionDocs"), "FormSectionDocs");
const FormationPage = lazyPage(() => import("./Pages/FormationPage/FormationPage"), "FormationPage");
const GlassSurfacePage = lazyPage(() => import("./Pages/GlassSurfacePage/GlassSurfacePage"), "GlassSurfacePage");
const HoverCardDocs = lazyPage(() => import("./Pages/HoverCardPage/HoverCardDocs"), "HoverCardDocs");
const IciclePage = lazyPage(() => import("./Pages/IciclePage/IciclePage"), "IciclePage");
const ImageSwitcherDocs = lazyPage(() => import("./Pages/ImageSwitcherPage/ImageSwitcherDocs"), "ImageSwitcherDocs");
const LabelDocs = lazyPage(() => import("./Pages/LabelPage/LabelDocs"), "LabelDocs");
const ListboxDocs = lazyPage(() => import("./Pages/ListboxPage/ListboxDocs"), "ListboxDocs");
const MenubarDocs = lazyPage(() => import("./Pages/MenubarPage/MenubarDocs"), "MenubarDocs");
const CommandPaletteDocs = lazyPage(
    () => import("./Pages/Menus/CommandPalettePage/CommandPaletteDocs"),
    "CommandPaletteDocs",
);
const FanMenuDocs = lazyPage(() => import("./Pages/Menus/FanMenuPage/FanMenuDocs"), "FanMenuDocs");
const FlyoutMenuDocs = lazyPage(() => import("./Pages/Menus/FlyoutMenuPage/FlyoutMenuDocs"), "FlyoutMenuDocs");
const MenuDocs = lazyPage(() => import("./Pages/Menus/MenuPage/MenuDocs"), "MenuDocs");
const WheelMenuDocs = lazyPage(() => import("./Pages/Menus/WheelMenuPage/WheelMenuDocs"), "WheelMenuDocs");
const ModalDocs = lazyPage(() => import("./Pages/ModalPage/ModalDocs"), "ModalDocs");
const ElementMosaicPage = lazyPage(
    () => import("./Pages/Mosaics/ElementMosaicPage/ElementMosaicPage"),
    "ElementMosaicPage",
);
const ImageMosaicPage = lazyPage(() => import("./Pages/Mosaics/ImageMosaicPage/ImageMosaicPage"), "ImageMosaicPage");
const MultiSelectDocs = lazyPage(() => import("./Pages/MultiSelectPage/MultiSelectDocs"), "MultiSelectDocs");
const NumberInputDocs = lazyPage(() => import("./Pages/NumberInputPage/NumberInputDocs"), "NumberInputDocs");
const FittedTextPage = lazyPage(() => import("./Pages/FittedTextPage/FittedTextPage"), "FittedTextPage");
const MorphTextPage = lazyPage(() => import("./Pages/MorphTextPage/MorphTextPage"), "MorphTextPage");
const SlotTextPage = lazyPage(() => import("./Pages/SlotTextPage/SlotTextPage"), "SlotTextPage");
const PaginatorDocs = lazyPage(() => import("./Pages/PaginatorPage/PaginatorDocs"), "PaginatorDocs");
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
const PreviewDocs = lazyPage(() => import("./Pages/PreviewPage/PreviewDocs"), "PreviewDocs");
const ProgressDocs = lazyPage(() => import("./Pages/ProgressPage/ProgressDocs"), "ProgressDocs");
const RadioDocs = lazyPage(() => import("./Pages/RadioPage/RadioDocs"), "RadioDocs");
const RangeCalendarDocs = lazyPage(() => import("./Pages/RangeCalendarPage/RangeCalendarDocs"), "RangeCalendarDocs");
const RangeDocs = lazyPage(() => import("./Pages/RangePage/RangeDocs"), "RangeDocs");
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
const ScrollerDocs = lazyPage(() => import("./Pages/ScrollerPage/ScrollerDocs"), "ScrollerDocs");
const SegmentedInputDocs = lazyPage(
    () => import("./Pages/SegmentedInputPage/SegmentedInputDocs"),
    "SegmentedInputDocs",
);
const SelectDocs = lazyPage(() => import("./Pages/SelectPage/SelectDocs"), "SelectDocs");
const ShapePage = lazyPage(() => import("./Pages/ShapePage/ShapePage"), "ShapePage");
const ShapeRevealPage = lazyPage(() => import("./Pages/ShapeRevealPage/ShapeRevealPage"), "ShapeRevealPage");
const SidebarDocs = lazyPage(() => import("./Pages/SidebarPage/SidebarDocs"), "SidebarDocs");
const SlideButtonDocs = lazyPage(() => import("./Pages/SlideButtonPage/SlideButtonDocs"), "SlideButtonDocs");
const SortableGridPage = lazyPage(() => import("./Pages/SortableGridPage/SortableGridPage"), "SortableGridPage");
const SortableDocs = lazyPage(() => import("./Pages/SortablePage/SortableDocs"), "SortableDocs");
const SplitPaneDocs = lazyPage(() => import("./Pages/SplitPanePage/SplitPaneDocs"), "SplitPaneDocs");
const SpotlightGuideDocs = lazyPage(
    () => import("./Pages/Spotlights/SpotlightGuidePage/SpotlightGuideDocs"),
    "SpotlightGuideDocs",
);
const SpotlightHintDocs = lazyPage(
    () => import("./Pages/Spotlights/SpotlightHintPage/SpotlightHintDocs"),
    "SpotlightHintDocs",
);
const SpotlightPromptDocs = lazyPage(
    () => import("./Pages/Spotlights/SpotlightPromptPage/SpotlightPromptDocs"),
    "SpotlightPromptDocs",
);
const StaircasePage = lazyPage(() => import("./Pages/StaircasePage/StaircasePage"), "StaircasePage");
const StepperDocs = lazyPage(() => import("./Pages/StepperPage/StepperDocs"), "StepperDocs");
const SunburstPage = lazyPage(() => import("./Pages/SunburstPage/SunburstPage"), "SunburstPage");
const SurfacePage = lazyPage(() => import("./Pages/SurfacePage/SurfacePage"), "SurfacePage");
const TableOfContentsDocs = lazyPage(
    () => import("./Pages/TableOfContentsPage/TableOfContentsDocs"),
    "TableOfContentsDocs",
);
const TableDocs = lazyPage(() => import("./Pages/TablePage/TableDocs"), "TableDocs");
const TabsDocs = lazyPage(() => import("./Pages/TabsPage/TabsDocs"), "TabsDocs");
const TagInputDocs = lazyPage(() => import("./Pages/TagInputPage/TagInputDocs"), "TagInputDocs");
const TextAreaDocs = lazyPage(() => import("./Pages/TextAreaPage/TextAreaDocs"), "TextAreaDocs");
const TextInputDocs = lazyPage(() => import("./Pages/TextInputPage/TextInputDocs"), "TextInputDocs");
const TileBoardPage = lazyPage(() => import("./Pages/TileBoardPage/TileBoardPage"), "TileBoardPage");
const TimeInputDocs = lazyPage(() => import("./Pages/TimeInputPage/TimeInputDocs"), "TimeInputDocs");
const TimePickerDocs = lazyPage(() => import("./Pages/TimePickerPage/TimePickerDocs"), "TimePickerDocs");
const TimelinePage = lazyPage(() => import("./Pages/TimelinePage/TimelinePage"), "TimelinePage");
const ToastsDocs = lazyPage(() => import("./Pages/ToastsPage/ToastsDocs"), "ToastsDocs");
const ToggleDocs = lazyPage(() => import("./Pages/TogglePage/ToggleDocs"), "ToggleDocs");
const ToolbarDocs = lazyPage(() => import("./Pages/ToolbarPage/ToolbarDocs"), "ToolbarDocs");
const TooltipDocs = lazyPage(() => import("./Pages/TooltipPage/TooltipDocs"), "TooltipDocs");
const TrailPage = lazyPage(() => import("./Pages/TrailPage/TrailPage"), "TrailPage");
const WraparoundPage = lazyPage(() => import("./Pages/WraparoundPage/WraparoundPage"), "WraparoundPage");
const TreeDocs = lazyPage(() => import("./Pages/TreePage/TreeDocs"), "TreeDocs");
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
                component: () => <ShapeRevealPage />,
            },
            {
                name: "Shortcut",
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
                        docs: () => <AccordionDocs />,
                    },
                    {
                        name: "Collapsible",
                        docs: () => <CollapsibleDocs />,
                    },
                ],
            },
            {
                name: "Breadcrumbs",
                docs: () => <BreadcrumbsDocs />,
            },
            {
                name: "Buttons",
                children: [
                    {
                        name: "Button",
                        docs: () => <ButtonDocs />,
                    },
                    {
                        name: "SlideButton",
                        docs: () => <SlideButtonDocs />,
                    },
                ],
            },
            {
                name: "Carousel",
                docs: () => <CarouselDocs />,
            },
            {
                name: "EdgeFader",
                docs: () => <EdgeFaderDocs />,
            },
            {
                name: "Form",
                docs: () => <FormDocs />,
            },
            {
                name: "Input",
                children: [
                    {
                        name: "Calendar",
                        docs: () => <CalendarDocs />,
                    },
                    {
                        name: "Checkbox",
                        docs: () => <CheckboxDocs />,
                    },
                    {
                        name: "CheckboxGroup",
                        docs: () => <CheckboxGroupDocs />,
                    },
                    {
                        name: "Clock",
                        docs: () => <ClockDocs />,
                    },
                    {
                        name: "ColorArea",
                        docs: () => <ColorAreaDocs />,
                    },
                    {
                        name: "ColorInput",
                        docs: () => <ColorInputDocs />,
                    },
                    {
                        name: "CurrencyInput",
                        docs: () => <CurrencyInputDocs />,
                    },
                    {
                        name: "DateInput",
                        docs: () => <DateInputDocs />,
                    },
                    {
                        name: "DatePicker",
                        docs: () => <DatePickerDocs />,
                    },
                    {
                        name: "DateRangePicker",
                        docs: () => <DateRangePickerDocs />,
                    },
                    {
                        name: "DateTimePicker",
                        docs: () => <DateTimePickerDocs />,
                    },
                    {
                        name: "FileInput",
                        docs: () => <FileInputDocs />,
                    },
                    {
                        name: "FormField",
                        docs: () => <FormFieldDocs />,
                    },
                    {
                        name: "FormSection",
                        docs: () => <FormSectionDocs />,
                    },
                    {
                        name: "Label",
                        docs: () => <LabelDocs />,
                    },
                    {
                        name: "Listbox",
                        docs: () => <ListboxDocs />,
                    },
                    {
                        name: "MultiSelect",
                        docs: () => <MultiSelectDocs />,
                    },
                    {
                        name: "NumberInput",
                        docs: () => <NumberInputDocs />,
                    },
                    {
                        name: "Radio",
                        docs: () => <RadioDocs />,
                    },
                    {
                        name: "Range",
                        docs: () => <RangeDocs />,
                    },
                    {
                        name: "RangeCalendar",
                        docs: () => <RangeCalendarDocs />,
                    },
                    {
                        name: "SegmentedInput",
                        docs: () => <SegmentedInputDocs />,
                    },
                    {
                        name: "Select",
                        docs: () => <SelectDocs />,
                    },
                    {
                        name: "TagInput",
                        docs: () => <TagInputDocs />,
                    },
                    {
                        name: "TextArea",
                        docs: () => <TextAreaDocs />,
                    },
                    {
                        name: "TextInput",
                        docs: () => <TextInputDocs />,
                    },
                    {
                        name: "TimeInput",
                        docs: () => <TimeInputDocs />,
                    },
                    {
                        name: "TimePicker",
                        docs: () => <TimePickerDocs />,
                    },
                    {
                        name: "Toggle",
                        docs: () => <ToggleDocs />,
                    },
                ],
            },
            {
                name: "MediaSwitchers",
                children: [
                    {
                        name: "AudioSwitcher",
                        docs: () => <AudioSwitcherDocs />,
                    },
                    {
                        name: "ImageSwitcher",
                        docs: () => <ImageSwitcherDocs />,
                    },
                ],
            },
            {
                name: "Menubar",
                docs: () => <MenubarDocs />,
            },
            {
                name: "Menus",
                children: [
                    {
                        name: "CommandPalette",
                        docs: () => <CommandPaletteDocs />,
                    },
                    {
                        name: "FanMenu",
                        docs: () => <FanMenuDocs />,
                    },
                    {
                        name: "FlyoutMenu",
                        docs: () => <FlyoutMenuDocs />,
                    },
                    {
                        name: "Menu",
                        docs: () => <MenuDocs />,
                    },
                    {
                        name: "WheelMenu",
                        docs: () => <WheelMenuDocs />,
                    },
                ],
            },
            {
                name: "Overlays",
                children: [
                    {
                        name: "Drawer",
                        docs: () => <DrawerDocs />,
                    },
                    {
                        name: "HoverCard",
                        docs: () => <HoverCardDocs />,
                    },
                    {
                        name: "Modal",
                        docs: () => <ModalDocs />,
                    },
                    {
                        name: "Sidebar",
                        docs: () => <SidebarDocs />,
                    },
                    {
                        name: "Spotlights",
                        children: [
                            {
                                name: "SpotlightGuide",
                                docs: () => <SpotlightGuideDocs />,
                            },
                            {
                                name: "SpotlightHint",
                                docs: () => <SpotlightHintDocs />,
                            },
                            {
                                name: "SpotlightPrompt",
                                docs: () => <SpotlightPromptDocs />,
                            },
                        ],
                    },
                    {
                        name: "Toasts",
                        docs: () => <ToastsDocs />,
                    },
                    {
                        name: "Tooltip",
                        docs: () => <TooltipDocs />,
                    },
                ],
            },
            {
                name: "Paginator",
                docs: () => <PaginatorDocs />,
            },
            {
                name: "Preview",
                docs: () => <PreviewDocs />,
            },
            {
                name: "Progress",
                docs: () => <ProgressDocs />,
            },
            {
                name: "Scroller",
                docs: () => <ScrollerDocs />,
            },
            {
                name: "Sortable",
                docs: () => <SortableDocs />,
            },
            {
                name: "SplitPane",
                docs: () => <SplitPaneDocs />,
            },
            {
                name: "Stepper",
                docs: () => <StepperDocs />,
            },
            {
                name: "Table",
                docs: () => <TableDocs />,
            },
            {
                name: "TableOfContents",
                docs: () => <TableOfContentsDocs />,
            },
            {
                name: "Tabs",
                docs: () => <TabsDocs />,
            },
            {
                name: "Toolbar",
                docs: () => <ToolbarDocs />,
            },
            {
                name: "Tree",
                docs: () => <TreeDocs />,
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
                name: "ViewportWrapper",
                component: () => <ViewportWrapperPage />,
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
