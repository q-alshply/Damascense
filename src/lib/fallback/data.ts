/**
 * Seed / fallback content. Used verbatim by supabase/seed.sql and served by the
 * query layer whenever Supabase is not yet configured, so the site runs and
 * builds before any backend exists. All of this is editable from /admin later.
 */
import type {
  CategoryRow,
  FounderRow,
  ProductImageRow,
  ProductRow,
  SiteSettingsRow,
} from "@/lib/supabase/types";

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

export const IMAGES = {
  heroMirror: img("1618221195710-dd6b41faaea6"),
  interiorWarm: img("1616486338812-3dadae4b4ace"),
  woodDetail: img("1533090161767-e6ffed986c88"),
  mirrorArch: img("1595515106969-1ce29566ff1c"),
  clockWall: img("1501139083538-0139583c060f"),
  geometry: img("1600607687920-4e2a09cf159d"),
  workshop: img("1504384308090-c894fdcc538d"),
  damascus: img("1571406252241-db0280bd36cd"),
  reflection: img("1524230572899-a752b3835840"),
  pattern: img("1550537687-c91072c4792d"),
};

export const FALLBACK_SETTINGS: SiteSettingsRow = {
  id: true,
  brand_name: "Damascense Studio",
  email: "damascense@gmail.com",
  city: "Damascus",
  country: "Syria",
  instagram_url: null,
  facebook_url: null,
  tiktok_url: null,
  whatsapp_business: null,
  seo_title_en: "Damascense Studio — Contemporary Damascene Decor",
  seo_title_ar: "Damascense Studio — قطع ديكور معاصرة مستوحاة من دمشق",
  seo_description_en:
    "Decorative mirrors, clocks and wooden objects inspired by Damascene visual heritage. Custom dimensions and finishes. Damascus, Syria.",
  seo_description_ar:
    "مرايا وساعات وقطع خشبية ديكورية مستوحاة من الإرث البصري الدمشقي، بقياسات وتشطيبات حسب الطلب. دمشق، سوريا.",
  updated_at: new Date().toISOString(),
};

const now = new Date().toISOString();

export const FALLBACK_CATEGORIES: CategoryRow[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "decorative-mirrors",
    name_en: "Decorative Mirrors",
    name_ar: "مرايا ديكورية",
    description_en:
      "Mirrors framed by geometry drawn from Damascene screens and courtyards — reflective objects that hold light and pattern.",
    description_ar:
      "مرايا تؤطّرها هندسة مستمدة من المشربيات والأفنية الدمشقية، قطع عاكسة تحتفظ بالضوء والنقش.",
    hero_image: IMAGES.mirrorArch,
    sort_order: 1,
    is_visible: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "decorative-clocks",
    name_en: "Decorative Clocks",
    name_ar: "ساعات ديكورية",
    description_en:
      "Wall clocks that treat time as composition — radial pattern, restrained hands and surfaces finished by hand.",
    description_ar:
      "ساعات جدارية تتعامل مع الوقت كتكوين بصري، نقشٌ شعاعي وعقاربُ رصينة وأسطحٌ منجزة يدوياً.",
    hero_image: IMAGES.clockWall,
    sort_order: 2,
    is_visible: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "wooden-crafts",
    name_en: "Wooden Crafts",
    name_ar: "قطع خشبية",
    description_en:
      "Sculptural objects in solid wood — trays, panels and forms that carry inlay logic into a contemporary language.",
    description_ar:
      "قطعٌ نحتية من الخشب الصلب، صوانٍ وألواحٌ وأشكالٌ تنقل منطق التطعيم إلى لغة معاصرة.",
    hero_image: IMAGES.woodDetail,
    sort_order: 3,
    is_visible: true,
    created_at: now,
    updated_at: now,
  },
];

type Seed = Omit<
  ProductRow,
  "id" | "category_id" | "created_at" | "updated_at"
> & { id: string; category_id: string; cover: string; gallery: string[] };

export const FALLBACK_PRODUCTS: Seed[] = [
  // ── Decorative Mirrors ──────────────────────────────────────
  {
    id: "a0000000-0000-0000-0000-000000000001",
    category_id: FALLBACK_CATEGORIES[0].id,
    slug: "najma-arch-mirror",
    name_en: "Najma Arch Mirror",
    name_ar: "مرآة نجمة المقوّسة",
    description_en:
      "An arched mirror whose frame resolves into an eight-point star at the crown. Hand-finished brass edge over stained ash.",
    description_ar:
      "مرآة مقوّسة يتحوّل إطارها إلى نجمة ثمانية عند القمة، بحافة نحاسية منجزة يدوياً فوق خشب الدردار المصبوغ.",
    materials_en: "Stained ash, brushed brass",
    materials_ar: "خشب دردار مصبوغ، نحاس مصقول",
    dimensions: "150 × 90 cm",
    finish_en: "Warm walnut with brushed brass",
    finish_ar: "جوز دافئ مع نحاس مصقول",
    custom_dimensions: true,
    custom_colors: true,
    featured: true,
    status: "published",
    sort_order: 1,
    seo_title_en: "Najma Arch Mirror — Damascense Studio",
    seo_title_ar: "مرآة نجمة المقوّسة — Damascense Studio",
    seo_description_en:
      "Arched decorative mirror with an eight-point star crown in brushed brass and stained ash.",
    seo_description_ar:
      "مرآة ديكورية مقوّسة بتاجٍ نجميّ ثماني من النحاس المصقول وخشب الدردار المصبوغ.",
    cover: IMAGES.mirrorArch,
    gallery: [IMAGES.reflection, IMAGES.interiorWarm],
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    category_id: FALLBACK_CATEGORIES[0].id,
    slug: "mashrabiya-round-mirror",
    name_en: "Mashrabiya Round Mirror",
    name_ar: "مرآة المشربية الدائرية",
    description_en:
      "A circular mirror set behind a turned-wood lattice that casts a shifting shadow pattern through the day.",
    description_ar:
      "مرآة دائرية خلف شبكةٍ من الخشب المخروط تُلقي نقشاً ظلّياً متبدّلاً على مدار النهار.",
    materials_en: "Turned beech, antique mirror glass",
    materials_ar: "خشب زان مخروط، زجاج مرآة عتيق",
    dimensions: "Ø 80 cm",
    finish_en: "Natural beech, oiled",
    finish_ar: "زان طبيعي مزيّت",
    custom_dimensions: true,
    custom_colors: true,
    featured: false,
    status: "published",
    sort_order: 2,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.reflection,
    gallery: [IMAGES.pattern],
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    category_id: FALLBACK_CATEGORIES[0].id,
    slug: "courtyard-panel-mirror",
    name_en: "Courtyard Panel Mirror",
    name_ar: "مرآة لوح الفناء",
    description_en:
      "Three vertical panels echoing the proportions of a Damascene courtyard door, joined by blackened steel hinges.",
    description_ar:
      "ثلاثة ألواح عمودية تحاكي نِسب باب الفناء الدمشقي، تربطها مفصلات فولاذية مؤكسدة.",
    materials_en: "Solid walnut, blackened steel",
    materials_ar: "جوز صلب، فولاذ مؤكسد",
    dimensions: "180 × 120 cm",
    finish_en: "Dark walnut, matte",
    finish_ar: "جوز داكن، مطفأ",
    custom_dimensions: true,
    custom_colors: true,
    featured: true,
    status: "published",
    sort_order: 3,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.interiorWarm,
    gallery: [IMAGES.mirrorArch, IMAGES.damascus],
  },
  {
    id: "a0000000-0000-0000-0000-000000000004",
    category_id: FALLBACK_CATEGORIES[0].id,
    slug: "half-moon-console-mirror",
    name_en: "Half-Moon Console Mirror",
    name_ar: "مرآة الهلال للكونسول",
    description_en:
      "A low, wide mirror shaped as a half moon, intended to sit above a console and widen a narrow entry.",
    description_ar:
      "مرآة منخفضة وعريضة بشكل نصف قمر، تُعلّق فوق الكونسول لتوسيع المدخل الضيّق بصرياً.",
    materials_en: "Oak veneer, bronze leaf",
    materials_ar: "قشرة بلوط، ورق برونز",
    dimensions: "70 × 140 cm",
    finish_en: "Bronze leaf, sealed",
    finish_ar: "ورق برونز، مُحكم",
    custom_dimensions: true,
    custom_colors: true,
    featured: false,
    status: "published",
    sort_order: 4,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.pattern,
    gallery: [IMAGES.reflection],
  },
  // ── Decorative Clocks ───────────────────────────────────────
  {
    id: "b0000000-0000-0000-0000-000000000001",
    category_id: FALLBACK_CATEGORIES[1].id,
    slug: "radial-inlay-clock",
    name_en: "Radial Inlay Clock",
    name_ar: "ساعة التطعيم الشعاعي",
    description_en:
      "A wall clock with a radiating inlay of light and dark wood, marking the hours without numerals.",
    description_ar:
      "ساعة جدارية بتطعيمٍ شعاعي من الخشب الفاتح والداكن، تحدّد الساعات دون أرقام.",
    materials_en: "Maple and walnut inlay, silent movement",
    materials_ar: "تطعيم قيقب وجوز، حركة صامتة",
    dimensions: "Ø 55 cm",
    finish_en: "Natural, satin lacquer",
    finish_ar: "طبيعي، طلاء ساتان",
    custom_dimensions: true,
    custom_colors: true,
    featured: true,
    status: "published",
    sort_order: 1,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.clockWall,
    gallery: [IMAGES.geometry, IMAGES.woodDetail],
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    category_id: FALLBACK_CATEGORIES[1].id,
    slug: "octagon-station-clock",
    name_en: "Octagon Station Clock",
    name_ar: "ساعة المحطة الثمانية",
    description_en:
      "An eight-sided case in solid oak, a nod to the octagonal fountains at the centre of old Damascus houses.",
    description_ar:
      "هيكل ثماني الأضلاع من البلوط الصلب، إشارةٌ إلى النوافير الثمانية في وسط البيوت الدمشقية القديمة.",
    materials_en: "Solid oak, brass hands",
    materials_ar: "بلوط صلب، عقارب نحاسية",
    dimensions: "48 × 48 cm",
    finish_en: "Smoked oak",
    finish_ar: "بلوط مدخّن",
    custom_dimensions: true,
    custom_colors: true,
    featured: false,
    status: "published",
    sort_order: 2,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.geometry,
    gallery: [IMAGES.clockWall],
  },
  {
    id: "b0000000-0000-0000-0000-000000000003",
    category_id: FALLBACK_CATEGORIES[1].id,
    slug: "pendulum-column-clock",
    name_en: "Pendulum Column Clock",
    name_ar: "ساعة العمود بالبندول",
    description_en:
      "A tall, narrow clock read like a column, its exposed pendulum swinging over a carved base.",
    description_ar:
      "ساعة طويلة ونحيلة تُقرأ كعمود، بندولها المكشوف يتأرجح فوق قاعدة محفورة.",
    materials_en: "Ash, glass, brass pendulum",
    materials_ar: "دردار، زجاج، بندول نحاسي",
    dimensions: "120 × 28 cm",
    finish_en: "Pale ash, clear oil",
    finish_ar: "دردار فاتح، زيت شفّاف",
    custom_dimensions: true,
    custom_colors: true,
    featured: true,
    status: "published",
    sort_order: 3,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.woodDetail,
    gallery: [IMAGES.geometry, IMAGES.workshop],
  },
  {
    id: "b0000000-0000-0000-0000-000000000004",
    category_id: FALLBACK_CATEGORIES[1].id,
    slug: "quarter-face-clock",
    name_en: "Quarter Face Clock",
    name_ar: "ساعة الوجه الربعي",
    description_en:
      "A square face divided into four quarters of contrasting grain, each quarter a different cut of the same board.",
    description_ar:
      "وجهٌ مربّع مقسّم إلى أربعة أرباع من عروقٍ متباينة، كل ربعٍ قصّةٌ مختلفة من اللوح نفسه.",
    materials_en: "Book-matched walnut",
    materials_ar: "جوز متناظر القص",
    dimensions: "40 × 40 cm",
    finish_en: "Natural walnut, wax",
    finish_ar: "جوز طبيعي، شمع",
    custom_dimensions: true,
    custom_colors: true,
    featured: false,
    status: "published",
    sort_order: 4,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.pattern,
    gallery: [IMAGES.woodDetail],
  },
  // ── Wooden Crafts ───────────────────────────────────────────
  {
    id: "c0000000-0000-0000-0000-000000000001",
    category_id: FALLBACK_CATEGORIES[2].id,
    slug: "sadu-serving-tray",
    name_en: "Geometric Serving Tray",
    name_ar: "صينية تقديم هندسية",
    description_en:
      "A serving tray with a marquetry field of interlocking stars, sealed for daily use.",
    description_ar:
      "صينية تقديم بحقلٍ من التطعيم على شكل نجومٍ متشابكة، مُحكمة للاستخدام اليومي.",
    materials_en: "Walnut, maple, lemonwood marquetry",
    materials_ar: "تطعيم جوز وقيقب وخشب ليمون",
    dimensions: "50 × 35 × 5 cm",
    finish_en: "Food-safe hardwax oil",
    finish_ar: "زيت شمعي آمن غذائياً",
    custom_dimensions: true,
    custom_colors: true,
    featured: true,
    status: "published",
    sort_order: 1,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.woodDetail,
    gallery: [IMAGES.pattern, IMAGES.workshop],
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    category_id: FALLBACK_CATEGORIES[2].id,
    slug: "muqarnas-wall-panel",
    name_en: "Muqarnas Wall Panel",
    name_ar: "لوح جداري مقرنص",
    description_en:
      "A carved relief panel abstracting the stepped geometry of muqarnas vaulting into a single plane.",
    description_ar:
      "لوحٌ نافر محفور يختزل هندسة المقرنصات المتدرّجة في مستوٍ واحد.",
    materials_en: "Carved lime wood",
    materials_ar: "خشب زيزفون محفور",
    dimensions: "100 × 60 cm",
    finish_en: "Raw, hand-sanded",
    finish_ar: "خام، مصقول يدوياً",
    custom_dimensions: true,
    custom_colors: true,
    featured: false,
    status: "published",
    sort_order: 2,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.geometry,
    gallery: [IMAGES.woodDetail],
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    category_id: FALLBACK_CATEGORIES[2].id,
    slug: "courtyard-side-table",
    name_en: "Courtyard Side Table",
    name_ar: "طاولة جانبية للفناء",
    description_en:
      "A hexagonal side table with an inlaid top, light enough to move around the room with one hand.",
    description_ar:
      "طاولة جانبية سداسية بسطحٍ مطعّم، خفيفة بما يكفي لتحريكها بيدٍ واحدة.",
    materials_en: "Oak, bone-coloured resin inlay",
    materials_ar: "بلوط، تطعيم راتنج بلون العظم",
    dimensions: "45 × 45 × 55 cm",
    finish_en: "Clear matte lacquer",
    finish_ar: "طلاء مطفأ شفّاف",
    custom_dimensions: true,
    custom_colors: true,
    featured: true,
    status: "published",
    sort_order: 3,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.interiorWarm,
    gallery: [IMAGES.woodDetail, IMAGES.damascus],
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    category_id: FALLBACK_CATEGORIES[2].id,
    slug: "prayer-bead-bowl",
    name_en: "Turned Vessel",
    name_ar: "وعاء مخروط",
    description_en:
      "A deep turned bowl from a single block, its rim faceted into twelve shallow planes.",
    description_ar:
      "وعاء عميق مخروط من كتلةٍ واحدة، حافته مشكّلة إلى اثني عشر مستوى ضحلاً.",
    materials_en: "Solid olive wood",
    materials_ar: "خشب زيتون صلب",
    dimensions: "Ø 30 × 18 cm",
    finish_en: "Natural, oiled",
    finish_ar: "طبيعي، مزيّت",
    custom_dimensions: true,
    custom_colors: false,
    featured: false,
    status: "published",
    sort_order: 4,
    seo_title_en: null,
    seo_title_ar: null,
    seo_description_en: null,
    seo_description_ar: null,
    cover: IMAGES.pattern,
    gallery: [IMAGES.woodDetail],
  },
];

export const FALLBACK_FOUNDERS: FounderRow[] = [
  {
    id: "f0000000-0000-0000-0000-000000000001",
    name_en: "Mahmoud Fattouh",
    name_ar: "محمود فتوح",
    role_en: "Architect",
    role_ar: "مهندس معماري",
    photo: null,
    sort_order: 1,
  },
  {
    id: "f0000000-0000-0000-0000-000000000002",
    name_en: "Omar Al Morabet",
    name_ar: "عمر المرابط",
    role_en: "Regional Manager at Hublot · Founder of LiftX Advertising",
    role_ar: "المدير الإقليمي لدى Hublot · مؤسس شركة LiftX للإعلانات",
    photo: null,
    sort_order: 2,
  },
];

export function fallbackImagesFor(productId: string): ProductImageRow[] {
  const p = FALLBACK_PRODUCTS.find((x) => x.id === productId);
  if (!p) return [];
  return [p.cover, ...p.gallery].map((path, i) => ({
    id: `${productId}-img-${i}`,
    product_id: productId,
    storage_path: path,
    alt_en: p.name_en,
    alt_ar: p.name_ar,
    sort_order: i,
    is_cover: i === 0,
    created_at: now,
  }));
}

export const FALLBACK_PAGE_CONTENT: Record<string, Record<string, unknown>> = {
  home: {
    hero_image: IMAGES.heroMirror,
  },
  about: {
    intro_image: IMAGES.workshop,
    inspiration_image: IMAGES.damascus,
  },
};
