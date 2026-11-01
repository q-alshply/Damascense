-- Damascense Studio — seed data
-- Run AFTER 0001_init.sql. Safe to re-run (uses fixed UUIDs + upserts).
-- Mirrors src/lib/fallback/data.ts so the CMS starts populated.

-- Ensure the settings singleton exists
insert into site_settings (id) values (true) on conflict (id) do nothing;

-- ── Categories ───────────────────────────────────────────────
insert into categories (id, slug, name_en, name_ar, description_en, description_ar, hero_image, sort_order, is_visible) values
('11111111-1111-1111-1111-111111111111','decorative-mirrors','Decorative Mirrors','مرايا ديكورية',
 'Mirrors framed by geometry drawn from Damascene screens and courtyards — reflective objects that hold light and pattern.',
 'مرايا تؤطّرها هندسة مستمدة من المشربيات والأفنية الدمشقية، قطع عاكسة تحتفظ بالضوء والنقش.',
 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1600',1,true),
('22222222-2222-2222-2222-222222222222','decorative-clocks','Decorative Clocks','ساعات ديكورية',
 'Wall clocks that treat time as composition — radial pattern, restrained hands and surfaces finished by hand.',
 'ساعات جدارية تتعامل مع الوقت كتكوين بصري، نقشٌ شعاعي وعقاربُ رصينة وأسطحٌ منجزة يدوياً.',
 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&q=80&w=1600',2,true),
('33333333-3333-3333-3333-333333333333','wooden-crafts','Wooden Crafts','قطع خشبية',
 'Sculptural objects in solid wood — trays, panels and forms that carry inlay logic into a contemporary language.',
 'قطعٌ نحتية من الخشب الصلب، صوانٍ وألواحٌ وأشكالٌ تنقل منطق التطعيم إلى لغة معاصرة.',
 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1600',3,true)
on conflict (id) do update set
 name_en=excluded.name_en, name_ar=excluded.name_ar,
 description_en=excluded.description_en, description_ar=excluded.description_ar,
 hero_image=excluded.hero_image, sort_order=excluded.sort_order;

-- ── Products ─────────────────────────────────────────────────
insert into products (id, category_id, slug, name_en, name_ar, description_en, description_ar,
  materials_en, materials_ar, dimensions, finish_en, finish_ar,
  custom_dimensions, custom_colors, featured, status, sort_order) values
('a0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','najma-arch-mirror','Najma Arch Mirror','مرآة نجمة المقوّسة',
 'An arched mirror whose frame resolves into an eight-point star at the crown. Hand-finished brass edge over stained ash.',
 'مرآة مقوّسة يتحوّل إطارها إلى نجمة ثمانية عند القمة، بحافة نحاسية منجزة يدوياً فوق خشب الدردار المصبوغ.',
 'Stained ash, brushed brass','خشب دردار مصبوغ، نحاس مصقول','150 × 90 cm','Warm walnut with brushed brass','جوز دافئ مع نحاس مصقول',
 true,true,true,'published',1),
('a0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','mashrabiya-round-mirror','Mashrabiya Round Mirror','مرآة المشربية الدائرية',
 'A circular mirror set behind a turned-wood lattice that casts a shifting shadow pattern through the day.',
 'مرآة دائرية خلف شبكةٍ من الخشب المخروط تُلقي نقشاً ظلّياً متبدّلاً على مدار النهار.',
 'Turned beech, antique mirror glass','خشب زان مخروط، زجاج مرآة عتيق','Ø 80 cm','Natural beech, oiled','زان طبيعي مزيّت',
 true,true,false,'published',2),
('a0000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','courtyard-panel-mirror','Courtyard Panel Mirror','مرآة لوح الفناء',
 'Three vertical panels echoing the proportions of a Damascene courtyard door, joined by blackened steel hinges.',
 'ثلاثة ألواح عمودية تحاكي نِسب باب الفناء الدمشقي، تربطها مفصلات فولاذية مؤكسدة.',
 'Solid walnut, blackened steel','جوز صلب، فولاذ مؤكسد','180 × 120 cm','Dark walnut, matte','جوز داكن، مطفأ',
 true,true,true,'published',3),
('a0000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','half-moon-console-mirror','Half-Moon Console Mirror','مرآة الهلال للكونسول',
 'A low, wide mirror shaped as a half moon, intended to sit above a console and widen a narrow entry.',
 'مرآة منخفضة وعريضة بشكل نصف قمر، تُعلّق فوق الكونسول لتوسيع المدخل الضيّق بصرياً.',
 'Oak veneer, bronze leaf','قشرة بلوط، ورق برونز','70 × 140 cm','Bronze leaf, sealed','ورق برونز، مُحكم',
 true,true,false,'published',4),
('b0000000-0000-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','radial-inlay-clock','Radial Inlay Clock','ساعة التطعيم الشعاعي',
 'A wall clock with a radiating inlay of light and dark wood, marking the hours without numerals.',
 'ساعة جدارية بتطعيمٍ شعاعي من الخشب الفاتح والداكن، تحدّد الساعات دون أرقام.',
 'Maple and walnut inlay, silent movement','تطعيم قيقب وجوز، حركة صامتة','Ø 55 cm','Natural, satin lacquer','طبيعي، طلاء ساتان',
 true,true,true,'published',1),
('b0000000-0000-0000-0000-000000000002','22222222-2222-2222-2222-222222222222','octagon-station-clock','Octagon Station Clock','ساعة المحطة الثمانية',
 'An eight-sided case in solid oak, a nod to the octagonal fountains at the centre of old Damascus houses.',
 'هيكل ثماني الأضلاع من البلوط الصلب، إشارةٌ إلى النوافير الثمانية في وسط البيوت الدمشقية القديمة.',
 'Solid oak, brass hands','بلوط صلب، عقارب نحاسية','48 × 48 cm','Smoked oak','بلوط مدخّن',
 true,true,false,'published',2),
('b0000000-0000-0000-0000-000000000003','22222222-2222-2222-2222-222222222222','pendulum-column-clock','Pendulum Column Clock','ساعة العمود بالبندول',
 'A tall, narrow clock read like a column, its exposed pendulum swinging over a carved base.',
 'ساعة طويلة ونحيلة تُقرأ كعمود، بندولها المكشوف يتأرجح فوق قاعدة محفورة.',
 'Ash, glass, brass pendulum','دردار، زجاج، بندول نحاسي','120 × 28 cm','Pale ash, clear oil','دردار فاتح، زيت شفّاف',
 true,true,true,'published',3),
('b0000000-0000-0000-0000-000000000004','22222222-2222-2222-2222-222222222222','quarter-face-clock','Quarter Face Clock','ساعة الوجه الربعي',
 'A square face divided into four quarters of contrasting grain, each quarter a different cut of the same board.',
 'وجهٌ مربّع مقسّم إلى أربعة أرباع من عروقٍ متباينة، كل ربعٍ قصّةٌ مختلفة من اللوح نفسه.',
 'Book-matched walnut','جوز متناظر القص','40 × 40 cm','Natural walnut, wax','جوز طبيعي، شمع',
 true,true,false,'published',4),
('c0000000-0000-0000-0000-000000000001','33333333-3333-3333-3333-333333333333','sadu-serving-tray','Geometric Serving Tray','صينية تقديم هندسية',
 'A serving tray with a marquetry field of interlocking stars, sealed for daily use.',
 'صينية تقديم بحقلٍ من التطعيم على شكل نجومٍ متشابكة، مُحكمة للاستخدام اليومي.',
 'Walnut, maple, lemonwood marquetry','تطعيم جوز وقيقب وخشب ليمون','50 × 35 × 5 cm','Food-safe hardwax oil','زيت شمعي آمن غذائياً',
 true,true,true,'published',1),
('c0000000-0000-0000-0000-000000000002','33333333-3333-3333-3333-333333333333','muqarnas-wall-panel','Muqarnas Wall Panel','لوح جداري مقرنص',
 'A carved relief panel abstracting the stepped geometry of muqarnas vaulting into a single plane.',
 'لوحٌ نافر محفور يختزل هندسة المقرنصات المتدرّجة في مستوٍ واحد.',
 'Carved lime wood','خشب زيزفون محفور','100 × 60 cm','Raw, hand-sanded','خام، مصقول يدوياً',
 true,true,false,'published',2),
('c0000000-0000-0000-0000-000000000003','33333333-3333-3333-3333-333333333333','courtyard-side-table','Courtyard Side Table','طاولة جانبية للفناء',
 'A hexagonal side table with an inlaid top, light enough to move around the room with one hand.',
 'طاولة جانبية سداسية بسطحٍ مطعّم، خفيفة بما يكفي لتحريكها بيدٍ واحدة.',
 'Oak, bone-coloured resin inlay','بلوط، تطعيم راتنج بلون العظم','45 × 45 × 55 cm','Clear matte lacquer','طلاء مطفأ شفّاف',
 true,true,true,'published',3),
('c0000000-0000-0000-0000-000000000004','33333333-3333-3333-3333-333333333333','prayer-bead-bowl','Turned Vessel','وعاء مخروط',
 'A deep turned bowl from a single block, its rim faceted into twelve shallow planes.',
 'وعاء عميق مخروط من كتلةٍ واحدة، حافته مشكّلة إلى اثني عشر مستوى ضحلاً.',
 'Solid olive wood','خشب زيتون صلب','Ø 30 × 18 cm','Natural, oiled','طبيعي، مزيّت',
 true,false,false,'published',4)
on conflict (id) do update set
 name_en=excluded.name_en, name_ar=excluded.name_ar, status=excluded.status,
 description_en=excluded.description_en, description_ar=excluded.description_ar,
 featured=excluded.featured, sort_order=excluded.sort_order;

-- ── Product images (placeholder URLs — replace via the CMS) ───
insert into product_images (product_id, storage_path, alt_en, alt_ar, sort_order, is_cover)
select p.id,
  'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1600',
  p.name_en, p.name_ar, 0, true
from products p
where not exists (select 1 from product_images pi where pi.product_id = p.id);

-- ── Founders ─────────────────────────────────────────────────
insert into founders (id, name_en, name_ar, role_en, role_ar, sort_order) values
('f0000000-0000-0000-0000-000000000001','Mahmoud Fattouh','محمود فتوح','Architect','مهندس معماري',1),
('f0000000-0000-0000-0000-000000000002','Omar Al Morabet','عمر المرابط',
 'Regional Manager at Hublot · Founder of LiftX Advertising',
 'المدير الإقليمي لدى Hublot · مؤسس شركة LiftX للإعلانات',2)
on conflict (id) do update set
 name_en=excluded.name_en, role_en=excluded.role_en,
 name_ar=excluded.name_ar, role_ar=excluded.role_ar;

-- ── Page content slots ───────────────────────────────────────
insert into page_content (key, data) values
('home', '{"hero_image":"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"}'),
('about','{"intro_image":"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600","inspiration_image":"https://images.unsplash.com/photo-1571406252241-db0280bd36cd?auto=format&fit=crop&q=80&w=1600","founded_year":"2026"}')
on conflict (key) do nothing;
