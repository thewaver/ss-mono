import type { DependencyNames } from "virtual:component-dependencies";

import { SHOW_COMPOSITES } from "@thewaver/ss-playground/App/App.const";

import type { MenuBranchConfig } from "./App.types";

export { GETTING_STARTED_ROUTE, GALLERY_ROUTE } from "@thewaver/ss-playground/App/App.const";
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

const AccordionPage = () => import("./Pages/Accordions/AccordionPage/AccordionPage.vue");
const CollapsiblePage = () => import("./Pages/Accordions/CollapsiblePage/CollapsiblePage.vue");
const AudioSwitcherPage = () => import("./Pages/AudioSwitcherPage/AudioSwitcherPage.vue");
const BracketPage = () => import("./Pages/BracketPage/BracketPage.vue");
const BreadcrumbsPage = () => import("./Pages/BreadcrumbsPage/BreadcrumbsPage.vue");
const ButtonPage = () => import("./Pages/ButtonPage/ButtonPage.vue");
const CalendarPage = () => import("./Pages/CalendarPage/CalendarPage.vue");
const CardStackPage = () => import("./Pages/CardStackPage/CardStackPage.vue");
const CarouselPage = () => import("./Pages/Carousels/CarouselPage/CarouselPage.vue");
const CellAnimationPage = () => import("./Pages/CellAnimationPage/CellAnimationPage.vue");
const CheckboxGroupPage = () => import("./Pages/CheckboxGroupPage/CheckboxGroupPage.vue");
const CheckboxPage = () => import("./Pages/CheckboxPage/CheckboxPage.vue");
const CirclePackingPage = () => import("./Pages/CirclePackingPage/CirclePackingPage.vue");
const ClockPage = () => import("./Pages/ClockPage/ClockPage.vue");
const ColorAreaPage = () => import("./Pages/ColorAreaPage/ColorAreaPage.vue");
const ColorInputPage = () => import("./Pages/ColorInputPage/ColorInputPage.vue");
const CornersPage = () => import("./Pages/CornersPage/CornersPage.vue");
const CuboidPage = () => import("./Pages/CuboidPage/CuboidPage.vue");
const CurrencyInputPage = () => import("./Pages/CurrencyInputPage/CurrencyInputPage.vue");
const DateInputPage = () => import("./Pages/DateInputPage/DateInputPage.vue");
const DatePickerPage = () => import("./Pages/DatePickerPage/DatePickerPage.vue");
const DateRangePickerPage = () => import("./Pages/DateRangePickerPage/DateRangePickerPage.vue");
const DateTimePickerPage = () => import("./Pages/DateTimePickerPage/DateTimePickerPage.vue");
const DiePage = () => import("./Pages/DiePage/DiePage.vue");
const DrawerPage = () => import("./Pages/DrawerPage/DrawerPage.vue");
const EdgeFaderPage = () => import("./Pages/EdgeFaderPage/EdgeFaderPage.vue");
const FileInputPage = () => import("./Pages/FileInputPage/FileInputPage.vue");
const FlipCardPage = () => import("./Pages/FlipCardPage/FlipCardPage.vue");
const FlipbookPage = () => import("./Pages/FlipbookPage/FlipbookPage.vue");
const InfiniteCorridorPage = () => import("./Pages/InfiniteCorridorPage/InfiniteCorridorPage.vue");
const FormFieldPage = () => import("./Pages/FormFieldPage/FormFieldPage.vue");
const FormPage = () => import("./Pages/FormPage/FormPage.vue");
const FormSectionPage = () => import("./Pages/FormSectionPage/FormSectionPage.vue");
const FormationPage = () => import("./Pages/FormationPage/FormationPage.vue");
const GlassSurfacePage = () => import("./Pages/GlassSurfacePage/GlassSurfacePage.vue");
const HoverCardPage = () => import("./Pages/HoverCardPage/HoverCardPage.vue");
const IciclePage = () => import("./Pages/IciclePage/IciclePage.vue");
const ImageSwitcherPage = () => import("./Pages/ImageSwitcherPage/ImageSwitcherPage.vue");
const LabelPage = () => import("./Pages/LabelPage/LabelPage.vue");
const ListboxPage = () => import("./Pages/ListboxPage/ListboxPage.vue");
const MenubarPage = () => import("./Pages/MenubarPage/MenubarPage.vue");
const FanMenuPage = () => import("./Pages/Menus/FanMenuPage/FanMenuPage.vue");
const MenuPage = () => import("./Pages/Menus/MenuPage/MenuPage.vue");
const WheelMenuPage = () => import("./Pages/Menus/WheelMenuPage/WheelMenuPage.vue");
const ModalPage = () => import("./Pages/ModalPage/ModalPage.vue");
const ElementMosaicPage = () => import("./Pages/Mosaics/ElementMosaicPage/ElementMosaicPage.vue");
const ImageMosaicPage = () => import("./Pages/Mosaics/ImageMosaicPage/ImageMosaicPage.vue");
const MultiSelectPage = () => import("./Pages/MultiSelectPage/MultiSelectPage.vue");
const NumberInputPage = () => import("./Pages/NumberInputPage/NumberInputPage.vue");
const FittedTextPage = () => import("./Pages/FittedTextPage/FittedTextPage.vue");
const MorphTextPage = () => import("./Pages/MorphTextPage/MorphTextPage.vue");
const SlotTextPage = () => import("./Pages/SlotTextPage/SlotTextPage.vue");
const PaintedTextPage = () => import("./Pages/PaintedTextPage/PaintedTextPage.vue");
const ProximityTextPage = () => import("./Pages/ProximityTextPage/ProximityTextPage.vue");
const PaginatorPage = () => import("./Pages/PaginatorPage/PaginatorPage.vue");
const ParticleFieldPage = () => import("./Pages/ParticleFieldPage/ParticleFieldPage.vue");
const ParticleSpawnerPage = () => import("./Pages/ParticleSpawnerPage/ParticleSpawnerPage.vue");
const PatchBoardPage = () => import("./Pages/PatchBoardPage/PatchBoardPage.vue");
const LightCatcherPage = () => import("./Pages/PointerEffects/LightCatcherPage/LightCatcherPage.vue");
const RGBSplitterPage = () => import("./Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.vue");
const ShadowCasterPage = () => import("./Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.vue");
const TilterPage = () => import("./Pages/PointerEffects/TilterPage/TilterPage.vue");
const PreviewPage = () => import("./Pages/PreviewPage/PreviewPage.vue");
const ProgressPage = () => import("./Pages/ProgressPage/ProgressPage.vue");
const RadioPage = () => import("./Pages/RadioPage/RadioPage.vue");
const RangeCalendarPage = () => import("./Pages/RangeCalendarPage/RangeCalendarPage.vue");
const RangePage = () => import("./Pages/RangePage/RangePage.vue");
const LensPage = () => import("./Pages/Reveals/LensPage/LensPage.vue");
const RevealPage = () => import("./Pages/Reveals/RevealPage/RevealPage.vue");
const ScratchCardPage = () => import("./Pages/Reveals/ScratchCardPage/ScratchCardPage.vue");
const RichTextPage = () => import("./Pages/RichTextPage/RichTextPage.vue");
const SVGFiltersPage = () => import("./Pages/SVGFiltersPage/SVGFiltersPage.vue");
const TimedGradientsPage = () => import("./Pages/SVGGradients/TimedGradientsPage/TimedGradientsPage.vue");
const TrackedGradientsPage = () => import("./Pages/SVGGradients/TrackedGradientsPage/TrackedGradientsPage.vue");
const TimedPatternsPage = () => import("./Pages/SVGPatterns/TimedPatternsPage/TimedPatternsPage.vue");
const TrackedPatternsPage = () => import("./Pages/SVGPatterns/TrackedPatternsPage/TrackedPatternsPage.vue");
const SatellitePage = () => import("./Pages/SatellitePage/SatellitePage.vue");
const ScanlineAnimationPage = () => import("./Pages/ScanLineAnimationPage/ScanLineAnimationPage.vue");
const ScrambleTextPage = () => import("./Pages/ScrambleTextPage/ScrambleTextPage.vue");
const ScrollerPage = () => import("./Pages/ScrollerPage/ScrollerPage.vue");
const SegmentedInputPage = () => import("./Pages/SegmentedInputPage/SegmentedInputPage.vue");
const SelectPage = () => import("./Pages/SelectPage/SelectPage.vue");
const ShapePage = () => import("./Pages/ShapePage/ShapePage.vue");
const SidebarPage = () => import("./Pages/SidebarPage/SidebarPage.vue");
const SlideButtonPage = () => import("./Pages/SlideButtonPage/SlideButtonPage.vue");
const SortableGridPage = () => import("./Pages/SortableGridPage/SortableGridPage.vue");
const SortablePage = () => import("./Pages/SortablePage/SortablePage.vue");
const SplitPanePage = () => import("./Pages/SplitPanePage/SplitPanePage.vue");
const SpotlightGuidePage = () => import("./Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage.vue");
const SpotlightHintPage = () => import("./Pages/Spotlights/SpotlightHintPage/SpotlightHintPage.vue");
const SpotlightPromptPage = () => import("./Pages/Spotlights/SpotlightPromptPage/SpotlightPromptPage.vue");
const StaircasePage = () => import("./Pages/StaircasePage/StaircasePage.vue");
const StepperPage = () => import("./Pages/StepperPage/StepperPage.vue");
const SunburstPage = () => import("./Pages/SunburstPage/SunburstPage.vue");
const SurfacePage = () => import("./Pages/SurfacePage/SurfacePage.vue");
const TableOfContentsPage = () => import("./Pages/TableOfContentsPage/TableOfContentsPage.vue");
const TablePage = () => import("./Pages/TablePage/TablePage.vue");
const TabsPage = () => import("./Pages/TabsPage/TabsPage.vue");
const TagInputPage = () => import("./Pages/TagInputPage/TagInputPage.vue");
const TextAreaPage = () => import("./Pages/TextAreaPage/TextAreaPage.vue");
const TextInputPage = () => import("./Pages/TextInputPage/TextInputPage.vue");
const TileBoardPage = () => import("./Pages/TileBoardPage/TileBoardPage.vue");
const TimeInputPage = () => import("./Pages/TimeInputPage/TimeInputPage.vue");
const TimePickerPage = () => import("./Pages/TimePickerPage/TimePickerPage.vue");
const TimelinePage = () => import("./Pages/TimelinePage/TimelinePage.vue");
const ToastsPage = () => import("./Pages/ToastsPage/ToastsPage.vue");
const TogglePage = () => import("./Pages/TogglePage/TogglePage.vue");
const ToolbarPage = () => import("./Pages/ToolbarPage/ToolbarPage.vue");
const TooltipPage = () => import("./Pages/TooltipPage/TooltipPage.vue");
const TrailPage = () => import("./Pages/TrailPage/TrailPage.vue");
const WraparoundPage = () => import("./Pages/WraparoundPage/WraparoundPage.vue");
const TreePage = () => import("./Pages/TreePage/TreePage.vue");
const TreemapPage = () => import("./Pages/TreemapPage/TreemapPage.vue");
const TypewriterPage = () => import("./Pages/TypewriterPage/TypewriterPage.vue");
const ViewportWrapperPage = () => import("./Pages/ViewportWrapperPage/ViewportWrapperPage.vue");
const DrumWheelPage = () => import("./Pages/Wheels/DrumWheelPage/DrumWheelPage.vue");
const OverheadWheelPage = () => import("./Pages/Wheels/OverheadWheelPage/OverheadWheelPage.vue");

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
                    {
                        name: "InfiniteCorridor",
                        component: InfiniteCorridorPage,
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
                        name: "RGBSplitter",
                        component: RGBSplitterPage,
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
