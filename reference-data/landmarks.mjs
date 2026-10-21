// Egyptly reference data — transcribed from Egyptly_Egypt_Landmarks_AR.md (v1.0, 2026-10-17).
//
// Rules carried over from the source document:
// - Governorate order follows the discussion order; it is NOT an official tourism ranking.
// - Arabic names are copied from the source. English names are drafts (name_en_reviewed = false).
// - Sources support governorates / groups of landmarks, not each item; every landmark stays
//   access_status = 'unverified' until checked individually.
// - No coordinates, prices, opening hours, travel times or image rights are included — unknown stays unknown.
//
// Landmark tuple: [slug, name_ar, name_en, type, parentSlug?, flags?]
// Types: ancient_site | historic_site | museum | religious | reserve | nature | beach | diving |
//        heritage_area | modern | destination_area
// Flags: special_access (needs permits / licensed operator / expedition), viewed_only (usually seen,
//        not visited on foot), not_single_site (wide area, not one bounded site)

export const SOURCE_DOCUMENT = 'Egyptly_Egypt_Landmarks_AR.md v1.0 (2026-10-17)';

export const governorates = [
  {
    slug: 'red-sea', name_ar: 'محافظة البحر الأحمر', name_en: 'Red Sea',
    note_ar: 'محمية وأورانج باي منطقتان شاطئيتان تجاريتان بجزيرة الجفتون، وليستا جزيرتين مستقلتين. الجونة وسهل حشيش ومكادي وسوما باي وجهات تحتوي مواقع ومنشآت متعددة.',
    sources: [
      ['الغردقة', 'https://www.experienceegypt.eg/en/city/23/hurghada'],
      ['معالم الغردقة البرية', 'https://www.experienceegypt.eg/en/attraction-details/151/on-land'],
      ['مرسى علم', 'https://www.experienceegypt.eg/en/city/21/marsa-alam'],
      ['السياحة الشاطئية', 'https://www.experienceegypt.eg/en/Attraction/19/sun-sea'],
    ],
    destinations: [
      { slug: 'hurghada', name_ar: 'الغردقة', name_en: 'Hurghada', sections: [
        { name_ar: 'الغردقة', name_en: 'Hurghada', items: [
          ['giftun-islands', 'جزر الجفتون الكبير والصغير', 'Big and Little Giftun Islands', 'nature'],
          ['mahmya-beach', 'شاطئ محمية — Mahmya — بجزيرة الجفتون', 'Mahmya Beach (Giftun Island)', 'beach', 'giftun-islands'],
          ['orange-bay', 'أورانج باي — Orange Bay — بجزيرة الجفتون', 'Orange Bay (Giftun Island)', 'beach', 'giftun-islands'],
          ['hurghada-marina', 'مارينا الغردقة', 'Hurghada Marina', 'modern'],
          ['el-dahar-old-market', 'منطقة الدهار والسوق القديم', 'El Dahar and the Old Market', 'heritage_area'],
          ['hurghada-museum', 'متحف الغردقة', 'Hurghada Museum', 'museum'],
          ['hurghada-grand-aquarium', 'جراند أكواريوم الغردقة', 'Hurghada Grand Aquarium', 'modern'],
        ] },
      ] },
      { slug: 'el-gouna-area', name_ar: 'الجونة والمناطق السياحية المحيطة', name_en: 'El Gouna & nearby resort areas', sections: [
        { name_ar: 'الجونة والمناطق السياحية المحيطة', name_en: 'El Gouna & nearby resort areas', items: [
          ['abu-tig-marina', 'أبو تيج مارينا', 'Abu Tig Marina', 'modern'],
          ['el-gouna-downtown', 'داون تاون الجونة', 'El Gouna Downtown', 'modern'],
          ['el-gouna-lagoons', 'لاجونز الجونة', 'El Gouna Lagoons', 'beach'],
          ['sahl-hasheesh', 'سهل حشيش: الساحة والممشى والمنطقة الشاطئية', 'Sahl Hasheesh: square, promenade and beach area', 'destination_area'],
          ['makadi-bay', 'خليج مكادي', 'Makadi Bay', 'destination_area'],
          ['soma-bay', 'سوما باي', 'Soma Bay', 'destination_area'],
          ['utopia-island', 'جزيرة يوتوبيا قبالة منطقة سفاجا', 'Utopia Island (off Safaga)', 'nature'],
        ] },
      ] },
      { slug: 'marsa-alam', name_ar: 'مرسى علم وجنوب البحر الأحمر', name_en: 'Marsa Alam & southern Red Sea', sections: [
        { name_ar: 'مرسى علم وجنوب البحر الأحمر', name_en: 'Marsa Alam & southern Red Sea', items: [
          ['abu-dabbab', 'شاطئ وخليج أبو دباب', 'Abu Dabbab Beach and Bay', 'diving'],
          ['marsa-mubarak', 'مرسى مبارك', 'Marsa Mubarak', 'diving'],
          ['sharm-el-luli', 'شرم اللولي', 'Sharm El Luli', 'beach'],
          ['wadi-el-gemal-reserve', 'محمية وادي الجمال', 'Wadi El Gemal Protected Area', 'reserve'],
          ['wadi-el-gemal-island', 'جزيرة وادي الجمال', 'Wadi El Gemal Island', 'nature'],
          ['qulaan-mangroves', 'شاطئ القلعان ومناطق المانجروف', 'Qulaan Beach and mangroves', 'nature'],
          ['meteor-natural-pool', 'حوض النيزك الطبيعي', 'Meteor natural pool', 'nature'],
          ['samadai-reef', 'شعاب صمداي — Samadai Reef', 'Samadai Reef', 'diving'],
          ['sataya-reef', 'شعاب سطايح — Sataya Reef', 'Sataya Reef', 'diving'],
          ['port-ghalib', 'بورت غالب', 'Port Ghalib', 'modern'],
        ] },
      ] },
      { slug: 'el-quseir', name_ar: 'القصير', name_en: 'El Quseir', sections: [
        { name_ar: 'القصير', name_en: 'El Quseir', items: [
          ['quseir-fortress', 'قلعة القصير', 'El Quseir Fortress', 'historic_site'],
          ['quseir-old-town', 'البلدة القديمة', 'El Quseir Old Town', 'heritage_area'],
          ['quseir-historic-port', 'الميناء التاريخي', 'El Quseir historic port', 'historic_site'],
        ] },
      ] },
    ],
  },
  {
    slug: 'south-sinai', name_ar: 'محافظة جنوب سيناء', name_en: 'South Sinai',
    note_ar: 'مواقع الغوص والمحميات والجبال تُسجل بأنواع منفصلة عن المتاحف ومعالم المدينة. تتغير هيئة الجزيرة البيضاء وإمكانية ظهورها مع المد والجزر.',
    sources: [
      ['الشواطئ والغوص بشرم الشيخ', 'https://www.experienceegypt.eg/en/Attraction-Details/186/beaches-snorkeling-diving'],
      ['المحميات', 'https://www.experienceegypt.eg/en/attraction-details/185/national-parks-protected-areas'],
      ['دهب', 'https://www.experienceegypt.eg/en/city/33/dahab'],
      ['طابا', 'https://www.experienceegypt.eg/en/City/13/taba'],
      ['بوابة جنوب سيناء السياحية', 'https://www.southsinai.gov.eg/Tourist'],
    ],
    destinations: [
      { slug: 'sharm-el-sheikh', name_ar: 'شرم الشيخ ومحيطها', name_en: 'Sharm El Sheikh & surroundings', sections: [
        { name_ar: 'شرم الشيخ ومحيطها', name_en: 'Sharm El Sheikh & surroundings', items: [
          ['ras-mohammed', 'محمية رأس محمد', 'Ras Mohammed National Park', 'reserve'],
          ['white-island', 'الجزيرة البيضاء قبالة رأس محمد', 'White Island (off Ras Mohammed)', 'nature', 'ras-mohammed'],
          ['nabq-reserve', 'محمية نبق والمانجروف', 'Nabq Protected Area and mangroves', 'reserve'],
          ['naama-bay', 'خليج نعمة', 'Naama Bay', 'beach'],
          ['sharks-bay', 'خليج القرش', 'Sharks Bay', 'diving'],
          ['ras-um-sid', 'رأس أم سيد', 'Ras Um Sid', 'diving'],
          ['el-fanar-sharm', 'الفنار', 'El Fanar', 'diving'],
          ['sharm-old-market', 'السوق القديم', 'Sharm Old Market', 'heritage_area'],
          ['al-sahaba-mosque', 'مسجد الصحابة', 'Al Sahaba Mosque', 'religious'],
          ['sharm-museum', 'متحف شرم الشيخ', 'Sharm El Sheikh Museum', 'museum'],
          ['soho-square', 'سوهو سكوير', 'SOHO Square', 'modern'],
        ] },
      ] },
      { slug: 'dahab', name_ar: 'دهب', name_en: 'Dahab', sections: [
        { name_ar: 'دهب', name_en: 'Dahab', items: [
          ['blue-hole', 'البلو هول — Blue Hole', 'Blue Hole', 'diving'],
          ['the-canyon-dahab', 'الكانيون — The Canyon', 'The Canyon (dive site)', 'diving'],
          ['lighthouse-dahab', 'اللايت هاوس — Lighthouse', 'Lighthouse (dive site)', 'diving'],
          ['eel-garden', 'الإيل جاردن — Eel Garden', 'Eel Garden', 'diving'],
          ['dahab-laguna', 'اللاجونا — Laguna', 'Dahab Laguna', 'beach'],
          ['abu-galum', 'محمية أبو جالوم', 'Abu Galum Protected Area', 'reserve'],
          ['blue-lagoon-dahab', 'البلو لاجون — Blue Lagoon', 'Blue Lagoon', 'beach'],
          ['wadi-gnai', 'وادي جُني — Wadi Gnai', 'Wadi Gnai', 'diving'],
        ] },
      ] },
      { slug: 'nuweiba-taba', name_ar: 'نويبع وطابا', name_en: 'Nuweiba & Taba', sections: [
        { name_ar: 'نويبع وطابا', name_en: 'Nuweiba & Taba', items: [
          ['wadi-el-washwashi', 'وادي الوشواشي', 'Wadi El Washwashi', 'nature'],
          ['colored-canyon', 'الكانيون الملون — Colored Canyon', 'Colored Canyon', 'nature'],
          ['taba-reserve', 'محمية طابا', 'Taba Protected Area', 'reserve'],
          ['pharaohs-island', 'جزيرة فرعون وقلعة صلاح الدين', "Pharaoh's Island and Saladin's Castle", 'historic_site'],
          ['fjord-bay', 'فيورد باي — Fjord Bay', 'Fjord Bay', 'diving'],
        ] },
      ] },
      { slug: 'saint-catherine', name_ar: 'سانت كاترين', name_en: 'Saint Catherine', sections: [
        { name_ar: 'سانت كاترين', name_en: 'Saint Catherine', items: [
          ['st-catherine-monastery', 'دير سانت كاترين', "Saint Catherine's Monastery", 'religious'],
          ['mount-sinai', 'جبل موسى — Mount Sinai', 'Mount Sinai (Mount Moses)', 'nature'],
          ['mount-catherine', 'جبل سانت كاترين', 'Mount Saint Catherine', 'nature'],
          ['st-catherine-reserve', 'محمية سانت كاترين', 'Saint Catherine Protected Area', 'reserve'],
        ] },
      ] },
    ],
  },
  {
    slug: 'cairo', name_ar: 'محافظة القاهرة', name_en: 'Cairo',
    note_ar: 'المتحف المصري الكبير والأهرامات يتبعان الجيزة، حتى لو وردا تسويقيًا ضمن برامج زيارة القاهرة.',
    sources: [
      ['القاهرة التاريخية', 'https://www.experienceegypt.eg/en/attraction-details/292/historic-cairo'],
      ['القاهرة والجيزة', 'https://www.experienceegypt.eg/en/city/1/cairo-e-giza'],
      ['المتحف المصري', 'https://egymonuments.gov.eg/museums/egyptian-museum/'],
      ['قصر المنيل', 'https://egymonuments.gov.eg/museums/manial-palace-museum/'],
      ['دليل المتاحف الرسمي', 'https://egymonuments.gov.eg/museums/'],
    ],
    destinations: [
      { slug: 'cairo-city', name_ar: 'القاهرة', name_en: 'Cairo', sections: [
        { name_ar: 'القاهرة الإسلامية', name_en: 'Islamic Cairo', items: [
          ['cairo-citadel', 'قلعة صلاح الدين', 'Saladin Citadel of Cairo', 'historic_site'],
          ['muhammad-ali-mosque', 'مسجد محمد علي', 'Mosque of Muhammad Ali', 'religious', 'cairo-citadel'],
          ['al-nasir-muhammad-mosque', 'جامع الناصر محمد بالقلعة', 'Mosque of al-Nasir Muhammad (Citadel)', 'religious', 'cairo-citadel'],
          ['sultan-hassan-mosque', 'مسجد السلطان حسن', 'Mosque-Madrasa of Sultan Hassan', 'religious'],
          ['al-rifai-mosque', 'مسجد الرفاعي', 'Al-Rifaʿi Mosque', 'religious'],
          ['ibn-tulun-mosque', 'جامع أحمد بن طولون', 'Mosque of Ahmad Ibn Tulun', 'religious'],
          ['al-azhar-mosque', 'الجامع الأزهر', 'Al-Azhar Mosque', 'religious'],
          ['al-hussein-mosque', 'مسجد الحسين', 'Al-Hussein Mosque', 'religious'],
        ] },
        { name_ar: 'القاهرة التاريخية والأسواق', name_en: 'Historic Cairo & markets', items: [
          ['al-muizz-street', 'شارع المعز', 'Al-Muizz Street', 'heritage_area'],
          ['khan-el-khalili', 'خان الخليلي', 'Khan el-Khalili', 'heritage_area'],
          ['bab-al-futuh', 'باب الفتوح', 'Bab al-Futuh', 'historic_site'],
          ['bab-al-nasr', 'باب النصر', 'Bab al-Nasr', 'historic_site'],
          ['bab-zuweila', 'باب زويلة', 'Bab Zuweila', 'historic_site'],
          ['qalawun-complex', 'مجموعة السلطان قلاوون', 'Complex of Sultan Qalawun', 'historic_site'],
          ['barquq-mosque', 'مسجد ومدرسة السلطان برقوق', 'Mosque-Madrasa of Sultan Barquq', 'religious'],
          ['al-aqmar-mosque', 'مسجد الأقمر', 'Al-Aqmar Mosque', 'religious'],
          ['bayt-al-suhaymi', 'بيت السحيمي', 'Bayt al-Suhaymi', 'historic_site'],
          ['darb-al-ahmar', 'منطقة الدرب الأحمر', 'Al-Darb al-Ahmar district', 'heritage_area'],
          ['khayamiya-market', 'سوق الخيامية', 'Khayamiya (Tentmakers) Market', 'heritage_area'],
        ] },
        { name_ar: 'مصر القديمة والمعالم الدينية', name_en: 'Old Cairo & religious landmarks', items: [
          ['hanging-church', 'الكنيسة المعلقة', 'The Hanging Church', 'religious'],
          ['abu-serga-church', 'كنيسة أبي سرجة — القديسين سرجيوس وواخس', 'Church of Saints Sergius and Bacchus (Abu Serga)', 'religious'],
          ['st-george-church-old-cairo', 'كنيسة مار جرجس بمصر القديمة', 'Church of St George, Old Cairo', 'religious'],
          ['ben-ezra-synagogue', 'معبد بن عزرا', 'Ben Ezra Synagogue', 'religious'],
          ['babylon-fortress', 'حصن بابليون', 'Babylon Fortress', 'historic_site'],
          ['amr-ibn-al-as-mosque', 'جامع عمرو بن العاص', 'Mosque of Amr ibn al-As', 'religious'],
          ['cave-church-mokattam', 'دير سمعان الخراز بالمقطم', 'Monastery of St Simon the Tanner, Mokattam', 'religious'],
        ] },
        { name_ar: 'المتاحف والقصور', name_en: 'Museums & palaces', items: [
          ['egyptian-museum-tahrir', 'المتحف المصري بالتحرير', 'Egyptian Museum, Tahrir', 'museum'],
          ['nmec', 'المتحف القومي للحضارة المصرية — NMEC', 'National Museum of Egyptian Civilization (NMEC)', 'museum'],
          ['coptic-museum', 'المتحف القبطي', 'Coptic Museum', 'museum'],
          ['museum-of-islamic-art', 'متحف الفن الإسلامي', 'Museum of Islamic Art', 'museum'],
          ['gayer-anderson-museum', 'متحف جاير أندرسون', 'Gayer-Anderson Museum', 'museum'],
          ['manial-palace', 'قصر الأمير محمد علي بالمنيل', 'Prince Mohamed Ali Palace, Manial', 'museum'],
          ['abdeen-palace-museums', 'متاحف قصر عابدين', 'Abdeen Palace Museums', 'museum'],
          ['baron-palace', 'قصر البارون', 'Baron Empain Palace', 'historic_site'],
          ['royal-carriages-museum', 'متحف المركبات الملكية', 'Royal Carriages Museum', 'museum'],
        ] },
        { name_ar: 'معالم المدينة', name_en: 'City landmarks', items: [
          ['cairo-tower', 'برج القاهرة', 'Cairo Tower', 'modern'],
          ['tahrir-downtown', 'ميدان التحرير ووسط البلد التاريخية', 'Tahrir Square and historic Downtown', 'heritage_area'],
          ['qasr-el-nil-street', 'شارع قصر النيل', 'Qasr El Nil Street', 'heritage_area'],
          ['qasr-el-nil-bridge', 'كوبري قصر النيل', 'Qasr El Nil Bridge', 'modern'],
          ['zamalek', 'الزمالك', 'Zamalek', 'heritage_area'],
          ['cairo-opera-house', 'دار الأوبرا المصرية', 'Cairo Opera House', 'modern'],
          ['al-azhar-park', 'حديقة الأزهر', 'Al-Azhar Park', 'modern'],
          ['roda-nilometer', 'مقياس النيل بالروضة', 'Roda Nilometer', 'historic_site'],
        ] },
      ] },
    ],
  },
  {
    slug: 'giza', name_ar: 'محافظة الجيزة', name_en: 'Giza',
    note_ar: 'الواحات البحرية تابعة للجيزة. انطلاق الرحلة منها إلى الصحراء البيضاء لا يجعل الصحراء البيضاء جزءًا من الجيزة. كما أن متحف المومياوات وموقع اكتشافها ليسا مكانًا واحدًا تلقائيًا.',
    sources: [
      ['الجيزة وعجائبها القديمة', 'https://www.experienceegypt.eg/en/attraction-details/290/giza-ancient-wonders'],
      ['سقارة', 'https://egymonuments.gov.eg/archaeological-sites/saqqara/'],
      ['دهشور', 'https://egymonuments.gov.eg/archaeological-sites/dahshur/'],
      ['المتاحف', 'https://www.experienceegypt.eg/en/attraction/16/museums'],
      ['الواحات البحرية', 'https://www.experienceegypt.eg/en/city/25/al-bahariyya'],
      ['آثار الواحات البحرية', 'https://www.experienceegypt.eg/en/Attraction-Details/221/archeological-sites-of-al-bahariyya'],
    ],
    destinations: [
      { slug: 'giza-pyramids-saqqara', name_ar: 'الجيزة — الأهرامات وسقارة ودهشور', name_en: 'Giza — Pyramids, Saqqara & Dahshur', sections: [
        { name_ar: 'هضبة الأهرامات', name_en: 'Giza Pyramids Plateau', items: [
          ['pyramid-of-khufu', 'هرم خوفو', 'Pyramid of Khufu', 'ancient_site'],
          ['pyramid-of-khafre', 'هرم خفرع', 'Pyramid of Khafre', 'ancient_site'],
          ['pyramid-of-menkaure', 'هرم منكاورع', 'Pyramid of Menkaure', 'ancient_site'],
          ['great-sphinx', 'أبو الهول', 'Great Sphinx', 'ancient_site'],
          ['khafre-valley-temple', 'معبد الوادي لخفرع', 'Valley Temple of Khafre', 'ancient_site'],
          ['queens-pyramids-giza', 'أهرامات الملكات', "Queens' Pyramids", 'ancient_site'],
          ['pyramids-panorama', 'منطقة بانوراما الأهرامات', 'Pyramids Panorama area', 'ancient_site'],
        ] },
        { name_ar: 'المتاحف', name_en: 'Museums', items: [
          ['grand-egyptian-museum', 'المتحف المصري الكبير — GEM', 'Grand Egyptian Museum (GEM)', 'museum'],
          ['imhotep-museum', 'متحف إيمحتب بسقارة', 'Imhotep Museum, Saqqara', 'museum'],
        ] },
        { name_ar: 'سقارة', name_en: 'Saqqara', items: [
          ['step-pyramid-djoser', 'هرم زوسر المدرج ومجموعته الجنائزية', 'Step Pyramid of Djoser and funerary complex', 'ancient_site'],
          ['pyramid-of-unas', 'هرم أوناس', 'Pyramid of Unas', 'ancient_site'],
          ['pyramid-of-teti', 'هرم تيتي', 'Pyramid of Teti', 'ancient_site'],
          ['saqqara-serapeum', 'السرابيوم', 'Serapeum of Saqqara', 'ancient_site'],
          ['mastaba-of-mereruka', 'مصطبة مريروكا', 'Mastaba of Mereruka', 'ancient_site'],
          ['mastaba-of-kagemni', 'مصطبة كاجمني', 'Mastaba of Kagemni', 'ancient_site'],
          ['tomb-of-ti', 'مقبرة تي', 'Tomb of Ti', 'ancient_site'],
          ['tomb-of-ptahhotep', 'مقبرة بتاح حتب', 'Tomb of Ptahhotep', 'ancient_site'],
        ] },
        { name_ar: 'دهشور ومنف', name_en: 'Dahshur & Memphis', items: [
          ['red-pyramid', 'الهرم الأحمر', 'Red Pyramid', 'ancient_site'],
          ['bent-pyramid', 'الهرم المنحني', 'Bent Pyramid', 'ancient_site'],
          ['black-pyramid', 'الهرم الأسود', 'Black Pyramid', 'ancient_site'],
          ['memphis-mit-rahina', 'موقع منف بميت رهينة', 'Memphis site, Mit Rahina', 'ancient_site'],
          ['ramesses-ii-statue-mit-rahina', 'تمثال رمسيس الثاني بميت رهينة', 'Colossus of Ramesses II, Mit Rahina', 'ancient_site'],
          ['alabaster-sphinx', 'أبو الهول المرمر بميت رهينة', 'Alabaster Sphinx, Mit Rahina', 'ancient_site'],
        ] },
      ] },
      { slug: 'bahariya-oasis', name_ar: 'الواحات البحرية', name_en: 'Bahariya Oasis', sections: [
        { name_ar: 'الواحات البحرية', name_en: 'Bahariya Oasis', items: [
          ['bawiti-el-qasr', 'الباويطي والقصر', 'Bawiti and El Qasr', 'heritage_area'],
          ['golden-mummies-museum', 'متحف المومياوات الذهبية', 'Golden Mummies Museum', 'museum'],
          ['qarat-qasr-salim', 'مقابر قارة قصر سليم', 'Qarat Qasr Salim tombs', 'ancient_site'],
          ['gebel-el-ingliz', 'جبل الإنجليز', 'Gebel el-Ingliz (English Mountain)', 'nature'],
          ['ain-el-muftella', 'عين المفتلة', 'Ain el-Muftella', 'ancient_site'],
          ['bahariya-springs', 'العيون والآبار الطبيعية', 'Natural springs and wells', 'nature'],
        ] },
      ] },
    ],
  },
  {
    slug: 'luxor', name_ar: 'محافظة الأقصر', name_en: 'Luxor',
    note_ar: 'المقابر معالم فرعية داخل مواقع أكبر. يُراجع نظام فتح كل مقبرة وتذكرتها قبل إدراجها كزيارة مؤكدة.',
    sources: [
      ['الأقصر', 'https://www.experienceegypt.eg/en/city/22/luxor-'],
      ['البر الغربي', 'https://www.experienceegypt.eg/en/Attraction-Details/300/west-bank'],
      ['دليل المتاحف', 'https://www.experienceegypt.eg/en/Attraction/16/museums'],
    ],
    destinations: [
      { slug: 'luxor-city', name_ar: 'الأقصر', name_en: 'Luxor', sections: [
        { name_ar: 'البر الشرقي', name_en: 'East Bank', items: [
          ['karnak', 'مجمع معابد الكرنك', 'Karnak Temple Complex', 'ancient_site'],
          ['luxor-temple', 'معبد الأقصر', 'Luxor Temple', 'ancient_site'],
          ['avenue-of-sphinxes', 'طريق الكباش', 'Avenue of Sphinxes', 'ancient_site'],
          ['luxor-museum', 'متحف الأقصر', 'Luxor Museum', 'museum'],
          ['mummification-museum', 'متحف التحنيط', 'Mummification Museum', 'museum'],
        ] },
        { name_ar: 'البر الغربي', name_en: 'West Bank', items: [
          ['valley-of-the-kings', 'وادي الملوك', 'Valley of the Kings', 'ancient_site'],
          ['valley-of-the-queens', 'وادي الملكات', 'Valley of the Queens', 'ancient_site'],
          ['hatshepsut-temple', 'معبد حتشبسوت بالدير البحري', 'Temple of Hatshepsut, Deir el-Bahari', 'ancient_site'],
          ['colossi-of-memnon', 'تمثالا ممنون', 'Colossi of Memnon', 'ancient_site'],
          ['medinet-habu', 'معبد مدينة هابو', 'Medinet Habu Temple', 'ancient_site'],
          ['ramesseum', 'الرامسيوم', 'Ramesseum', 'ancient_site'],
          ['deir-el-medina', 'دير المدينة', 'Deir el-Medina', 'ancient_site'],
          ['tombs-of-the-nobles-luxor', 'مقابر النبلاء', 'Tombs of the Nobles (Luxor)', 'ancient_site'],
          ['howard-carter-house', 'بيت هوارد كارتر', 'Howard Carter House', 'museum'],
        ] },
        { name_ar: 'مقابر بارزة داخل المواقع السابقة', name_en: 'Notable tombs inside the sites above', items: [
          ['tomb-of-tutankhamun', 'مقبرة توت عنخ آمون — وادي الملوك', 'Tomb of Tutankhamun (KV62)', 'ancient_site', 'valley-of-the-kings'],
          ['tomb-of-seti-i', 'مقبرة سيتي الأول — وادي الملوك', 'Tomb of Seti I (KV17)', 'ancient_site', 'valley-of-the-kings'],
          ['tomb-of-ramesses-v-vi', 'مقبرة رمسيس الخامس والسادس — وادي الملوك', 'Tomb of Ramesses V and VI (KV9)', 'ancient_site', 'valley-of-the-kings'],
          ['tomb-of-nefertari', 'مقبرة نفرتاري — وادي الملكات', 'Tomb of Nefertari (QV66)', 'ancient_site', 'valley-of-the-queens'],
          ['tomb-of-sennedjem', 'مقبرة سن نجم — دير المدينة', 'Tomb of Sennedjem', 'ancient_site', 'deir-el-medina'],
          ['tomb-of-rekhmire', 'مقبرة رخميرع — مقابر النبلاء', 'Tomb of Rekhmire', 'ancient_site', 'tombs-of-the-nobles-luxor'],
          ['tomb-of-sennefer', 'مقبرة سن نفر — مقابر النبلاء', 'Tomb of Sennefer', 'ancient_site', 'tombs-of-the-nobles-luxor'],
        ] },
      ] },
      { slug: 'esna', name_ar: 'إسنا', name_en: 'Esna', sections: [
        { name_ar: 'إسنا', name_en: 'Esna', items: [
          ['temple-of-khnum', 'معبد خنوم', 'Temple of Khnum, Esna', 'ancient_site'],
          ['esna-historic-market', 'المنطقة التاريخية والسوق القديم', 'Esna historic district and old market', 'heritage_area'],
        ] },
      ] },
    ],
  },
  {
    slug: 'aswan', name_ar: 'محافظة أسوان', name_en: 'Aswan',
    note_ar: 'إدفو وكوم أمبو تابعان لمحافظة أسوان. قصر إبريم يُشاهد عادةً من الرحلات البحرية، ولا يُعامل تلقائيًا كموقع متاح للنزول والزيارة. المقصود بفيلة موقع المعابد الحالي في أجيليكا.',
    sources: [
      ['أسوان وأبو سمبل', 'https://www.experienceegypt.eg/en/city/9/aswan-abu-simbel'],
      ['أسوان القديمة', 'https://www.experienceegypt.eg/en/attraction-details/210/ancient-aswan'],
      ['معالم المدينة', 'https://www.experienceegypt.eg/en/Attraction-Details/211/the-city'],
      ['أبو سمبل ومعابد النوبة', 'https://www.experienceegypt.eg/en/attraction-details/208/abu-simbel-the-nubian-temples-downstream'],
    ],
    destinations: [
      { slug: 'aswan-city', name_ar: 'أسوان', name_en: 'Aswan', sections: [
        { name_ar: 'مدينة أسوان والجزر', name_en: 'Aswan city & islands', items: [
          ['philae', 'معابد فيلة بجزيرة أجيليكا', 'Philae temples (Agilkia Island)', 'ancient_site'],
          ['unfinished-obelisk', 'المسلة الناقصة', 'Unfinished Obelisk', 'ancient_site'],
          ['elephantine-island', 'جزيرة إلفنتين وآثارها', 'Elephantine Island and its antiquities', 'ancient_site'],
          ['aswan-museum', 'متحف أسوان', 'Aswan Museum', 'museum'],
          ['nubian-museum', 'متحف النوبة', 'Nubian Museum', 'museum'],
          ['botanical-island', 'جزيرة النباتات', 'Aswan Botanical Island (Kitchener’s Island)', 'nature'],
          ['sehel-island', 'جزيرة سهيل ولوحة المجاعة', 'Sehel Island and the Famine Stela', 'ancient_site'],
        ] },
        { name_ar: 'الضفة الغربية والنوبة', name_en: 'West Bank & Nubia', items: [
          ['qubbet-el-hawa', 'مقابر النبلاء بقبة الهوا', 'Tombs of the Nobles, Qubbet el-Hawa', 'ancient_site'],
          ['monastery-st-simeon', 'دير الأنبا هدرا', 'Monastery of St Simeon (Anba Hadra)', 'religious'],
          ['aga-khan-mausoleum', 'ضريح الأغا خان', 'Mausoleum of the Aga Khan', 'religious'],
          ['nubian-villages', 'القرى النوبية، ومنها غرب سهيل', 'Nubian villages, including Gharb Soheil', 'heritage_area'],
        ] },
        { name_ar: 'معالم حديثة وطبيعية', name_en: 'Modern & natural landmarks', items: [
          ['aswan-high-dam', 'السد العالي', 'Aswan High Dam', 'modern'],
          ['aswan-low-dam', 'خزان أسوان', 'Aswan Low Dam', 'modern'],
          ['lake-nasser', 'بحيرة ناصر', 'Lake Nasser', 'nature'],
          ['aswan-souq', 'السوق السياحي', 'Aswan tourist market (souq)', 'heritage_area'],
          ['old-cataract-hotel', 'فندق أولد كتراكت باعتباره معلمًا تاريخيًا؛ دخول مرافقه يخضع لسياسة المنشأة', 'Old Cataract Hotel (historic landmark; access to facilities follows hotel policy)', 'historic_site', null, ['special_access']],
        ] },
      ] },
      { slug: 'edfu-kom-ombo', name_ar: 'شمال محافظة أسوان — إدفو وكوم أمبو', name_en: 'Northern Aswan — Edfu & Kom Ombo', sections: [
        { name_ar: 'شمال المحافظة', name_en: 'North of the governorate', items: [
          ['edfu-temple', 'معبد إدفو', 'Temple of Edfu', 'ancient_site'],
          ['kom-ombo-temple', 'معبد كوم أمبو', 'Temple of Kom Ombo', 'ancient_site'],
          ['crocodile-museum', 'متحف التماسيح', 'Crocodile Museum, Kom Ombo', 'museum'],
          ['gebel-el-silsila', 'جبل السلسلة', 'Gebel el-Silsila', 'ancient_site'],
        ] },
      ] },
      { slug: 'abu-simbel-lake-nasser', name_ar: 'أبو سمبل ومعابد بحيرة ناصر', name_en: 'Abu Simbel & Lake Nasser temples', sections: [
        { name_ar: 'أبو سمبل ومعابد بحيرة ناصر', name_en: 'Abu Simbel & Lake Nasser temples', items: [
          ['abu-simbel-great-temple', 'معبد أبو سمبل الكبير', 'Great Temple of Abu Simbel', 'ancient_site'],
          ['abu-simbel-small-temple', 'معبد أبو سمبل الصغير', 'Small Temple of Abu Simbel', 'ancient_site'],
          ['kalabsha-temple', 'معبد كلابشة', 'Temple of Kalabsha', 'ancient_site'],
          ['beit-el-wali', 'معبد بيت الوالي', 'Temple of Beit el-Wali', 'ancient_site'],
          ['kiosk-of-qertassi', 'كشك قرطاسي', 'Kiosk of Qertassi', 'ancient_site'],
          ['wadi-el-sebua', 'معبد وادي السبوع', 'Temple of Wadi el-Sebua', 'ancient_site'],
          ['dakka-temple', 'معبد الدكة', 'Temple of Dakka', 'ancient_site'],
          ['maharraqa-temple', 'معبد المحرقة', 'Temple of Maharraqa', 'ancient_site'],
          ['amada-temple', 'معبد عمدا', 'Temple of Amada', 'ancient_site'],
          ['derr-temple', 'معبد الدر', 'Temple of Derr', 'ancient_site'],
          ['tomb-of-pennut', 'مقبرة بنوت', 'Tomb of Pennut', 'ancient_site'],
          ['qasr-ibrim', 'موقع قصر إبريم', 'Qasr Ibrim site', 'ancient_site', null, ['viewed_only']],
        ] },
      ] },
    ],
  },
  {
    slug: 'alexandria', name_ar: 'محافظة الإسكندرية', name_en: 'Alexandria',
    note_ar: 'زيارة الحدائق لا تعني تلقائيًا إتاحة دخول القصور. الآثار الغارقة تُصنف كزيارات متخصصة، وتتطلب التحقق من التصاريح ومشغلي الغوص والإتاحة.',
    sources: [
      ['الإسكندرية', 'https://www.experienceegypt.eg/en/City/27/alexandria-'],
      ['مكتبة الإسكندرية', 'https://www.experienceegypt.eg/en/attraction-details/142/the-bibliotheca-alexandrina'],
      ['المتاحف', 'https://www.experienceegypt.eg/en/Attraction/16/museums'],
      ['دليل معالم الإسكندرية بوزارة السياحة', 'https://egymonuments.gov.eg/ar/events/alexandria-celebrated-its-70th-national-day-with-a-series-of-celebrations/'],
      ['موقع قلعة قايتباي الغارق', 'https://egymonuments.gov.eg/en/sunken-monuments/qaitbay-fort-site'],
    ],
    destinations: [
      { slug: 'alexandria-city', name_ar: 'الإسكندرية', name_en: 'Alexandria', sections: [
        { name_ar: 'المواقع الأثرية', name_en: 'Archaeological sites', items: [
          ['qaitbay-citadel', 'قلعة قايتباي', 'Citadel of Qaitbay', 'historic_site'],
          ['kom-el-shoqafa', 'مقابر كوم الشقافة', 'Catacombs of Kom el-Shoqafa', 'historic_site'],
          ['pompeys-pillar', 'عمود السواري ومنطقة السرابيوم', "Pompey's Pillar and the Serapeum area", 'historic_site'],
          ['roman-amphitheatre', 'المسرح الروماني ومنطقة كوم الدكة', 'Roman Amphitheatre, Kom el-Dikka', 'historic_site'],
          ['anfushi-tombs', 'مقابر الأنفوشي', 'Anfushi Tombs', 'historic_site'],
          ['shatby-tombs', 'مقابر الشاطبي', 'Shatby Necropolis', 'historic_site'],
          ['abu-mena', 'موقع أبو مينا الأثري', 'Abu Mena archaeological site', 'religious'],
        ] },
        { name_ar: 'المتاحف والثقافة', name_en: 'Museums & culture', items: [
          ['bibliotheca-alexandrina', 'مكتبة الإسكندرية', 'Bibliotheca Alexandrina', 'modern'],
          ['bibalex-antiquities-museum', 'متحف الآثار بمكتبة الإسكندرية', 'Antiquities Museum, Bibliotheca Alexandrina', 'museum', 'bibliotheca-alexandrina'],
          ['bibalex-manuscripts-museum', 'متحف المخطوطات', 'Manuscripts Museum', 'museum', 'bibliotheca-alexandrina'],
          ['bibalex-planetarium', 'القبة السماوية', 'Planetarium Science Center', 'museum', 'bibliotheca-alexandrina'],
          ['graeco-roman-museum', 'المتحف اليوناني الروماني', 'Graeco-Roman Museum', 'museum'],
          ['alexandria-national-museum', 'متحف الإسكندرية القومي', 'Alexandria National Museum', 'museum'],
          ['royal-jewelry-museum', 'متحف المجوهرات الملكية', 'Royal Jewelry Museum', 'museum'],
          ['cavafy-museum', 'متحف كفافيس', 'Cavafy Museum', 'museum'],
        ] },
        { name_ar: 'القصور والحدائق', name_en: 'Palaces & gardens', items: [
          ['montaza-gardens', 'حدائق المنتزه', 'Montaza Gardens', 'nature'],
          ['salamlek-palace', 'قصر السلاملك', 'Salamlek Palace', 'historic_site', 'montaza-gardens', ['special_access']],
          ['haramlik-palace', 'قصر الحرملك', 'Haramlik Palace', 'historic_site', 'montaza-gardens', ['special_access']],
          ['antoniadis-gardens', 'حدائق أنطونيادس', 'Antoniadis Gardens', 'nature'],
        ] },
        { name_ar: 'المعالم الدينية ومعالم المدينة', name_en: 'Religious & city landmarks', items: [
          ['abu-al-abbas-mosque', 'مسجد أبي العباس المرسي', 'Mosque of Abu al-Abbas al-Mursi', 'religious'],
          ['al-busiri-mosque', 'مسجد البوصيري', 'Al-Busiri Mosque', 'religious'],
          ['st-mark-cathedral-alex', 'الكاتدرائية المرقسية', "Saint Mark's Coptic Cathedral", 'religious'],
          ['eliyahu-hanavi-synagogue', 'معبد إلياهو هانبي', 'Eliyahu Hanavi Synagogue', 'religious'],
          ['bahary-anfushi', 'منطقتا بحري والأنفوشي', 'Bahary and Anfushi districts', 'heritage_area'],
          ['eastern-harbour', 'الميناء الشرقي', 'Eastern Harbour', 'heritage_area'],
          ['alexandria-corniche', 'كورنيش الإسكندرية', 'Alexandria Corniche', 'modern'],
          ['stanley-bridge', 'كوبري ستانلي', 'Stanley Bridge', 'modern'],
        ] },
        { name_ar: 'الآثار الغارقة', name_en: 'Underwater antiquities', items: [
          ['eastern-harbour-underwater', 'مواقع الميناء الشرقي', 'Eastern Harbour underwater sites', 'diving', null, ['special_access']],
          ['qaitbay-underwater-site', 'موقع قلعة قايتباي البحري', 'Qaitbay underwater site', 'diving', null, ['special_access']],
          ['abu-qir-underwater', 'مواقع أبو قير', 'Abu Qir underwater sites', 'diving', null, ['special_access']],
        ] },
      ] },
    ],
  },
  {
    slug: 'matrouh', name_ar: 'محافظة مطروح', name_en: 'Matrouh',
    note_ar: 'الساحل الشمالي منطقة ممتدة وليس محافظة مستقلة؛ لا يُنسب كله لمطروح. سيدي عبد الرحمن والضبعة ورأس الحكمة وجهات وليست معالم مفردة. كثير من شواطئ المنتجعات لها شروط دخول خاصة.',
    sources: [
      ['العلمين', 'https://www.experienceegypt.eg/en/attraction-details/251/al-alamein'],
      ['متحف العلمين العسكري', 'https://www.mod.gov.eg/modwebsite/MuseumDetails.aspx?id=3'],
      ['وجهات وشواطئ الساحل', 'https://www.experienceegypt.eg/en/Attraction-Details/253/egypt-s-exclusive-beaches-beach-activities'],
      ['مطروح', 'https://www.experienceegypt.eg/en/attraction-details/294/city-breaks'],
      ['سيوة', 'https://www.experienceegypt.eg/en/City/15/siwa-oasis'],
      ['شالي', 'https://egymonuments.gov.eg/archaeological-sites/shali-village-in-siwa-oasis/'],
      ['آثار وتراث سيوة', 'https://egymonuments.gov.eg/news/inaugurates-shali-fortress-and-the-aghurmi-mosque-in-the-siwa-oasis/'],
    ],
    destinations: [
      { slug: 'el-alamein', name_ar: 'العلمين', name_en: 'El Alamein', sections: [
        { name_ar: 'العلمين', name_en: 'El Alamein', items: [
          ['alamein-military-museum', 'متحف العلمين العسكري', 'El Alamein Military Museum', 'museum'],
          ['commonwealth-cemetery', 'مقابر الكومنولث', 'Commonwealth War Cemetery', 'historic_site'],
          ['german-memorial', 'النصب والمقابر الألمانية', 'German War Memorial and cemetery', 'historic_site'],
          ['italian-memorial', 'النصب والمقابر الإيطالية', 'Italian War Memorial and cemetery', 'historic_site'],
          ['new-alamein-promenade', 'ممشى العلمين الجديدة', 'New Alamein promenade', 'modern'],
          ['new-alamein-beach-towers', 'المنطقة الشاطئية والأبراج بالعلمين الجديدة', 'New Alamein beach area and towers', 'beach'],
        ] },
      ] },
      { slug: 'north-coast-matrouh', name_ar: 'وجهات الساحل الشمالي داخل محافظة مطروح', name_en: 'North Coast destinations within Matrouh', sections: [
        { name_ar: 'وجهات الساحل الشمالي داخل المحافظة', name_en: 'North Coast destinations in the governorate', items: [
          ['sidi-abdel-rahman', 'سيدي عبد الرحمن', 'Sidi Abdel Rahman', 'destination_area'],
          ['el-dabaa', 'الضبعة', 'El Dabaa', 'destination_area'],
          ['ras-el-hekma', 'رأس الحكمة', 'Ras El Hekma', 'destination_area'],
        ] },
      ] },
      { slug: 'marsa-matrouh', name_ar: 'مرسى مطروح', name_en: 'Marsa Matrouh', sections: [
        { name_ar: 'مرسى مطروح', name_en: 'Marsa Matrouh', items: [
          ['agiba-beach', 'شاطئ عجيبة', 'Agiba Beach', 'beach'],
          ['el-abyad-beach', 'شاطئ الأبيض', 'El Abyad Beach', 'beach'],
          ['el-gharam-beach', 'شاطئ الغرام', 'El Gharam Beach', 'beach'],
          ['cleopatra-bath-matrouh', 'منطقة حمام كليوباترا', "Cleopatra's Bath area", 'beach'],
          ['matrouh-antiquities-museum', 'متحف آثار مطروح', 'Matrouh Antiquities Museum', 'museum'],
          ['rommel-museum', 'متحف روميل', 'Rommel Museum', 'museum'],
        ] },
      ] },
      { slug: 'siwa-oasis', name_ar: 'واحة سيوة', name_en: 'Siwa Oasis', sections: [
        { name_ar: 'سيوة التاريخية', name_en: 'Historic Siwa', items: [
          ['shali', 'مدينة شالي القديمة', 'Old town of Shali', 'historic_site'],
          ['oracle-temple-aghurmi', 'معبد الوحي بآمون في أغورمي', 'Temple of the Oracle of Amun, Aghurmi', 'ancient_site'],
          ['umm-ubayda-temple', 'معبد أم عبيدة', 'Temple of Umm Ubayda', 'ancient_site'],
          ['gebel-al-mawta', 'جبل الموتى ومقابره', 'Gebel al-Mawta (Mountain of the Dead) tombs', 'ancient_site'],
          ['siwa-house-museum', 'متحف البيت السيوي', 'Siwan House Museum', 'museum'],
        ] },
        { name_ar: 'سيوة الطبيعية', name_en: 'Natural Siwa', items: [
          ['cleopatra-spring', 'عين كليوباترا', "Cleopatra's Spring", 'nature'],
          ['siwa-salt-lakes', 'البحيرات المالحة', 'Salt lakes', 'nature'],
          ['siwa-lake', 'بحيرة سيوة', 'Lake Siwa', 'nature'],
          ['fatnas-island', 'جزيرة فطناس', 'Fatnas Island', 'nature'],
          ['bir-wahed', 'بئر واحد', 'Bir Wahed', 'nature'],
          ['great-sand-sea', 'بحر الرمال العظيم — منطقة جغرافية واسعة، وليس موقعًا محصورًا داخل سيوة وحدها', 'Great Sand Sea (wide geographic region, not a single site within Siwa)', 'nature', null, ['not_single_site', 'special_access']],
          ['siwa-reserve', 'محمية سيوة', 'Siwa Protected Area', 'reserve'],
        ] },
      ] },
    ],
  },
  {
    slug: 'fayoum', name_ar: 'محافظة الفيوم', name_en: 'Fayoum',
    note_ar: null,
    sources: [
      ['الفيوم', 'https://www.experienceegypt.eg/en/City/30/fayyoum'],
      ['متحف كوم أوشيم', 'https://www.experienceegypt.eg/en/attraction-details/371/the-kom-aushim-museum'],
      ['دليل مصر السياحي الرسمي', 'https://www.experienceegypt.eg/files/Egypt%20Tourism%20Guide-Eng.pdf'],
      ['دليل وزارة السياحة والآثار', 'https://egymonuments.gov.eg/'],
    ],
    destinations: [
      { slug: 'fayoum-oasis', name_ar: 'الفيوم', name_en: 'Fayoum', sections: [
        { name_ar: 'المحميات والطبيعة', name_en: 'Protected areas & nature', items: [
          ['wadi-al-hitan', 'وادي الحيتان', 'Wadi Al-Hitan (Whale Valley)', 'reserve'],
          ['fossils-climate-museum', 'متحف الحفريات وتغير المناخ', 'Fossils and Climate Change Museum', 'museum', 'wadi-al-hitan'],
          ['wadi-el-rayan', 'محمية وادي الريان', 'Wadi El Rayan Protected Area', 'reserve'],
          ['wadi-el-rayan-waterfalls', 'شلالات وادي الريان', 'Wadi El Rayan waterfalls', 'nature', 'wadi-el-rayan'],
          ['magic-lake', 'البحيرة المسحورة', 'Magic Lake', 'nature'],
          ['gebel-el-mudawwara', 'جبل المدورة', 'Gebel el-Mudawwara', 'nature'],
          ['lake-qarun', 'بحيرة قارون ومحميتها', 'Lake Qarun and its protected area', 'reserve'],
          ['qouta-dunes', 'منطقة قوطة والكثبان الرملية', 'Qouta area and sand dunes', 'nature'],
        ] },
        { name_ar: 'التراث والحياة الريفية', name_en: 'Heritage & rural life', items: [
          ['tunis-village', 'قرية تونس وورش الفخار', 'Tunis Village and pottery workshops', 'heritage_area'],
          ['fayoum-waterwheels', 'سواقي الفيوم', 'Fayoum waterwheels', 'historic_site'],
          ['el-nazla-village', 'قرية النزلة وصناعة الفخار', 'El Nazla village pottery', 'heritage_area'],
        ] },
        { name_ar: 'الآثار والمتاحف', name_en: 'Antiquities & museums', items: [
          ['hawara-pyramid', 'هرم هوارة', 'Pyramid of Hawara', 'ancient_site'],
          ['lahun-pyramid', 'هرم اللاهون', 'Pyramid of Lahun', 'ancient_site'],
          ['karanis', 'مدينة كرانيس بكوم أوشيم', 'Karanis, Kom Aushim', 'historic_site'],
          ['kom-aushim-museum', 'متحف كوم أوشيم', 'Kom Aushim Museum', 'museum'],
          ['qasr-qarun-temple', 'معبد قصر قارون', 'Temple of Qasr Qarun', 'ancient_site'],
          ['medinet-madi', 'مدينة ماضي', 'Medinet Madi', 'ancient_site'],
          ['qasr-el-sagha', 'قصر الصاغة', 'Qasr el-Sagha', 'ancient_site'],
          ['dimeh-el-sibaa', 'ديمية السباع', 'Dimeh el-Sibaa (Soknopaiou Nesos)', 'historic_site'],
        ] },
        { name_ar: 'المعالم الدينية', name_en: 'Religious landmarks', items: [
          ['monastery-gabriel-naqlun', 'دير الملاك غبريال بجبل النقلون', 'Monastery of Archangel Gabriel, Gebel al-Naqlun', 'religious'],
        ] },
      ] },
    ],
  },
  {
    slug: 'new-valley', name_ar: 'محافظة الوادي الجديد', name_en: 'New Valley',
    note_ar: 'الجلف الكبير والكهوف البعيدة تُصنف رحلات استكشافية خاصة، منفصلة عن زيارة الواحات المعتادة. لا يُنشأ لها برنامج تلقائي قبل تأكيد الإتاحة والتصاريح والخدمات اللوجستية مع جهة مرخصة.',
    sources: [
      ['الداخلة والخارجة', 'https://www.experienceegypt.eg/en/City/32/'],
      ['تفاصيل الداخلة', 'https://www.experienceegypt.eg/en/attraction-details/605/al-dakhla-oasis'],
      ['تفاصيل الخارجة', 'https://www.experienceegypt.eg/en/attraction-details/606/al-kharga-oasis'],
      ['الفرافرة', 'https://www.experienceegypt.eg/en/City/31/al-farafra-oasis'],
      ['الواحات — الهيئة العامة للاستعلامات', 'https://sis.gov.eg/en/egypt/tourism/famous-cities/oases/'],
    ],
    destinations: [
      { slug: 'kharga-oasis', name_ar: 'الخارجة', name_en: 'Kharga Oasis', sections: [
        { name_ar: 'الخارجة', name_en: 'Kharga', items: [
          ['hibis-temple', 'معبد هيبس', 'Temple of Hibis', 'ancient_site'],
          ['bagawat-necropolis', 'جبانة البجوات', 'Al-Bagawat Necropolis', 'religious'],
          ['ghueita-temple', 'معبد الغويطة', 'Temple of Ghueita', 'ancient_site'],
          ['qasr-el-zayyan', 'معبد قصر الزيان', 'Temple of Qasr el-Zayyan', 'ancient_site'],
          ['new-valley-museum', 'متحف آثار الوادي الجديد', 'New Valley Antiquities Museum', 'museum'],
          ['umm-el-dabadib', 'موقع أم الدبادب', 'Umm el-Dabadib site', 'historic_site'],
          ['ain-labakha', 'موقع اللبخة', 'Ain Labakha site', 'historic_site'],
        ] },
      ] },
      { slug: 'baris', name_ar: 'باريس', name_en: 'Baris', sections: [
        { name_ar: 'باريس', name_en: 'Baris', items: [
          ['dush-temple', 'معبد دوش', 'Temple of Dush', 'ancient_site'],
          ['new-baris-village', 'قرية باريس الجديدة من تصميم حسن فتحي', 'New Baris village (designed by Hassan Fathy)', 'heritage_area'],
        ] },
      ] },
      { slug: 'dakhla-oasis', name_ar: 'الداخلة', name_en: 'Dakhla Oasis', sections: [
        { name_ar: 'الداخلة', name_en: 'Dakhla', items: [
          ['al-qasr-islamic-village', 'قرية القصر الإسلامية', 'Al-Qasr Islamic village', 'heritage_area'],
          ['deir-el-hagar', 'معبد دير الحجر', 'Temple of Deir el-Hagar', 'ancient_site'],
          ['muzawwaqa-tombs', 'مقابر المزوقة', 'Al-Muzawwaqa tombs', 'historic_site'],
          ['balat-ain-asil', 'بلاط وعين أصيل', 'Balat and Ain Asil', 'ancient_site'],
          ['qila-el-dabba', 'قلاع الضبة', 'Qila el-Dabba', 'ancient_site'],
          ['bashendi-village', 'قرية البشندي', 'Bashendi village', 'heritage_area'],
          ['old-mut', 'مدينة موط القديمة', 'Old town of Mut', 'heritage_area'],
        ] },
      ] },
      { slug: 'farafra-oasis', name_ar: 'الفرافرة ومحيطها', name_en: 'Farafra & surroundings', sections: [
        { name_ar: 'الفرافرة ومحيطها', name_en: 'Farafra & surroundings', items: [
          ['white-desert', 'محمية الصحراء البيضاء وتكويناتها الصخرية', 'White Desert Protected Area and rock formations', 'reserve'],
          ['el-aqabat', 'منطقة العقبات', 'El Aqabat area', 'nature'],
          ['badr-museum', 'متحف بدر', 'Badr Museum', 'museum'],
          ['bir-sitta', 'بئر ستة', 'Bir Sitta (Well 6)', 'nature'],
          ['farafra-gardens', 'بساتين وقرى الواحة', 'Oasis gardens and villages', 'heritage_area'],
        ] },
      ] },
      { slug: 'remote-desert', name_ar: 'المناطق الصحراوية البعيدة', name_en: 'Remote desert areas (expeditions)', sections: [
        { name_ar: 'المناطق الصحراوية البعيدة', name_en: 'Remote desert areas', items: [
          ['gilf-kebir', 'محمية الجلف الكبير', 'Gilf Kebir Protected Area', 'reserve', null, ['special_access']],
          ['cave-of-swimmers', 'كهف السباحين', 'Cave of Swimmers', 'ancient_site', 'gilf-kebir', ['special_access']],
          ['cave-of-beasts', 'كهف الوحوش', 'Cave of Beasts', 'ancient_site', 'gilf-kebir', ['special_access']],
        ] },
      ] },
    ],
  },
];

// Approved interests (الفكرة كاملة §4ب) — exactly 22, in the approved order.
export const interests = [
  ['adventure', 'Adventure', 'مغامرات'],
  ['architecture', 'Architecture', 'عمارة ومباني مميزة'],
  ['art-culture', 'Art & culture', 'فن وثقافة'],
  ['bird-watching', 'Bird watching', 'مراقبة الطيور'],
  ['boat', 'Boat', 'رحلات بالقارب'],
  ['city-highlights', 'City highlights', 'أبرز معالم المدينة'],
  ['classes-workshops', 'Classes & workshops', 'ورش وتجارب تعليمية'],
  ['food-drink', 'Food & drink', 'مأكولات ومشروبات'],
  ['history', 'History', 'تاريخ'],
  ['museums', 'Museums', 'متاحف'],
  ['nature-wildlife', 'Nature & wildlife', 'طبيعة وحياة برية'],
  ['night', 'Night', 'أنشطة ليلية'],
  ['off-beaten-path', 'Off the beaten path', 'أماكن غير تقليدية'],
  ['photography', 'Photography', 'تصوير'],
  ['religious-sites', 'Religious sites', 'مواقع دينية'],
  ['shopping', 'Shopping', 'تسوق'],
  ['beaches-relaxation', 'Beaches & relaxation', 'شواطئ واسترخاء'],
  ['diving-snorkeling', 'Diving & snorkeling', 'غوص وسنوركلينج'],
  ['desert-safari-camping', 'Desert safari & camping', 'سفاري وتخييم'],
  ['nile-cruises-felucca', 'Nile cruises & felucca', 'رحلات النيل والفلوكة'],
  ['ancient-egypt-archaeology', 'Ancient Egypt & archaeology', 'مصر القديمة والآثار'],
  ['wellness-spa', 'Wellness & spa', 'استجمام وسبا'],
];

// Reversible assumption R-05: landmark type → interests used only to ORDER landmarks and to explain
// why a landmark is suggested. It is not a factual claim about the landmark.
export const typeInterests = {
  ancient_site: ['ancient-egypt-archaeology', 'history', 'photography', 'architecture'],
  historic_site: ['history', 'architecture', 'photography'],
  museum: ['museums', 'history', 'art-culture'],
  religious: ['religious-sites', 'architecture', 'history'],
  reserve: ['nature-wildlife', 'adventure', 'off-beaten-path', 'photography'],
  nature: ['nature-wildlife', 'photography', 'adventure'],
  beach: ['beaches-relaxation', 'boat'],
  diving: ['diving-snorkeling', 'boat', 'nature-wildlife'],
  heritage_area: ['city-highlights', 'shopping', 'art-culture', 'food-drink'],
  modern: ['city-highlights', 'night', 'shopping'],
  destination_area: ['beaches-relaxation', 'city-highlights'],
};
