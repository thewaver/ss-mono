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

const AccordionPage = () => import("./Pages/Accordions/AccordionPage/AccordionPage.svelte");
const CollapsiblePage = () => import("./Pages/Accordions/CollapsiblePage/CollapsiblePage.svelte");
const AudioSwitcherPage = () => import("./Pages/AudioSwitcherPage/AudioSwitcherPage.svelte");
const BracketPage = () => import("./Pages/BracketPage/BracketPage.svelte");
const BreadcrumbsPage = () => import("./Pages/BreadcrumbsPage/BreadcrumbsPage.svelte");
const ButtonPage = () => import("./Pages/ButtonPage/ButtonPage.svelte");
const CalendarPage = () => import("./Pages/CalendarPage/CalendarPage.svelte");
const CardStackPage = () => import("./Pages/CardStackPage/CardStackPage.svelte");
const CarouselPage = () => import("./Pages/Carousels/CarouselPage/CarouselPage.svelte");
const CellAnimationPage = () => import("./Pages/CellAnimationPage/CellAnimationPage.svelte");
const CheckboxGroupPage = () => import("./Pages/CheckboxGroupPage/CheckboxGroupPage.svelte");
const CheckboxPage = () => import("./Pages/CheckboxPage/CheckboxPage.svelte");
const CirclePackingPage = () => import("./Pages/CirclePackingPage/CirclePackingPage.svelte");
const ClockPage = () => import("./Pages/ClockPage/ClockPage.svelte");
const ColorAreaPage = () => import("./Pages/ColorAreaPage/ColorAreaPage.svelte");
const ColorInputPage = () => import("./Pages/ColorInputPage/ColorInputPage.svelte");
const CornersPage = () => import("./Pages/CornersPage/CornersPage.svelte");
const CuboidPage = () => import("./Pages/CuboidPage/CuboidPage.svelte");
const CurrencyInputPage = () => import("./Pages/CurrencyInputPage/CurrencyInputPage.svelte");
const DateInputPage = () => import("./Pages/DateInputPage/DateInputPage.svelte");
const DatePickerPage = () => import("./Pages/DatePickerPage/DatePickerPage.svelte");
const DateRangePickerPage = () => import("./Pages/DateRangePickerPage/DateRangePickerPage.svelte");
const DateTimePickerPage = () => import("./Pages/DateTimePickerPage/DateTimePickerPage.svelte");
const DiePage = () => import("./Pages/DiePage/DiePage.svelte");
const DrawerPage = () => import("./Pages/DrawerPage/DrawerPage.svelte");
const EdgeFaderPage = () => import("./Pages/EdgeFaderPage/EdgeFaderPage.svelte");
const FileInputPage = () => import("./Pages/FileInputPage/FileInputPage.svelte");
const FlipCardPage = () => import("./Pages/FlipCardPage/FlipCardPage.svelte");
const FlipbookPage = () => import("./Pages/FlipbookPage/FlipbookPage.svelte");
const FormFieldPage = () => import("./Pages/FormFieldPage/FormFieldPage.svelte");
const FormPage = () => import("./Pages/FormPage/FormPage.svelte");
const FormSectionPage = () => import("./Pages/FormSectionPage/FormSectionPage.svelte");
const FormationPage = () => import("./Pages/FormationPage/FormationPage.svelte");
const GlassSurfacePage = () => import("./Pages/GlassSurfacePage/GlassSurfacePage.svelte");
const HoverCardPage = () => import("./Pages/HoverCardPage/HoverCardPage.svelte");
const IciclePage = () => import("./Pages/IciclePage/IciclePage.svelte");
const ImageSwitcherPage = () => import("./Pages/ImageSwitcherPage/ImageSwitcherPage.svelte");
const LabelPage = () => import("./Pages/LabelPage/LabelPage.svelte");
const ListboxPage = () => import("./Pages/ListboxPage/ListboxPage.svelte");
const MenubarPage = () => import("./Pages/MenubarPage/MenubarPage.svelte");
const FanMenuPage = () => import("./Pages/Menus/FanMenuPage/FanMenuPage.svelte");
const MenuPage = () => import("./Pages/Menus/MenuPage/MenuPage.svelte");
const WheelMenuPage = () => import("./Pages/Menus/WheelMenuPage/WheelMenuPage.svelte");
const ModalPage = () => import("./Pages/ModalPage/ModalPage.svelte");
const ElementMosaicPage = () => import("./Pages/Mosaics/ElementMosaicPage/ElementMosaicPage.svelte");
const ImageMosaicPage = () => import("./Pages/Mosaics/ImageMosaicPage/ImageMosaicPage.svelte");
const MultiSelectPage = () => import("./Pages/MultiSelectPage/MultiSelectPage.svelte");
const NumberInputPage = () => import("./Pages/NumberInputPage/NumberInputPage.svelte");
const FittedTextPage = () => import("./Pages/FittedTextPage/FittedTextPage.svelte");
const MorphTextPage = () => import("./Pages/MorphTextPage/MorphTextPage.svelte");
const SlotTextPage = () => import("./Pages/SlotTextPage/SlotTextPage.svelte");
const PaintedTextPage = () => import("./Pages/PaintedTextPage/PaintedTextPage.svelte");
const PaginatorPage = () => import("./Pages/PaginatorPage/PaginatorPage.svelte");
const ProximityTextPage = () => import("./Pages/ProximityTextPage/ProximityTextPage.svelte");
const ParticleFieldPage = () => import("./Pages/ParticleFieldPage/ParticleFieldPage.svelte");
const ParticleSpawnerPage = () => import("./Pages/ParticleSpawnerPage/ParticleSpawnerPage.svelte");
const PatchBoardPage = () => import("./Pages/PatchBoardPage/PatchBoardPage.svelte");
const LightCatcherPage = () => import("./Pages/PointerEffects/LightCatcherPage/LightCatcherPage.svelte");
const ShadowCasterPage = () => import("./Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.svelte");
const TilterPage = () => import("./Pages/PointerEffects/TilterPage/TilterPage.svelte");
const PreviewPage = () => import("./Pages/PreviewPage/PreviewPage.svelte");
const ProgressPage = () => import("./Pages/ProgressPage/ProgressPage.svelte");
const RadioPage = () => import("./Pages/RadioPage/RadioPage.svelte");
const RangeCalendarPage = () => import("./Pages/RangeCalendarPage/RangeCalendarPage.svelte");
const RangePage = () => import("./Pages/RangePage/RangePage.svelte");
const LensPage = () => import("./Pages/Reveals/LensPage/LensPage.svelte");
const RevealPage = () => import("./Pages/Reveals/RevealPage/RevealPage.svelte");
const ScratchCardPage = () => import("./Pages/Reveals/ScratchCardPage/ScratchCardPage.svelte");
const RichTextPage = () => import("./Pages/RichTextPage/RichTextPage.svelte");
const SVGFiltersPage = () => import("./Pages/SVGFiltersPage/SVGFiltersPage.svelte");
const TimedGradientsPage = () => import("./Pages/SVGGradients/TimedGradientsPage/TimedGradientsPage.svelte");
const TrackedGradientsPage = () => import("./Pages/SVGGradients/TrackedGradientsPage/TrackedGradientsPage.svelte");
const TimedPatternsPage = () => import("./Pages/SVGPatterns/TimedPatternsPage/TimedPatternsPage.svelte");
const TrackedPatternsPage = () => import("./Pages/SVGPatterns/TrackedPatternsPage/TrackedPatternsPage.svelte");
const SatellitePage = () => import("./Pages/SatellitePage/SatellitePage.svelte");
const ScanlineAnimationPage = () => import("./Pages/ScanLineAnimationPage/ScanLineAnimationPage.svelte");
const ScrambleTextPage = () => import("./Pages/ScrambleTextPage/ScrambleTextPage.svelte");
const ScrollerPage = () => import("./Pages/ScrollerPage/ScrollerPage.svelte");
const SegmentedInputPage = () => import("./Pages/SegmentedInputPage/SegmentedInputPage.svelte");
const SelectPage = () => import("./Pages/SelectPage/SelectPage.svelte");
const ShapePage = () => import("./Pages/ShapePage/ShapePage.svelte");
const SidebarPage = () => import("./Pages/SidebarPage/SidebarPage.svelte");
const SlideButtonPage = () => import("./Pages/SlideButtonPage/SlideButtonPage.svelte");
const SortableGridPage = () => import("./Pages/SortableGridPage/SortableGridPage.svelte");
const SortablePage = () => import("./Pages/SortablePage/SortablePage.svelte");
const SplitPanePage = () => import("./Pages/SplitPanePage/SplitPanePage.svelte");
const SpotlightGuidePage = () => import("./Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.svelte");
const SpotlightHintPage = () => import("./Pages/Spotlights/SpotlightHintPage/SpotlightHintPage.svelte");
const SpotlightPromptPage = () => import("./Pages/Spotlights/SpotlightPromptPage/SpotlightPromptPage.svelte");
const StaircasePage = () => import("./Pages/StaircasePage/StaircasePage.svelte");
const StepperPage = () => import("./Pages/StepperPage/StepperPage.svelte");
const SunburstPage = () => import("./Pages/SunburstPage/SunburstPage.svelte");
const SurfacePage = () => import("./Pages/SurfacePage/SurfacePage.svelte");
const TableOfContentsPage = () => import("./Pages/TableOfContentsPage/TableOfContentsPage.svelte");
const TablePage = () => import("./Pages/TablePage/TablePage.svelte");
const TabsPage = () => import("./Pages/TabsPage/TabsPage.svelte");
const TagInputPage = () => import("./Pages/TagInputPage/TagInputPage.svelte");
const TextAreaPage = () => import("./Pages/TextAreaPage/TextAreaPage.svelte");
const TextInputPage = () => import("./Pages/TextInputPage/TextInputPage.svelte");
const TileBoardPage = () => import("./Pages/TileBoardPage/TileBoardPage.svelte");
const TimeInputPage = () => import("./Pages/TimeInputPage/TimeInputPage.svelte");
const TimePickerPage = () => import("./Pages/TimePickerPage/TimePickerPage.svelte");
const TimelinePage = () => import("./Pages/TimelinePage/TimelinePage.svelte");
const ToastsPage = () => import("./Pages/ToastsPage/ToastsPage.svelte");
const TogglePage = () => import("./Pages/TogglePage/TogglePage.svelte");
const ToolbarPage = () => import("./Pages/ToolbarPage/ToolbarPage.svelte");
const TooltipPage = () => import("./Pages/TooltipPage/TooltipPage.svelte");
const TrailPage = () => import("./Pages/TrailPage/TrailPage.svelte");
const WraparoundPage = () => import("./Pages/WraparoundPage/WraparoundPage.svelte");
const TreePage = () => import("./Pages/TreePage/TreePage.svelte");
const TreemapPage = () => import("./Pages/TreemapPage/TreemapPage.svelte");
const TypewriterPage = () => import("./Pages/TypewriterPage/TypewriterPage.svelte");
const ViewportWrapperPage = () => import("./Pages/ViewportWrapperPage/ViewportWrapperPage.svelte");
const DrumWheelPage = () => import("./Pages/Wheels/DrumWheelPage/DrumWheelPage.svelte");
const OverheadWheelPage = () => import("./Pages/Wheels/OverheadWheelPage/OverheadWheelPage.svelte");

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
                component: GlassSurfacePage,
            },
            {
                name: "Surface",
                component: SurfacePage,
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
                        component: AccordionPage,
                    },
                    {
                        name: "Collapsible",
                        component: CollapsiblePage,
                    },
                ],
            },
            {
                name: "Breadcrumbs",
                component: BreadcrumbsPage,
            },
            {
                name: "Buttons",
                children: [
                    {
                        name: "Button",
                        component: ButtonPage,
                    },
                    {
                        name: "SlideButton",
                        component: SlideButtonPage,
                    },
                ],
            },
            {
                name: "Carousel",
                component: CarouselPage,
            },
            {
                name: "EdgeFader",
                component: EdgeFaderPage,
            },
            {
                name: "Form",
                component: FormPage,
            },
            {
                name: "Input",
                children: [
                    {
                        name: "Calendar",
                        component: CalendarPage,
                    },
                    {
                        name: "Checkbox",
                        component: CheckboxPage,
                    },
                    {
                        name: "CheckboxGroup",
                        component: CheckboxGroupPage,
                    },
                    {
                        name: "Clock",
                        component: ClockPage,
                    },
                    {
                        name: "ColorArea",
                        component: ColorAreaPage,
                    },
                    {
                        name: "ColorInput",
                        component: ColorInputPage,
                    },
                    {
                        name: "CurrencyInput",
                        component: CurrencyInputPage,
                    },
                    {
                        name: "DateInput",
                        component: DateInputPage,
                    },
                    {
                        name: "DatePicker",
                        component: DatePickerPage,
                    },
                    {
                        name: "DateRangePicker",
                        component: DateRangePickerPage,
                    },
                    {
                        name: "DateTimePicker",
                        component: DateTimePickerPage,
                    },
                    {
                        name: "FileInput",
                        component: FileInputPage,
                    },
                    {
                        name: "FormField",
                        component: FormFieldPage,
                    },
                    {
                        name: "FormSection",
                        component: FormSectionPage,
                    },
                    {
                        name: "Label",
                        component: LabelPage,
                    },
                    {
                        name: "Listbox",
                        component: ListboxPage,
                    },
                    {
                        name: "MultiSelect",
                        component: MultiSelectPage,
                    },
                    {
                        name: "NumberInput",
                        component: NumberInputPage,
                    },
                    {
                        name: "Radio",
                        component: RadioPage,
                    },
                    {
                        name: "Range",
                        component: RangePage,
                    },
                    {
                        name: "RangeCalendar",
                        component: RangeCalendarPage,
                    },
                    {
                        name: "SegmentedInput",
                        component: SegmentedInputPage,
                    },
                    {
                        name: "Select",
                        component: SelectPage,
                    },
                    {
                        name: "TagInput",
                        component: TagInputPage,
                    },
                    {
                        name: "TextArea",
                        component: TextAreaPage,
                    },
                    {
                        name: "TextInput",
                        component: TextInputPage,
                    },
                    {
                        name: "TimeInput",
                        component: TimeInputPage,
                    },
                    {
                        name: "TimePicker",
                        component: TimePickerPage,
                    },
                    {
                        name: "Toggle",
                        component: TogglePage,
                    },
                ],
            },
            {
                name: "MediaSwitchers",
                children: [
                    {
                        name: "AudioSwitcher",
                        component: AudioSwitcherPage,
                    },
                    {
                        name: "ImageSwitcher",
                        component: ImageSwitcherPage,
                    },
                ],
            },
            {
                name: "Menubar",
                component: MenubarPage,
            },
            {
                name: "Menus",
                children: [
                    {
                        name: "FanMenu",
                        component: FanMenuPage,
                    },
                    {
                        name: "Menu",
                        component: MenuPage,
                    },
                    {
                        name: "WheelMenu",
                        component: WheelMenuPage,
                    },
                ],
            },
            {
                name: "Overlays",
                children: [
                    {
                        name: "Drawer",
                        component: DrawerPage,
                    },
                    {
                        name: "HoverCard",
                        component: HoverCardPage,
                    },
                    {
                        name: "Modal",
                        component: ModalPage,
                    },
                    {
                        name: "Sidebar",
                        component: SidebarPage,
                    },
                    {
                        name: "Spotlights",
                        children: [
                            {
                                name: "SpotlightGuide",
                                component: SpotlightGuidePage,
                            },
                            {
                                name: "SpotlightHint",
                                component: SpotlightHintPage,
                            },
                            {
                                name: "SpotlightPrompt",
                                component: SpotlightPromptPage,
                            },
                        ],
                    },
                    {
                        name: "Toasts",
                        component: ToastsPage,
                    },
                    {
                        name: "Tooltip",
                        component: TooltipPage,
                    },
                ],
            },
            {
                name: "Paginator",
                component: PaginatorPage,
            },
            {
                name: "Preview",
                component: PreviewPage,
            },
            {
                name: "Progress",
                component: ProgressPage,
            },
            {
                name: "Scroller",
                component: ScrollerPage,
            },
            {
                name: "Sortable",
                component: SortablePage,
            },
            {
                name: "SplitPane",
                component: SplitPanePage,
            },
            {
                name: "Stepper",
                component: StepperPage,
            },
            {
                name: "Table",
                component: TablePage,
            },
            {
                name: "TableOfContents",
                component: TableOfContentsPage,
            },
            {
                name: "Tabs",
                component: TabsPage,
            },
            {
                name: "Toolbar",
                component: ToolbarPage,
            },
            {
                name: "Tree",
                component: TreePage,
            },
            {
                name: "ViewportWrapper",
                component: ViewportWrapperPage,
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
                        component: CellAnimationPage,
                    },
                    {
                        name: "ScanlineAnimation",
                        component: ScanlineAnimationPage,
                    },
                ],
            },
            {
                name: "Arrangements",
                children: [
                    {
                        name: "Formation",
                        component: FormationPage,
                    },
                    {
                        name: "Satellite",
                        component: SatellitePage,
                    },
                    {
                        name: "Staircase",
                        component: StaircasePage,
                    },
                ],
            },
            {
                name: "CardStack",
                component: CardStackPage,
            },
            {
                name: "Charts",
                children: [
                    {
                        name: "CirclePacking",
                        component: CirclePackingPage,
                    },
                    {
                        name: "Icicle",
                        component: IciclePage,
                    },
                    {
                        name: "Sunburst",
                        component: SunburstPage,
                    },
                    {
                        name: "Treemap",
                        component: TreemapPage,
                    },
                ],
            },
            {
                name: "Corners",
                component: CornersPage,
            },
            {
                name: "Diagrams",
                children: [
                    {
                        name: "Bracket",
                        component: BracketPage,
                    },
                    {
                        name: "PatchBoard",
                        component: PatchBoardPage,
                    },
                    {
                        name: "Timeline",
                        component: TimelinePage,
                    },
                ],
            },
            {
                name: "Mosaics",
                children: [
                    {
                        name: "ElementMosaic",
                        component: ElementMosaicPage,
                    },
                    {
                        name: "ImageMosaic",
                        component: ImageMosaicPage,
                    },
                ],
            },
            {
                name: "Particles",
                children: [
                    {
                        name: "ParticleField",
                        component: ParticleFieldPage,
                    },
                    {
                        name: "ParticleSpawner",
                        component: ParticleSpawnerPage,
                    },
                ],
            },
            {
                name: "Perspective",
                children: [
                    {
                        name: "Cuboid",
                        component: CuboidPage,
                    },
                    {
                        name: "Die",
                        component: DiePage,
                    },
                    {
                        name: "FlipCard",
                        component: FlipCardPage,
                    },
                    {
                        name: "Flipbook",
                        component: FlipbookPage,
                    },
                ],
            },
            {
                name: "PointerEffects",
                children: [
                    {
                        name: "LightCatcher",
                        component: LightCatcherPage,
                    },
                    {
                        name: "ShadowCaster",
                        component: ShadowCasterPage,
                    },
                    {
                        name: "Tilter",
                        component: TilterPage,
                    },
                ],
            },
            {
                name: "Reveals",
                children: [
                    {
                        name: "Lens",
                        component: LensPage,
                    },
                    {
                        name: "Reveal",
                        component: RevealPage,
                    },
                    {
                        name: "ScratchCard",
                        component: ScratchCardPage,
                    },
                ],
            },
            {
                name: "Shape",
                component: ShapePage,
            },
            {
                name: "SortableGrid",
                component: SortableGridPage,
            },
            {
                name: "Text",
                children: [
                    {
                        name: "FittedText",
                        component: FittedTextPage,
                    },
                    {
                        name: "MorphText",
                        component: MorphTextPage,
                    },
                    {
                        name: "SlotText",
                        component: SlotTextPage,
                    },
                    {
                        name: "PaintedText",
                        component: PaintedTextPage,
                    },
                    {
                        name: "ProximityText",
                        component: ProximityTextPage,
                    },
                    {
                        name: "RichText",
                        component: RichTextPage,
                    },
                    {
                        name: "ScrambleText",
                        component: ScrambleTextPage,
                    },
                    {
                        name: "Typewriter",
                        component: TypewriterPage,
                    },
                ],
            },
            {
                name: "TileBoard",
                component: TileBoardPage,
            },
            {
                name: "Trail",
                component: TrailPage,
            },
            {
                name: "Wheels",
                children: [
                    {
                        name: "DrumWheel",
                        component: DrumWheelPage,
                    },
                    {
                        name: "OverheadWheel",
                        component: OverheadWheelPage,
                    },
                ],
            },
            {
                name: "Wraparound",
                component: WraparoundPage,
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
                        component: SVGFiltersPage,
                    },
                    {
                        name: "SVGGradients",
                        children: [
                            {
                                name: "SVGGradients",
                            },
                            {
                                name: "TimedGradients",
                                component: TimedGradientsPage,
                            },
                            {
                                name: "TrackedGradients",
                                component: TrackedGradientsPage,
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
                                component: TimedPatternsPage,
                            },
                            {
                                name: "TrackedPatterns",
                                component: TrackedPatternsPage,
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
