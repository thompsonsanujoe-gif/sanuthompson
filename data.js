// ---- Content data for Sanu Thompson's portfolio ----

const HERO_SLIDES = [
  { img: 'assets/hero/hero-5.jpg', label: '01 — WEDDINGS' },
  { img: 'assets/hero/hero-1.jpg', label: '02 — PORTRAITS' },
  { img: 'assets/hero/hero-2.jpg', label: '03 — EVERYDAY LIFE' },
  { img: 'assets/hero/hero-3.jpg', label: '04 — COMMERCIAL' },
  { img: 'assets/hero/hero-4.jpg', label: '05 — PLACES' },
];

// category key -> { folder (asset filename prefix), label, count, title, location, description }
const CATEGORIES = {
  weddings: {
    folder: 'weddings', label: 'Weddings', count: 8,
    title: 'Two Families, One Story',
    location: 'Chennai & across South India',
    description: "Documentary wedding coverage built around observation rather than interruption — the ceremony, the portraits, and the quieter in-between moments that end up carrying the most feeling."
  },
  engagements: {
    folder: 'engagements', label: 'Engagements', count: 7,
    title: 'Before the Big Day',
    location: 'Coastal & outdoor locations, South India',
    description: "Pre-wedding sessions shot as their own story rather than a formality — natural light, real locations, and the easy chemistry between two people before the wedding machinery takes over."
  },
  portraits: {
    folder: 'fashion', label: 'Portraits', count: 6,
    title: 'Studio & Editorial',
    location: 'Chennai',
    description: "Styled portrait and editorial work — saree sessions, character studies and moody studio light, made for clients who want a portrait that looks like a decision, not a default."
  },
  family: {
    folder: 'maternity', label: 'Family', count: 11,
    title: 'Maternity & New Beginnings',
    location: 'Chennai',
    description: "Maternity, newborn and family sessions — golden hour silhouettes, quiet indoor light, and the small unposed gestures between people who are about to become a family of one more."
  },
  commercial: {
    folder: 'corporate', label: 'Commercial', count: 7,
    title: 'Brands, Spaces & Events',
    location: 'Chennai',
    description: "Corporate and brand coverage — stage lighting, interiors, and the kind of event photography that's built to be used, not just archived."
  },
  food: {
    folder: 'food', label: 'Food & Product', count: 3,
    title: 'Still Life & Studio',
    location: 'Studio, Chennai',
    description: "Product and food photography for brands who need clean, deliberate studio images — built around color, light and the small details a package or a dish lives or dies by."
  },
  everyday: {
    folder: 'everyday', label: 'Everyday', count: 8,
    title: 'Unscripted Moments',
    location: 'South India & beyond',
    description: "Landscapes, live performance and candid life — the work made with no brief at all, just a camera and the instinct to pay attention to what's in front of it."
  },
  educational: {
    folder: 'educational', label: 'Educational', count: 4,
    title: 'Campus & Community',
    location: 'Chennai',
    description: "Institutional and student-life coverage for schools and colleges — documentary-style photography that captures a campus the way it actually feels to be there."
  },
};

const CATEGORY_ORDER = ['weddings', 'engagements', 'portraits', 'family', 'commercial', 'food', 'everyday', 'educational'];

// Build full image lists per category
function buildImages(folder, count, size) {
  const arr = [];
  for (let i = 1; i <= count; i++) arr.push(`assets/${size}/${folder}-${i}.jpg`);
  return arr;
}
CATEGORY_ORDER.forEach(key => {
  const c = CATEGORIES[key];
  c.images_sm = buildImages(c.folder, c.count, 'portfolio_sm');
  c.images_full = buildImages(c.folder, c.count, 'portfolio');
});

// Selected work tiles on homepage — one hero image per category, asymmetric grid classes
const SELECTED_WORK = [
  { cat: 'weddings', tileClass: 'sg-1', img: CATEGORIES.weddings.images_full[2] },
  { cat: 'family', tileClass: 'sg-2', img: CATEGORIES.family.images_full[7] },
  { cat: 'portraits', tileClass: 'sg-3', img: CATEGORIES.portraits.images_full[0] },
  { cat: 'commercial', tileClass: 'sg-4', img: CATEGORIES.commercial.images_full[1] },
  { cat: 'food', tileClass: 'sg-5', img: CATEGORIES.food.images_full[0] },
  { cat: 'engagements', tileClass: 'sg-6', img: CATEGORIES.engagements.images_full[3] },
  { cat: 'everyday', tileClass: 'sg-7', img: CATEGORIES.everyday.images_full[4] },
];

const FILMS = [
  {
    key: 'wedding', kind: 'WEDDING FILM', title: 'Adidas: A Wedding Ceremony',
    meta: 'Chennai, India · Ceremony film', thumb: 'assets/films/wedding-film.jpg', featured: true
  },
  {
    key: 'corporate', kind: 'CORPORATE FILM', title: 'Busoft: Highlights',
    meta: 'Chennai, India · Brand film', thumb: 'assets/films/corporate-film.jpg'
  },
  {
    key: 'product', kind: 'PRODUCT FILM', title: 'Vritilife — Skincare',
    meta: 'Studio · Product film', thumb: 'assets/films/product-film.jpg'
  },
];
