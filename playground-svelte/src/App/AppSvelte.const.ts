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

const AccordionDocs = () => import("./Pages/Accordions/AccordionPage/AccordionDocs.svelte");
const AudioSwitcherDocs = () => import("./Pages/AudioSwitcherPage/AudioSwitcherDocs.svelte");
const BracketPage = () => import("./Pages/BracketPage/BracketPage.svelte");
const BreadcrumbsDocs = () => import("./Pages/BreadcrumbsPage/BreadcrumbsDocs.svelte");
const ButtonDocs = () => import("./Pages/ButtonPage/ButtonDocs.svelte");
const CalendarDocs = () => import("./Pages/CalendarPage/CalendarDocs.svelte");
const CardStackPage = () => import("./Pages/CardStackPage/CardStackPage.svelte");
const CarouselDocs = () => import("./Pages/Carousels/CarouselPage/CarouselDocs.svelte");
const CellAnimationPage = () => import("./Pages/CellAnimationPage/CellAnimationPage.svelte");
const CheckboxGroupDocs = () => import("./Pages/CheckboxGroupPage/CheckboxGroupDocs.svelte");
const CheckboxDocs = () => import("./Pages/CheckboxPage/CheckboxDocs.svelte");
const CirclePackingPage = () => import("./Pages/CirclePackingPage/CirclePackingPage.svelte");
const ClockDocs = () => import("./Pages/ClockPage/ClockDocs.svelte");
const CollapsibleDocs = () => import("./Pages/Accordions/CollapsiblePage/CollapsibleDocs.svelte");
const ColorAreaDocs = () => import("./Pages/ColorAreaPage/ColorAreaDocs.svelte");
const ColorInputDocs = () => import("./Pages/ColorInputPage/ColorInputDocs.svelte");
const CornerHighlightPage = () => import("./Pages/CornerHighlightPage/CornerHighlightPage.svelte");
const CornerPinPage = () => import("./Pages/CornerPinPage/CornerPinPage.svelte");
const CuboidPage = () => import("./Pages/CuboidPage/CuboidPage.svelte");
const CurrencyInputDocs = () => import("./Pages/CurrencyInputPage/CurrencyInputDocs.svelte");
const DateInputDocs = () => import("./Pages/DateInputPage/DateInputDocs.svelte");
const DatePickerDocs = () => import("./Pages/DatePickerPage/DatePickerDocs.svelte");
const DateRangePickerDocs = () => import("./Pages/DateRangePickerPage/DateRangePickerDocs.svelte");
const DateTimePickerDocs = () => import("./Pages/DateTimePickerPage/DateTimePickerDocs.svelte");
const DiePage = () => import("./Pages/DiePage/DiePage.svelte");
const DrawerDocs = () => import("./Pages/DrawerPage/DrawerDocs.svelte");
const EdgeFaderDocs = () => import("./Pages/EdgeFaderPage/EdgeFaderDocs.svelte");
const FileInputDocs = () => import("./Pages/FileInputPage/FileInputDocs.svelte");
const FlipCardPage = () => import("./Pages/FlipCardPage/FlipCardPage.svelte");
const FlipbookPage = () => import("./Pages/FlipbookPage/FlipbookPage.svelte");
const InfiniteCorridorPage = () => import("./Pages/InfiniteCorridorPage/InfiniteCorridorPage.svelte");
const FormFieldDocs = () => import("./Pages/FormFieldPage/FormFieldDocs.svelte");
const FormDocs = () => import("./Pages/FormPage/FormDocs.svelte");
const FormSectionDocs = () => import("./Pages/FormSectionPage/FormSectionDocs.svelte");
const FormationPage = () => import("./Pages/FormationPage/FormationPage.svelte");
const GlassSurfacePage = () => import("./Pages/GlassSurfacePage/GlassSurfacePage.svelte");
const HoverCardDocs = () => import("./Pages/HoverCardPage/HoverCardDocs.svelte");
const IciclePage = () => import("./Pages/IciclePage/IciclePage.svelte");
const ImageSwitcherDocs = () => import("./Pages/ImageSwitcherPage/ImageSwitcherDocs.svelte");
const LabelDocs = () => import("./Pages/LabelPage/LabelDocs.svelte");
const ListboxDocs = () => import("./Pages/ListboxPage/ListboxDocs.svelte");
const MenubarDocs = () => import("./Pages/MenubarPage/MenubarDocs.svelte");
const CommandPaletteDocs = () => import("./Pages/Menus/CommandPalettePage/CommandPaletteDocs.svelte");
const FanMenuDocs = () => import("./Pages/Menus/FanMenuPage/FanMenuDocs.svelte");
const FlyoutMenuDocs = () => import("./Pages/Menus/FlyoutMenuPage/FlyoutMenuDocs.svelte");
const MenuDocs = () => import("./Pages/Menus/MenuPage/MenuDocs.svelte");
const WheelMenuDocs = () => import("./Pages/Menus/WheelMenuPage/WheelMenuDocs.svelte");
const ModalDocs = () => import("./Pages/ModalPage/ModalDocs.svelte");
const ElementMosaicPage = () => import("./Pages/Mosaics/ElementMosaicPage/ElementMosaicPage.svelte");
const ImageMosaicPage = () => import("./Pages/Mosaics/ImageMosaicPage/ImageMosaicPage.svelte");
const MultiSelectDocs = () => import("./Pages/MultiSelectPage/MultiSelectDocs.svelte");
const NumberInputDocs = () => import("./Pages/NumberInputPage/NumberInputDocs.svelte");
const FittedTextPage = () => import("./Pages/FittedTextPage/FittedTextPage.svelte");
const MorphTextPage = () => import("./Pages/MorphTextPage/MorphTextPage.svelte");
const SlotTextPage = () => import("./Pages/SlotTextPage/SlotTextPage.svelte");
const PaintedTextPage = () => import("./Pages/PaintedTextPage/PaintedTextPage.svelte");
const PaginatorDocs = () => import("./Pages/PaginatorPage/PaginatorDocs.svelte");
const ProximityTextPage = () => import("./Pages/ProximityTextPage/ProximityTextPage.svelte");
const ParticleFieldPage = () => import("./Pages/ParticleFieldPage/ParticleFieldPage.svelte");
const ParticleSpawnerPage = () => import("./Pages/ParticleSpawnerPage/ParticleSpawnerPage.svelte");
const PatchBoardPage = () => import("./Pages/PatchBoardPage/PatchBoardPage.svelte");
const LightCatcherPage = () => import("./Pages/PointerEffects/LightCatcherPage/LightCatcherPage.svelte");
const RGBSplitterPage = () => import("./Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.svelte");
const ShadowCasterPage = () => import("./Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.svelte");
const TilterPage = () => import("./Pages/PointerEffects/TilterPage/TilterPage.svelte");
const PreviewDocs = () => import("./Pages/PreviewPage/PreviewDocs.svelte");
const ProgressDocs = () => import("./Pages/ProgressPage/ProgressDocs.svelte");
const RadioDocs = () => import("./Pages/RadioPage/RadioDocs.svelte");
const RangeCalendarDocs = () => import("./Pages/RangeCalendarPage/RangeCalendarDocs.svelte");
const RangeDocs = () => import("./Pages/RangePage/RangeDocs.svelte");
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
const ScrollerDocs = () => import("./Pages/ScrollerPage/ScrollerDocs.svelte");
const SegmentedInputDocs = () => import("./Pages/SegmentedInputPage/SegmentedInputDocs.svelte");
const SelectDocs = () => import("./Pages/SelectPage/SelectDocs.svelte");
const ShapePage = () => import("./Pages/ShapePage/ShapePage.svelte");
const ShapeRevealPage = () => import("./Pages/ShapeRevealPage/ShapeRevealPage.svelte");
const SidebarDocs = () => import("./Pages/SidebarPage/SidebarDocs.svelte");
const SlideButtonDocs = () => import("./Pages/SlideButtonPage/SlideButtonDocs.svelte");
const SortableGridPage = () => import("./Pages/SortableGridPage/SortableGridPage.svelte");
const SortableDocs = () => import("./Pages/SortablePage/SortableDocs.svelte");
const SplitPaneDocs = () => import("./Pages/SplitPanePage/SplitPaneDocs.svelte");
const SpotlightGuideDocs = () => import("./Pages/Spotlights/SpotlightGuidePage/SpotlightGuideDocs.svelte");
const SpotlightHintDocs = () => import("./Pages/Spotlights/SpotlightHintPage/SpotlightHintDocs.svelte");
const SpotlightPromptDocs = () => import("./Pages/Spotlights/SpotlightPromptPage/SpotlightPromptDocs.svelte");
const StaircasePage = () => import("./Pages/StaircasePage/StaircasePage.svelte");
const StepperDocs = () => import("./Pages/StepperPage/StepperDocs.svelte");
const SunburstPage = () => import("./Pages/SunburstPage/SunburstPage.svelte");
const SurfacePage = () => import("./Pages/SurfacePage/SurfacePage.svelte");
const TableOfContentsDocs = () => import("./Pages/TableOfContentsPage/TableOfContentsDocs.svelte");
const TableDocs = () => import("./Pages/TablePage/TableDocs.svelte");
const TabsDocs = () => import("./Pages/TabsPage/TabsDocs.svelte");
const TagInputDocs = () => import("./Pages/TagInputPage/TagInputDocs.svelte");
const TextAreaDocs = () => import("./Pages/TextAreaPage/TextAreaDocs.svelte");
const TextInputDocs = () => import("./Pages/TextInputPage/TextInputDocs.svelte");
const TileBoardPage = () => import("./Pages/TileBoardPage/TileBoardPage.svelte");
const TimeInputDocs = () => import("./Pages/TimeInputPage/TimeInputDocs.svelte");
const TimePickerDocs = () => import("./Pages/TimePickerPage/TimePickerDocs.svelte");
const TimelinePage = () => import("./Pages/TimelinePage/TimelinePage.svelte");
const ToastsDocs = () => import("./Pages/ToastsPage/ToastsDocs.svelte");
const ToggleDocs = () => import("./Pages/TogglePage/ToggleDocs.svelte");
const ToolbarDocs = () => import("./Pages/ToolbarPage/ToolbarDocs.svelte");
const TooltipDocs = () => import("./Pages/TooltipPage/TooltipDocs.svelte");
const TrailPage = () => import("./Pages/TrailPage/TrailPage.svelte");
const WraparoundPage = () => import("./Pages/WraparoundPage/WraparoundPage.svelte");
const TreeDocs = () => import("./Pages/TreePage/TreeDocs.svelte");
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
                component: ShapeRevealPage,
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
                        docs: AccordionDocs,
                    },
                    {
                        name: "Collapsible",
                        docs: CollapsibleDocs,
                    },
                ],
            },
            {
                name: "Breadcrumbs",
                docs: BreadcrumbsDocs,
            },
            {
                name: "Buttons",
                children: [
                    {
                        name: "Button",
                        docs: ButtonDocs,
                    },
                    {
                        name: "SlideButton",
                        docs: SlideButtonDocs,
                    },
                ],
            },
            {
                name: "Carousel",
                docs: CarouselDocs,
            },
            {
                name: "EdgeFader",
                docs: EdgeFaderDocs,
            },
            {
                name: "Form",
                docs: FormDocs,
            },
            {
                name: "Input",
                children: [
                    {
                        name: "Calendar",
                        docs: CalendarDocs,
                    },
                    {
                        name: "Checkbox",
                        docs: CheckboxDocs,
                    },
                    {
                        name: "CheckboxGroup",
                        docs: CheckboxGroupDocs,
                    },
                    {
                        name: "Clock",
                        docs: ClockDocs,
                    },
                    {
                        name: "ColorArea",
                        docs: ColorAreaDocs,
                    },
                    {
                        name: "ColorInput",
                        docs: ColorInputDocs,
                    },
                    {
                        name: "CurrencyInput",
                        docs: CurrencyInputDocs,
                    },
                    {
                        name: "DateInput",
                        docs: DateInputDocs,
                    },
                    {
                        name: "DatePicker",
                        docs: DatePickerDocs,
                    },
                    {
                        name: "DateRangePicker",
                        docs: DateRangePickerDocs,
                    },
                    {
                        name: "DateTimePicker",
                        docs: DateTimePickerDocs,
                    },
                    {
                        name: "FileInput",
                        docs: FileInputDocs,
                    },
                    {
                        name: "FormField",
                        docs: FormFieldDocs,
                    },
                    {
                        name: "FormSection",
                        docs: FormSectionDocs,
                    },
                    {
                        name: "Label",
                        docs: LabelDocs,
                    },
                    {
                        name: "Listbox",
                        docs: ListboxDocs,
                    },
                    {
                        name: "MultiSelect",
                        docs: MultiSelectDocs,
                    },
                    {
                        name: "NumberInput",
                        docs: NumberInputDocs,
                    },
                    {
                        name: "Radio",
                        docs: RadioDocs,
                    },
                    {
                        name: "Range",
                        docs: RangeDocs,
                    },
                    {
                        name: "RangeCalendar",
                        docs: RangeCalendarDocs,
                    },
                    {
                        name: "SegmentedInput",
                        docs: SegmentedInputDocs,
                    },
                    {
                        name: "Select",
                        docs: SelectDocs,
                    },
                    {
                        name: "TagInput",
                        docs: TagInputDocs,
                    },
                    {
                        name: "TextArea",
                        docs: TextAreaDocs,
                    },
                    {
                        name: "TextInput",
                        docs: TextInputDocs,
                    },
                    {
                        name: "TimeInput",
                        docs: TimeInputDocs,
                    },
                    {
                        name: "TimePicker",
                        docs: TimePickerDocs,
                    },
                    {
                        name: "Toggle",
                        docs: ToggleDocs,
                    },
                ],
            },
            {
                name: "MediaSwitchers",
                children: [
                    {
                        name: "AudioSwitcher",
                        docs: AudioSwitcherDocs,
                    },
                    {
                        name: "ImageSwitcher",
                        docs: ImageSwitcherDocs,
                    },
                ],
            },
            {
                name: "Menubar",
                docs: MenubarDocs,
            },
            {
                name: "Menus",
                children: [
                    {
                        name: "CommandPalette",
                        docs: CommandPaletteDocs,
                    },
                    {
                        name: "FanMenu",
                        docs: FanMenuDocs,
                    },
                    {
                        name: "FlyoutMenu",
                        docs: FlyoutMenuDocs,
                    },
                    {
                        name: "Menu",
                        docs: MenuDocs,
                    },
                    {
                        name: "WheelMenu",
                        docs: WheelMenuDocs,
                    },
                ],
            },
            {
                name: "Overlays",
                children: [
                    {
                        name: "Drawer",
                        docs: DrawerDocs,
                    },
                    {
                        name: "HoverCard",
                        docs: HoverCardDocs,
                    },
                    {
                        name: "Modal",
                        docs: ModalDocs,
                    },
                    {
                        name: "Sidebar",
                        docs: SidebarDocs,
                    },
                    {
                        name: "Spotlights",
                        children: [
                            {
                                name: "SpotlightGuide",
                                docs: SpotlightGuideDocs,
                            },
                            {
                                name: "SpotlightHint",
                                docs: SpotlightHintDocs,
                            },
                            {
                                name: "SpotlightPrompt",
                                docs: SpotlightPromptDocs,
                            },
                        ],
                    },
                    {
                        name: "Toasts",
                        docs: ToastsDocs,
                    },
                    {
                        name: "Tooltip",
                        docs: TooltipDocs,
                    },
                ],
            },
            {
                name: "Paginator",
                docs: PaginatorDocs,
            },
            {
                name: "Preview",
                docs: PreviewDocs,
            },
            {
                name: "Progress",
                docs: ProgressDocs,
            },
            {
                name: "Scroller",
                docs: ScrollerDocs,
            },
            {
                name: "Sortable",
                docs: SortableDocs,
            },
            {
                name: "SplitPane",
                docs: SplitPaneDocs,
            },
            {
                name: "Stepper",
                docs: StepperDocs,
            },
            {
                name: "Table",
                docs: TableDocs,
            },
            {
                name: "TableOfContents",
                docs: TableOfContentsDocs,
            },
            {
                name: "Tabs",
                docs: TabsDocs,
            },
            {
                name: "Toolbar",
                docs: ToolbarDocs,
            },
            {
                name: "Tree",
                docs: TreeDocs,
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
                name: "CornerHighlight",
                component: CornerHighlightPage,
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
                        name: "CornerPin",
                        component: CornerPinPage,
                    },
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
                name: "ViewportWrapper",
                component: ViewportWrapperPage,
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
