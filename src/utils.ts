import { ModConfig, ModrinthVersion, ReleaseChannel, DownloadScope, FolderPathsConfig } from "./types";

/**
 * List of default mods and resource packs requested by the user
 */
export const DEFAULT_MODS: ModConfig[] = [
  // === 1. CORE PERFORMANCE & ENGINE ===
  { id: "fabric-api", name: "Fabric API (Thư viện cốt lõi Fabric)", category: "core" },
  { id: "fabric-language-kotlin", name: "Fabric Language Kotlin (Thư viện bắt buộc cho Zoomify & Kotlin mods Fabric)", category: "core" },
  { id: "kotlin-for-forge", name: "Kotlin for Forge [KFF] (Thư viện Kotlin runtime cho Forge / NeoForge / Sinytra)", category: "core" },
  { id: "cicada", name: "CICADA (Thư viện bắt buộc cho Do a Barrel Roll)", category: "core" },
  { id: "cloth-config", name: "Cloth Config API (Thư viện cấu hình bắt buộc cho Visuality)", category: "core" },
  { id: "yacl", name: "YetAnotherConfigLib [YACL] (Thư viện GUI cấu hình mở rộng)", category: "core" },
  { id: "modmenu", name: "Mod Menu (Xem danh sách & cài đặt cấu hình mod)", category: "core" },
  { id: "sodium", name: "Sodium (Tối ưu hóa FPS & Render Engine bản mới nhất)", category: "core" },
  { id: "sodium-extra", name: "Sodium Extra (Tùy chỉnh đồ họa nâng cao, Animation, Particles & Tối ưu cho Sodium)", category: "core" },
  { id: "lithium", name: "Lithium (Tối ưu hóa máy chủ, AI Mob & Vật lý)", category: "core" },
  { id: "iris", name: "Iris Shaders (Hỗ trợ Shaderpacks hiệu năng cao)", category: "core" },
  { id: "indium", name: "Indium (Render API cho Continuity & Distant Horizons)", category: "core" },
  { id: "ferrite-core", name: "FerriteCore (Tiết kiệm bộ nhớ RAM)", category: "core" },
  { id: "memoryleakfix", name: "MemoryLeakFix (Sửa tràn RAM & rò rỉ bộ nhớ)", category: "core" },
  { id: "krypton", name: "Krypton (Tối ưu hóa stack mạng & giảm ping)", category: "core" },
  { id: "immediatelyfast", name: "ImmediatelyFast (Tăng tốc render GUI, HUD & Thực thể)", category: "core" },
  { id: "entityculling", name: "EntityCulling (Ẩn thực thể bị khuất tầm nhìn)", category: "core" },
  { id: "debugify", name: "Debugify (Sửa các lỗi tồn đọng của Minecraft)", category: "core" },
  { id: "clumps", name: "Clumps (Gộp hạt kinh nghiệm giảm lag)", category: "core" },
  { id: "modernfix", name: "ModernFix (Tối ưu hóa thời gian load & bộ nhớ)", category: "core" },
  { id: "bobby", name: "Bobby (Lưu chunk tăng tầm nhìn trên server)", category: "core" },
  { id: "dynamic-fps", name: "Dynamic FPS (Giảm tải nền khi thu nhỏ game)", category: "core" },
  { id: "spark", name: "Spark (Kiểm tra & chẩn đoán Lag TPS/FPS)", category: "core" },
  { id: "lazydfu", name: "LazyDFU (Tăng tốc khởi động game)", category: "core" },
  { id: "threadtweak", name: "ThreadTweak (Tối ưu đa luồng CPU Thread)", category: "core" },
  { id: "fastload", name: "FastLoad (Tải thế giới cực nhanh)", category: "core" },
  { id: "c2me-fabric", name: "C2ME [Concurrent Chunk Management Engine] (Tối ưu đa luồng tạo & tải Chunk siêu tốc)", category: "core" },
  { id: "nvidium", name: "Nvidium (Tối ưu GPU NVIDIA Mesh Shaders cho Sodium)", category: "core" },
  { id: "intel-fix", name: "Intel Fix (Khắc phục lỗi hiển thị & Driver GPU Intel)", category: "core" },
  { id: "clear-gpu-cache", name: "Clear GPU Cache (Xóa đệm GPU, sửa Driver Stutter/Lag)", category: "core" },
  { id: "badoptimizations", name: "BadOptimizations (Giảm tải CPU/GPU Driver Overhead)", category: "core" },
  { id: "packet-fixer", name: "Packet Fixer (Sửa lỗi ngắt kết nối Payload / Network Packets)", category: "core" },
  { id: "nosium", name: "Nosium (Tối ưu hóa networking & packet Sodium)", category: "core" },
  { id: "enhanced-block-entities", name: "Enhanced Block Entities [EBE] (Tối ưu hóa render khối động Chest/Sign)", category: "core" },
  { id: "embeddium", name: "Embeddium / Sodium (Tối ưu hóa hiệu năng render)", category: "core" },
  { id: "chunky-pregenerator", name: "Chunky Pregenerator (Tạo trước Chunk bản đồ triệt tiêu giật lag khi khám phá - Độc quyền CurseForge)", category: "core" },

  // === 2. VISUAL, UTILITY, CAMERA & ANIMATIONS ===
  { id: "do-a-barrel-roll", name: "Do a Barrel Roll (Hiệu ứng nhào lộn & lượn cánh Elytra 6DOF cực đỉnh)", category: "visual" },
  { id: "zoomify", name: "Zoomify (Mod Zoom ống nhòm tùy biến mượt mà vô hạn)", category: "visual" },
  { id: "gamma-utils", name: "Gamma Utils / Fullbright (Tăng độ sáng ban đêm & trong hang động)", category: "visual" },
  { id: "better-f1", name: "Better F1 (Ẩn HUD thông minh & giữ nguyên chat khi quay phim)", category: "visual" },
  { id: "betterf3", name: "BetterF3 (Giao diện F3 debug trực quan, màu sắc rõ ràng)", category: "visual" },
  { id: "flashback", name: "Flashback (Ghi hình & Replay góc quay điện ảnh)", category: "visual" },
  { id: "freecam", name: "Freecam (Chế độ bay tự do góc nhìn camera rời)", category: "visual" },
  { id: "shine-vfx", name: "Shine: VFX (Hiệu ứng ánh sáng & hạt phát quang đẹp mắt)", category: "visual" },
  { id: "photonics", name: "Photonics (Raytracing Engine thời gian thực, chiếu sáng toàn cục & bóng đổ mềm cho Iris/Sodium)", category: "visual" },
  { id: "skin-shuffle", name: "SkinShuffle (Tự động đổi Skin động theo thời gian & trang phục)", category: "visual" },
  { id: "falldropbackport", name: "Falldrop Backport (Đưa các hiệu ứng, hoạt ảnh rơi & lá rụng mới về phiên bản cũ)", category: "visual" },
  { id: "easy-install", name: "Easy Install / Easy Mod Installer (Hỗ trợ cài đặt nhanh chóng)", category: "visual" },

  // === 3. MECHANICS, PHYSICS, ENGINE & WORLD GENERATION ===
  { id: "terrablender", name: "TerraBlender (Thư viện tạo Biome thế giới tương thích cho Fabric & Forge)", category: "core" },
  { id: "valkyrien-skies", name: "Valkyrien Skies (Vật lý tàu bay, thuyền chiến & khối khí động học thực tế)", category: "core" },
  { id: "clockwork", name: "VS: Clockwork (Động cơ máy bay, cánh quạt & khí cụ cho Create & Valkyrien Skies)", category: "core" },
  { id: "eureka", name: "Eureka! Ships! (Chế tạo tàu lượn, khinh khí cầu & thuyền buồm tự do điều khiển)", category: "core" },
  { id: "create-interactive", name: "Create: Interactive (Tương tác trực tiếp & gắn kết cỗ máy cơ khí trên tàu bay)", category: "core" },
  { id: "create", name: "Create Mod (Đại tu cơ khí, tự động hóa, bánh răng, băng chuyền & cỗ máy hơi nước)", category: "core" },
  { id: "immersive-portals", name: "Immersive Portals (Cổng không gian liền mạch không thời gian chờ tải, nhìn xuyên thế giới)", category: "visual" },

  // === 2. VISUAL, ANIMATION & 3D MODELS ===
  { id: "entity-model-features", name: "Entity Model Features [EMF / CEM] (Mô hình động 3D cho Mob)", category: "visual" },
  { id: "entitytexturefeatures", name: "EntityTextureFeatures [ETF] (Texture phát sáng, biến thể & hoạt ảnh)", category: "visual" },
  { id: "eating-animation", name: "Eating Animation [Fabric] (Hoạt ảnh ăn uống vật phẩm thực tế)", category: "visual" },
  { id: "3dskinlayers", name: "3D Skin Layers (Hiển thị lớp áo/da 3D nổi cho người chơi)", category: "visual" },
  { id: "emotecraft", name: "Emotecraft (Hệ thống cảm xúc & hoạt ảnh biểu cảm cho nhân vật)", category: "visual" },
  { id: "first-person-model", name: "First-Person Model (Hiển thị mô hình cơ thể & tay chân ở góc nhìn thứ nhất)", category: "visual" },
  { id: "playeranimator", name: "Player Animator (Thư viện hoạt ảnh chuyển động toàn diện cho người chơi)", category: "visual" },
  { id: "player-animation-library", name: "Player Animation Library [PAL] (Thư viện player_animation_library cho Emotecraft)", category: "visual" },
  { id: "custom-player-models", name: "Customizable Player Models [CPM] (Tùy biến & thiết kế mô hình nhân vật 3D)", category: "visual" },
  { id: "epic-fight", name: "Epic Fight Mod (Đại tu hệ thống chiến đấu Souls-Like, đòn đánh combo & né tránh 3D)", category: "visual" },
  { id: "visuality", name: "Visuality (Hiệu ứng hạt particles lấp lánh & sinh động)", category: "visual" },
  { id: "effective", name: "Effective (Hiệu ứng bắn nước, sóng âm & thác nước)", category: "visual" },
  { id: "appleskin", name: "AppleSkin (Hiển thị chi tiết độ no, độ bão hòa & dinh dưỡng thức ăn HUD)", category: "visual" },
  { id: "countereds-accurate-hitboxes", name: "Countered's Accurate Hitboxes (Hitbox chuẩn xác theo mô hình 3D thực thể & chi tiết chi/cánh)", category: "visual" },
  { id: "continuity", name: "Continuity (Khối nối liền kết cấu - Connected Textures)", category: "visual" },
  { id: "distanthorizons", name: "Distant Horizons (Tăng tầm nhìn vô cực LOD)", category: "visual" },
  { id: "polytone", name: "Polytone (Tùy biến màu sắc & Colormaps cho Sodium/Iris)", category: "visual" },
  { id: "smoothtexturefix", name: "SmoothTextureFix (Anisotropy Fix - Sửa lỗi vân khối & lọc dị hướng)", category: "visual" },

  // === 4. CULINARY, COOKING & EATING ANIMATIONS ===
  { id: "kaleidoscope-cookery", name: "Kaleidoscope Cookery (Hệ thống nấu ăn sống động, dụng cụ làm bếp & công thức ẩm thực mới)", category: "visual" },
  { id: "kaleidoscope-immersive-eating", name: "Kaleidoscope: Immersive Eating (Hoạt ảnh ăn uống 3D trực quan, chân thực từng miếng cắn - Hỗ trợ CurseForge/Fabric/Forge)", category: "visual" },

  // === 5. FIREARMS, TACTICAL COMBAT & TACZ MELEE PACKS ===
  { id: "tacz", name: "[TaCZ] Timeless and Classics Zero Guns (Súng bắn góc nhìn thứ nhất chân thực, tùy biến linh kiện & hoạt ảnh đỉnh cao)", category: "core" },
  { id: "lesraisins-tactical-equipements", name: "[TACZ] LesRaisins Tactical Equipements (Vũ khí cận chiến, dao găm, lựu đạn khói, khiên chống đạn cho TaCZ)", category: "core" },
  { id: "tacz-lr-valorant-knife-pack", name: "[TACZ x LR] Valorant Knife Pack (Gói dao cận chiến Valorant: Karambit, RGX Firefly, Misericordia cho TaCZ & LR)", category: "visual" },
  { id: "tacz-cs-default-knife", name: "[TaCZ] CS default knife (Mô hình dao cơ bản Counter-Strike chuẩn chỉ kèm PBR & âm thanh cho TaCZ)", category: "visual" },
  { id: "tacz-lr-arena-breakout-infinite-melee-pack", name: "[TACZ x LR] Arena Breakout: Infinite Melee Pack (Bộ 10 vũ khí cận chiến đặc nhiệm Arena Breakout cho TaCZ & LR)", category: "visual" },

  // === 6. ANIMATION ENGINES, COMBAT OVERHAUL & HUD ===
  { id: "wthit", name: "WTHIT (What The Hell Is That - HUD soi thông tin khối, sinh vật, lượng máu & công cụ tương thích)", category: "visual" },
  { id: "geckolib", name: "GeckoLib (Thư viện hoạt ảnh động cơ 3D mượt mà cho mob, trùm, vũ khí & giáp trụ)", category: "core" },
  { id: "better-combat", name: "Better Combat (Đại tu chiến đấu mượt mà, vung kiếm combo, đòn đánh tay đôi & hoạt ảnh vũ khí chân thực)", category: "visual" }
];

/**
 * Recommended Resource Packs requested by user
 */
export const DEFAULT_RESOURCE_PACKS: ModConfig[] = [
  { id: "fresh-animations", name: "Fresh Animations (Hoạt ảnh động mắt/miệng/cơ thể mob chuẩn trailer)", category: "resourcepack" },
  { id: "fresh-moves", name: "Fresh Moves (Gói tài nguyên hoạt ảnh di chuyển & biểu cảm sinh động cho người chơi)", category: "resourcepack" },
  { id: "fresh-food", name: "Fresh Food (Mô hình 3D cho tất cả các loại thức ăn)", category: "resourcepack" },
  { id: "fresh-buckets", name: "Fresh Buckets (Mô hình xô nước, xô dung nham, xô sữa & cá 3D chân thực)", category: "resourcepack" },
  { id: "fresh-music-discs", name: "Fresh Music Discs (Mô hình đĩa nhạc 3D độc đáo cho từng bài hát)", category: "resourcepack" },
  { id: "fresh-flowers-and-plants", name: "Fresh Flowers & Plants (Mô hình 3D cho hoa, cây cảnh & san hô)", category: "resourcepack" },
  { id: "refined-tools", name: "Refined Tools (Mô hình công cụ & vũ khí 3D tinh chỉnh sắc nét)", category: "resourcepack" },
  { id: "3d-default", name: "3D CreatorCraft / 3D Default (Mô hình khối & đồ vật 3D chân thực)", category: "resourcepack" },
  { id: "3d-vanilla-lite", name: "3D Vanilla Lite (Khối & vật phẩm 3D sắc nét tối ưu siêu nhẹ cho máy yếu)", category: "resourcepack" },
  { id: "bare-bones", name: "Bare Bones 16x16 (Texture tươi sáng, tối giản phong cách trailer chính thức)", category: "resourcepack" },
  { id: "motschens-better-leaves", name: "Motschen's Better Leaves (Lá cây 3D xum xuê, tròn trịa & sống động chân thực)", category: "resourcepack" },
  { id: "round-trees", name: "Round Trees (Mô hình thân cây tròn 3D tự nhiên & thực tế)", category: "resourcepack" },
  { id: "better-3d-blocks", name: "Better 3D Blocks (Chi tiết khối & đồ vật 3D nổi khối chân thực sống động)", category: "resourcepack" },
  { id: "itembound-rebound", name: "ItemBound: ReBound / Mizuno's 3D (Đổi tên vật phẩm để biến thành mô hình 3D)", category: "resourcepack" },
  { id: "clean-connected-glass", name: "Clean Glass / Clean Connected Glass (Kính trong suốt không vệt mờ, liền khối)", category: "resourcepack" },
  { id: "just-3d-stuffs", name: "Just 3D Stuffs (Gói tài nguyên mô hình 3D độc đáo cho trang bị, vũ khí, mace, đuốc & vật phẩm)", category: "resourcepack" }
];

/**
 * Recommended Shaders (Iris / OptiFine / Sodium)
 */
export const DEFAULT_SHADERS: ModConfig[] = [
  { id: "bsl-shaders", name: "BSL Shaders (Hiệu ứng ánh sáng rực rỡ, bóng thời gian thực & nước trong suốt)", category: "shader" },
  { id: "complementary-reimagined", name: "Complementary Reimagined (Đỉnh cao thẩm mỹ Vanilla, chi tiết sắc nét & tối ưu mượt)", category: "shader" },
  { id: "makeup-ultra-fast", name: "MakeUp - Ultra Fast (Shader siêu nhẹ tối ưu tuyệt vời cho máy yếu / Intel GPU)", category: "shader" },
  { id: "sildurs-vibrant-shaders", name: "Sildur's Vibrant Shaders Extreme (Shader kinh điển ánh sáng rực rỡ, tương thích cao)", category: "shader" }
];

/**
 * Normalizes and resolves mod aliases, friendly names, or full Modrinth/CurseForge URLs to actual project slugs
 */
export function resolveModSlug(slug: string): string {
  let clean = slug.trim().toLowerCase();

  // If user pasted a URL, extract the slug from it
  if (clean.includes("modrinth.com/") || clean.includes("curseforge.com/")) {
    try {
      // Modrinth URL patterns:
      // https://modrinth.com/mod/sodium
      // https://modrinth.com/resourcepack/fresh-animations
      // https://modrinth.com/plugin/spark
      // https://modrinth.com/datapack/terralith
      // https://modrinth.com/shader/iris-shaders
      const modrinthMatch = clean.match(/modrinth\.com\/(?:mod|resourcepack|plugin|datapack|shader|project)\/([^/?#]+)/i);
      if (modrinthMatch && modrinthMatch[1]) {
        clean = modrinthMatch[1].trim().toLowerCase();
      } else {
        // CurseForge URL patterns:
        // https://www.curseforge.com/minecraft/mc-mods/jei
        // https://www.curseforge.com/minecraft/texture-packs/bare-bones-texture-pack
        // https://www.curseforge.com/minecraft/customization/optifine
        const curseMatch = clean.match(/curseforge\.com\/minecraft\/(?:mc-mods|texture-packs|customization|shaders|data-packs|worlds)\/([^/?#]+)/i);
        if (curseMatch && curseMatch[1]) {
          clean = curseMatch[1].trim().toLowerCase();
        } else {
          // General fallback: grab last non-empty path segment
          const urlObj = new URL(clean.startsWith("http") ? clean : `https://${clean}`);
          const segments = urlObj.pathname.split("/").filter(Boolean);
          if (segments.length > 0) {
            clean = segments[segments.length - 1].toLowerCase();
          }
        }
      }
    } catch {
      // Ignore URL parse error and proceed with cleaned text
    }
  }

  // Remove trailing slashes, brackets or quotes
  clean = clean.replace(/^[/"'(\[]+|[/"')\]]+$/g, "");

  const aliasMap: Record<string, string> = {
    // CEM & ETF aliases
    "cem": "entity-model-features",
    "custom-entity-models": "entity-model-features",
    "customentitymodels": "entity-model-features",
    "etf": "entitytexturefeatures",
    "entity-texture-features": "entitytexturefeatures",
    "entitytexturefeatures": "entitytexturefeatures",

    // Animation & 3D
    "eating-animation": "eating-animation",
    "eatinganimation": "eating-animation",
    "eating-animation-fabric": "eating-animation",
    "3d-skin-layers": "3dskinlayers",
    "3dskinlayers": "3dskinlayers",
    "3d-skins": "3dskinlayers",
    "skinlayers3d": "3dskinlayers",
    "emotecraft": "emotecraft",
    "emote-craft": "emotecraft",
    "emotes": "emotecraft",
    "emotecraft-fabric": "emotecraft",
    "first-person-model": "first-person-model",
    "firstpersonmodel": "first-person-model",
    "firstperson-model": "first-person-model",
    "first-person": "first-person-model",
    "firstperson": "first-person-model",
    "playeranimator": "playeranimator",
    "player-animator": "playeranimator",
    "player_animator": "playeranimator",
    "player-animation-lib": "player-animation-library",
    "player_animation_lib": "player-animation-library",
    "playeranimationlib": "player-animation-library",
    "player-animation-library": "player-animation-library",
    "player_animation_library": "player-animation-library",
    "playeranimationlibrary": "player-animation-library",
    "player-animation-api": "playeranimator",
    "playeranimationapi": "playeranimator",
    "player-animation": "player-animation-library",
    "playeranimation": "player-animation-library",
    "player_animation": "player-animation-library",
    "pal": "player-animation-library",
    "custom-player-models": "custom-player-models",
    "customplayermodels": "custom-player-models",
    "customizable-player-models": "custom-player-models",
    "customizableplayermodels": "custom-player-models",
    "cpm": "custom-player-models",
    "custom-player-model": "custom-player-models",
    "epic-fight": "epic-fight",
    "epicfight": "epic-fight",
    "epic-fight-mod": "epic-fight",
    "epicfightmod": "epic-fight",
    "visuality": "visuality",
    "effective": "effective",

    // Resource Packs
    "fresh-animations": "fresh-animations",
    "fresh-animation": "fresh-animations",
    "freshanimations": "fresh-animations",
    "3d-creatorcraft": "3d-default",
    "3dcreatorcraft": "3d-default",
    "3d-default": "3d-default",
    "default-3d": "3d-default",
    "default3d": "3d-default",
    "3d-vanilla-lite": "3d-vanilla-lite",
    "3dvanillalite": "3d-vanilla-lite",
    "3d-vanilla": "3d-vanilla-lite",
    "3dvanilla": "3d-vanilla-lite",
    "vanilla-3d-lite": "3d-vanilla-lite",
    "vanilla3dlite": "3d-vanilla-lite",
    "vanilla-3d": "3d-vanilla-lite",
    "vanilla3d": "3d-vanilla-lite",
    "3d-vanilla-resource-pack": "3d-vanilla-lite",
    "itembound": "itembound-rebound",
    "itembound-rebound": "itembound-rebound",
    "mizuno": "itembound-rebound",
    "mizunos": "itembound-rebound",
    "mizunos-16-craft": "itembound-rebound",
    "bare-bones": "bare-bones",
    "barebones": "bare-bones",
    "bare-bones-16x16": "bare-bones",
    "motschens-better-leaves": "motschens-better-leaves",
    "motschens_better_leaves": "motschens-better-leaves",
    "motschen-better-leaves": "motschens-better-leaves",
    "motschens-better-leaf": "motschens-better-leaves",
    "better-leaves": "motschens-better-leaves",
    "betterleaves": "motschens-better-leaves",
    "better_leaves": "motschens-better-leaves",
    "better-leaf": "motschens-better-leaves",
    "betterleaf": "motschens-better-leaves",
    "motschen": "motschens-better-leaves",
    "motschens": "motschens-better-leaves",
    "clean-glass": "clean-connected-glass",
    "cleanglass": "clean-connected-glass",
    "falldrop-backport": "falldropbackport",
    "falldrop_backport": "falldropbackport",
    "falldropbackport": "falldropbackport",
    "falldrop": "falldropbackport",
    "fall-drop": "falldropbackport",
    "fall_drop": "falldropbackport",
    "fall-drop-backport": "falldropbackport",
    "clean-connected-glass": "clean-connected-glass",

    // Cybercraft & Fresh Series Resource Packs
    "refined-tools": "refined-tools",
    "refinedtools": "refined-tools",
    "refined_tools": "refined-tools",
    "fresh-food": "fresh-food",
    "freshfood": "fresh-food",
    "fresh_food": "fresh-food",
    "fresh-music-discs": "fresh-music-discs",
    "freshmusicdiscs": "fresh-music-discs",
    "fresh-music": "fresh-music-discs",
    "fresh-discs": "fresh-music-discs",
    "fresh-flowers-and-plants": "fresh-flowers-and-plants",
    "freshflowersandplants": "fresh-flowers-and-plants",
    "fresh-flowers": "fresh-flowers-and-plants",
    "fresh-plants": "fresh-flowers-and-plants",
    "fresh-buckets": "fresh-buckets",
    "freshbuckets": "fresh-buckets",
    "fresh_buckets": "fresh-buckets",
    "just-3d-stuffs": "just-3d-stuffs",
    "just-3d-stuff": "just-3d-stuffs",
    "just3dstuffs": "just-3d-stuffs",
    "just3dstuff": "just-3d-stuffs",
    "just-3d": "just-3d-stuffs",
    "just3d": "just-3d-stuffs",
    "3d-stuffs": "just-3d-stuffs",
    "3dstuffs": "just-3d-stuffs",

    // Shaders (BSL, Complementary Reimagined, MakeUp-UltraFast, Sildur's Vibrant)
    "bsl": "bsl-shaders",
    "bsl-shaders": "bsl-shaders",
    "bsl_shaders": "bsl-shaders",
    "bsl-shader": "bsl-shaders",
    "bslshaders": "bsl-shaders",
    "complementary": "complementary-reimagined",
    "complementary-reimagined": "complementary-reimagined",
    "complementaryreimagined": "complementary-reimagined",
    "complementary-shaders": "complementary-reimagined",
    "complementary-shaders-reimagined": "complementary-reimagined",
    "makeup": "makeup-ultra-fast",
    "makeup-ultrafast": "makeup-ultra-fast",
    "makeup-ultra-fast": "makeup-ultra-fast",
    "makeup_ultrafast": "makeup-ultra-fast",
    "makeupultrafast": "makeup-ultra-fast",
    "makeup-ultra": "makeup-ultra-fast",
    "sildur": "sildurs-vibrant-shaders",
    "sildurs": "sildurs-vibrant-shaders",
    "sildurs-vibrant-shaders": "sildurs-vibrant-shaders",
    "sildur-vibrant-shaders": "sildurs-vibrant-shaders",
    "sildurs-vibrant": "sildurs-vibrant-shaders",
    "sildur-vibrant": "sildurs-vibrant-shaders",
    "sildurs-vibrant-shaders-extreme": "sildurs-vibrant-shaders",

    // Gameplay & HUD
    "appleskin": "appleskin",
    "apple-skin": "appleskin",
    "appleskins": "appleskin",
    "accurate-hitboxes": "countereds-accurate-hitboxes",
    "accuratehitboxes": "countereds-accurate-hitboxes",
    "accurate_hitboxes": "countereds-accurate-hitboxes",
    "accurate-hitbox": "countereds-accurate-hitboxes",
    "accuratehitbox": "countereds-accurate-hitboxes",
    "countereds-accurate-hitboxes": "countereds-accurate-hitboxes",
    "countered-accurate-hitboxes": "countereds-accurate-hitboxes",
    "countereds_accurate_hitboxes": "countereds-accurate-hitboxes",
    "countered_accurate_hitboxes": "countereds-accurate-hitboxes",
    "countereds-hitboxes": "countereds-accurate-hitboxes",
    "countered-hitboxes": "countereds-accurate-hitboxes",
    "hitboxes": "countereds-accurate-hitboxes",

    // Core libraries & dependencies
    "fabric-api": "fabric-api",
    "fabricapi": "fabric-api",
    "fabric-language-kotlin": "fabric-language-kotlin",
    "fabriclanguagekotlin": "fabric-language-kotlin",
    "fabric-kotlin": "fabric-language-kotlin",
    "kotlin-fabric": "fabric-language-kotlin",
    "cicada": "cicada",
    "cicada-lib": "cicada",
    "cicadalib": "cicada",

    // Performance & Fixes
    "cloth-config": "cloth-config",
    "clothconfig": "cloth-config",
    "cloth-config-v2": "cloth-config",
    "cloth_config": "cloth-config",
    "yacl": "yacl",
    "yetanotherconfiglib": "yacl",
    "yet-another-config-lib": "yacl",
    "mod-menu": "modmenu",
    "modmenu": "modmenu",
    "mod_menu": "modmenu",
    "modmenufabric": "modmenu",
    "modmenu-fabric": "modmenu",
    "mod-menu-fabric": "modmenu",
    "anisotropy-fix": "smoothtexturefix",
    "anisotropyfix": "smoothtexturefix",
    "anisotropic-fix": "smoothtexturefix",
    "anisotropicfix": "smoothtexturefix",
    "anisotropy": "smoothtexturefix",
    "lazy-dfu": "lazydfu",
    "fast-load": "fastload",
    "memory-leak-fix": "memoryleakfix",
    "memory_leak_fix": "memoryleakfix",
    "distant-horizons": "distanthorizons",
    "ferritecore": "ferrite-core",
    "dynamicfps": "dynamic-fps",
    "dynamic_fps": "dynamic-fps",
    "immediately-fast": "immediatelyfast",
    "entity-culling": "entityculling",
    "intel-compatibility-fix": "intel-fix",
    "intelfix": "intel-fix",
    "gpu-cache": "clear-gpu-cache",
    "gpu-driver-fix": "clear-gpu-cache",
    "fix-gpu-lag": "clear-gpu-cache",
    "bad-optimizations": "badoptimizations",
    "badoptimizations": "badoptimizations",
    "boosted-fps": "badoptimizations",

    // Newly requested mods & translations
    "do-a-barrel-roll": "do-a-barrel-roll",
    "doabarrelroll": "do-a-barrel-roll",
    "barrel-roll": "do-a-barrel-roll",
    "barrelroll": "do-a-barrel-roll",
    "zoomify": "zoomify",
    "zoom": "zoomify",
    "voxy": "voxy",
    "gamma-utils": "gamma-utils",
    "gammutils": "gamma-utils",
    "gamma-util": "gamma-utils",
    "gamma_utils": "gamma-utils",
    "fullbright": "gamma-utils",
    "krypton": "krypton",
    "packet-fixer": "packet-fixer",
    "packetfixer": "packet-fixer",
    "packet_fixer": "packet-fixer",
    "trình-sửa-lỗi-gói": "packet-fixer",
    "trinh-sua-loi-goi": "packet-fixer",
    "better-f1": "better-f1",
    "betterf1": "better-f1",
    "f1-tốt-hơn": "better-f1",
    "f1-tot-hon": "better-f1",
    "better-f3": "betterf3",
    "betterf3": "betterf3",
    "f3-tốt-hơn": "betterf3",
    "f3-tot-hon": "betterf3",
    "dynamic-fps": "dynamic-fps",
    "tốc-độ-khung-hình-động": "dynamic-fps",
    "toc-do-khung-hinh-dong": "dynamic-fps",
    "c2me": "c2me-fabric",
    "c2me-fabric": "c2me-fabric",
    "flashback": "flashback",
    "flashback-mod": "flashback",
    "flashbackmod": "flashback",
    "hồi-tưởng": "flashback",
    "hoi-tuong": "flashback",
    "freecam": "freecam",
    "free-cam": "freecam",
    "entityculling": "entityculling",
    "loại-bỏ-thực-thể": "entityculling",
    "loai-bo-thuc-the": "entityculling",
    "immediatelyfast": "immediatelyfast",
    "nhanh-chóng-ngay-lập-tức": "immediatelyfast",
    "nhanh-chong-ngay-lap-tuc": "immediatelyfast",
    "lithium": "lithium",
    "ferrite-core": "ferrite-core",
    "lõi-ferrite": "ferrite-core",
    "loi-ferrite": "ferrite-core",
    "nosium": "nosium",
    "shine-vfx": "shine-vfx",
    "shine:-vfx": "shine-vfx",
    "shine": "shine-vfx",
    "debugify": "debugify",
    "enhanced-block-entities": "enhanced-block-entities",
    "enhancedblockentities": "enhanced-block-entities",
    "ebe": "enhanced-block-entities",
    "skin-shuffle": "skin-shuffle",
    "skinshuffle": "skin-shuffle",
    "embeddium": "embeddium",
    "sodium-extra": "sodium-extra",
    "sodiumextra": "sodium-extra",
    "extra-sodium": "sodium-extra",
    "extrasodium": "sodium-extra",
    "sodium_extra": "sodium-extra",
    "extra-sodium-mod": "sodium-extra",
    "terrablender": "terrablender",
    "terra-blender": "terrablender",
    "terriablender": "terrablender",
    "terria-blender": "terrablender",
    "valkyrien-skies": "valkyrien-skies",
    "valkyrienskies": "valkyrien-skies",
    "vs2": "valkyrien-skies",
    "clockwork": "clockwork",
    "vs-clockwork": "clockwork",
    "vs_clockwork": "clockwork",
    "clock-work": "clockwork",
    "eureka": "eureka",
    "vs-eureka": "eureka",
    "valkyrien-skies-eureka": "eureka",
    "eureka-ships": "eureka",
    "eureka-ship": "eureka",
    "create-interactive": "create-interactive",
    "create_interactive": "create-interactive",
    "createinteractive": "create-interactive",
    "create": "create",
    "create-mod": "create",
    "createmod": "create",
    "create-fabric": "create",
    "immersive-portals": "immersive-portals",
    "immersiveportals": "immersive-portals",
    "immersive_portals": "immersive-portals",
    "immerse-portal": "immersive-portals",
    "immerse-portals": "immersive-portals",
    "easy-install": "easy-install",
    "cài-đặt-dễ-dàng": "easy-install",
    "cai-dat-de-dang": "easy-install",
    "fresh-moves": "fresh-moves",
    "fresh-move": "fresh-moves",
    "freshmoves": "fresh-moves",
    "freshmove": "fresh-moves",
    "gói-nước-ép-tươi": "fresh-moves",
    "goi-nuoc-ep-tuoi": "fresh-moves",
    "kotlinforforge": "kotlin-for-forge",
    "kotlin-for-forge": "kotlin-for-forge",
    "kff": "kotlin-for-forge",
    "kotlin_for_forge": "kotlin-for-forge",
    "kotlinforge": "kotlin-for-forge",
    "kotlin-forge": "kotlin-for-forge",
    "photonics": "photonics",
    "photonics-mod": "photonics",
    "photonic": "photonics",
    "photonics_mod": "photonics",
    "photonics-engine": "photonics",
    "round-trees": "round-trees",
    "roundtrees": "round-trees",
    "round_trees": "round-trees",
    "round-tree": "round-trees",
    "roundtree": "round-trees",
    "round_tree": "round-trees",
    "round-trees-resource-pack": "round-trees",
    "cây-tròn": "round-trees",
    "cay-tron": "round-trees",
    "caytron": "round-trees",
    "better-3d-blocks": "better-3d-blocks",
    "better3dblocks": "better-3d-blocks",
    "better_3d_blocks": "better-3d-blocks",
    "better-3d-block": "better-3d-blocks",
    "better3dblock": "better-3d-blocks",
    "better_3d_block": "better-3d-blocks",
    "better-3d": "better-3d-blocks",
    "better3d": "better-3d-blocks",
    "better_3d": "better-3d-blocks",
    // TaCZ & Firearms
    "tacz": "tacz",
    "timeless-and-classics-zero": "tacz",
    "timeless_and_classics_zero": "tacz",
    "timeless-and-classics-zero-guns": "tacz",
    "tacz-guns": "tacz",
    "tacz-mod": "tacz",
    "tacz-refabricated": "tacz",
    "tacz_refabricated": "tacz",
    "[tacz]-timeless-and-classics-zero-guns": "tacz",
    // LesRaisins Tactical Equipements
    "lesraisins-tactical-equipements": "lesraisins-tactical-equipements",
    "lesraisins-tactical-equipment": "lesraisins-tactical-equipements",
    "lesraisins_tactical_equipements": "lesraisins-tactical-equipements",
    "lesraisins_tactical_equipment": "lesraisins-tactical-equipements",
    "lesraisins": "lesraisins-tactical-equipements",
    "lr-tactical-equipment": "lesraisins-tactical-equipements",
    "lr-tactical-equipements": "lesraisins-tactical-equipements",
    "[tacz]-lesraisins-tactical-equipements": "lesraisins-tactical-equipements",
    "tacz-lesraisins-tactical-equipements": "lesraisins-tactical-equipements",
    // Kaleidoscope Cookery & Immersive Eating
    "kaleidoscope-cookery": "kaleidoscope-cookery",
    "kaleidoscopecookery": "kaleidoscope-cookery",
    "kaleidoscope_cookery": "kaleidoscope-cookery",
    "kaleidoscope-immersive-eating": "kaleidoscope-immersive-eating",
    "kaleidoscope_immersive_eating": "kaleidoscope-immersive-eating",
    "kaleidoscope:-immersive-eating": "kaleidoscope-immersive-eating",
    "kaleidoscope-eating": "kaleidoscope-immersive-eating",
    "immersive-eating": "kaleidoscope-immersive-eating",
    "immersiveeating": "kaleidoscope-immersive-eating",
    // Knife & Melee Packs for TaCZ & LR
    "tacz-lr-valorant-knife-pack": "tacz-lr-valorant-knife-pack",
    "valorant-knife-pack": "tacz-lr-valorant-knife-pack",
    "valorant-knife": "tacz-lr-valorant-knife-pack",
    "valorant_knife_pack": "tacz-lr-valorant-knife-pack",
    "[tacz-x-lr]-valorant-knife-pack": "tacz-lr-valorant-knife-pack",
    "tacz-x-lr-valorant-knife-pack": "tacz-lr-valorant-knife-pack",
    "tacz-cs-default-knife": "tacz-cs-default-knife",
    "cs-default-knife": "tacz-cs-default-knife",
    "cs_default_knife": "tacz-cs-default-knife",
    "csdefaultknife": "tacz-cs-default-knife",
    "[tacz]-cs-default-knife": "tacz-cs-default-knife",
    "tacz-lr-arena-breakout-infinite-melee-pack": "tacz-lr-arena-breakout-infinite-melee-pack",
    "arena-breakout-infinite-melee-pack": "tacz-lr-arena-breakout-infinite-melee-pack",
    "arena-breakout-melee-pack": "tacz-lr-arena-breakout-infinite-melee-pack",
    "arena-breakout-melee": "tacz-lr-arena-breakout-infinite-melee-pack",
    "[tacz-x-lr]-arena-breakout:-infinite-melee-pack": "tacz-lr-arena-breakout-infinite-melee-pack",
    "tacz-x-lr-arena-breakout-infinite-melee-pack": "tacz-lr-arena-breakout-infinite-melee-pack",
    // WTHIT, GeckoLib & Better Combat
    "wthit": "wthit",
    "waila": "wthit",
    "hwyla": "wthit",
    "what-the-hell-is-that": "wthit",
    "what_the_hell_is_that": "wthit",
    "geckolib": "geckolib",
    "gecko-lib": "geckolib",
    "geckolib3": "geckolib",
    "geckolib4": "geckolib",
    "better-combat": "better-combat",
    "bettercombat": "better-combat",
    "better_combat": "better-combat",
    // Chunky Pregenerator (CurseForge Exclusive)
    "chunky-pregenerator": "chunky-pregenerator",
    "chunkypregenerator": "chunky-pregenerator",
    "chunky_pregenerator": "chunky-pregenerator",
    "chunky": "chunky-pregenerator",
    "chunky-mod": "chunky-pregenerator",
    "chunky-pregen": "chunky-pregenerator"
  };
  return aliasMap[clean] || clean;
}

/**
 * Set of performance and lag-reduction mods (FPS, RAM, GPU, CPU, Network optimizations)
 */
export const PERFORMANCE_MOD_SET = new Set([
  // Core FPS & Render Optimizations
  "sodium",
  "sodium-extra",
  "embeddium",
  "nvidium",
  "indium",
  "iris",
  "immediatelyfast",
  "entityculling",
  "enhanced-block-entities",
  "intel-fix",
  "clear-gpu-cache",
  "badoptimizations",
  // RAM & Memory Optimizations
  "ferrite-core",
  "memoryleakfix",
  "modernfix",
  "dynamic-fps",
  // TPS, Server, Physics & Chunk Engine Optimizations
  "lithium",
  "c2me-fabric",
  "fastload",
  "threadtweak",
  "lazydfu",
  "bobby",
  "clumps",
  "spark",
  "debugify",
  "chunky-pregenerator",
  "chunky",
  // Networking & Ping Optimizations
  "krypton",
  "packet-fixer",
  "nosium",
  // Essential Core Runtime Libraries needed to run performance mods
  "fabric-api",
  "fabric-language-kotlin",
  "kotlin-for-forge",
  "cloth-config",
  "yacl",
  "modmenu"
]);

/**
 * Checks whether a given mod slug is an anti-lag / performance optimization mod
 */
export function isPerformanceMod(slug: string): boolean {
  const clean = resolveModSlug(slug);
  if (PERFORMANCE_MOD_SET.has(clean)) return true;
  
  // Also check DEFAULT_MODS category if it's marked as 'core' and not mechanics/combat
  const nonPerformanceSlugs = new Set([
    "valkyrien-skies", "eureka", "clockwork", "create", "create-interactive", "immersive-portals", "terrablender",
    "tacz", "lesraisins-tactical-equipements", "tacz-lr-valorant-knife-pack", "tacz-cs-default-knife", "tacz-lr-arena-breakout-infinite-melee-pack",
    "kaleidoscope-cookery", "kaleidoscope-immersive-eating",
    "wthit", "better-combat"
  ]);
  if (nonPerformanceSlugs.has(clean)) return false;

  const def = DEFAULT_MODS.find(m => m.id === clean);
  if (def && def.category === "core") {
    return true;
  }
  return false;
}

/**
 * Determines whether a mod belongs to a given download / check scope
 */
export function isModInScope(slug: string, scope: DownloadScope): boolean {
  if (scope === "all") return true;
  const clean = resolveModSlug(slug);

  if (scope === "performance") {
    return isPerformanceMod(clean);
  }

  if (scope === "combat") {
    return [
      "tacz",
      "lesraisins-tactical-equipements",
      "tacz-lr-valorant-knife-pack",
      "tacz-cs-default-knife",
      "tacz-lr-arena-breakout-infinite-melee-pack",
      "better-combat",
      "epic-fight",
      "countereds-accurate-hitboxes"
    ].includes(clean);
  }

  const isShader = clean.includes("shader") || ["bsl-shaders", "complementary-reimagined", "makeup-ultra-fast", "sildurs-vibrant-shaders"].includes(clean);
  const isResourcePack = !isShader && (DEFAULT_RESOURCE_PACKS.some(rp => rp.id === clean) || [
    "round-trees", "better-3d-blocks", "fresh-animations", "fresh-moves", "fresh-food", "fresh-buckets", "fresh-music-discs", "fresh-flowers-and-plants", "refined-tools", "3d-default", "3d-vanilla-lite", "bare-bones", "motschens-better-leaves", "clean-connected-glass", "itembound-rebound", "just-3d-stuffs"
  ].includes(clean));

  if (scope === "packs_shaders") {
    return isShader || isResourcePack;
  }

  if (scope === "visual") {
    // Return true for visual, animations, HUD, camera, audio, mechanics, eating
    if (isPerformanceMod(clean)) return false;
    if (isShader || isResourcePack) return false;
    return true;
  }

  return true;
}

/**
 * Filter an array of mod slugs according to the selected DownloadScope
 */
export function filterModsByScope(slugs: string[], scope: DownloadScope): string[] {
  if (scope === "all") return slugs;
  return slugs.filter(s => isModInScope(s, scope));
}

/**
 * Returns human-readable Vietnamese label for DownloadScope
 */
export function getScopeDisplayName(scope: DownloadScope): string {
  switch (scope) {
    case "performance": return "Chỉ Mod Giảm Lag";
    case "visual": return "Chỉ Hoạt Ảnh 3D & HUD";
    case "combat": return "Chỉ Súng & Dao TaCZ";
    case "packs_shaders": return "Chỉ Gói 3D & Shaders";
    case "all":
    default:
      return "Tất Cả";
  }
}

/**
 * Selects the optimal version based on stability channel:
 * - Channel 'release': Prioritizes 'release' versions. Falls back to 'beta' then 'alpha' if no release exists.
 * - Channel 'beta': Selects the newest version among 'release' and 'beta' (allowing testing of latest beta builds).
 */
export function selectBestModrinthVersion(
  versions: ModrinthVersion[],
  channel: ReleaseChannel = "release"
): ModrinthVersion | null {
  if (!versions || versions.length === 0) return null;

  if (channel === "beta") {
    // In beta channel, accept both release and beta, sorting by newest publication date
    const releaseOrBeta = versions
      .filter((v) => v.version_type === "release" || v.version_type === "beta")
      .sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());

    if (releaseOrBeta.length > 0) return releaseOrBeta[0];

    const alphas = versions
      .filter((v) => v.version_type === "alpha")
      .sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());

    if (alphas.length > 0) return alphas[0];
  } else {
    // Default 'release' channel: strictly prioritize official releases first
    const releases = versions
      .filter((v) => v.version_type === "release")
      .sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());

    if (releases.length > 0) return releases[0];

    const betas = versions
      .filter((v) => v.version_type === "beta")
      .sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());

    if (betas.length > 0) return betas[0];

    const alphas = versions
      .filter((v) => v.version_type === "alpha")
      .sort((a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime());

    if (alphas.length > 0) return alphas[0];
  }

  // Fallback: newest by date
  return [...versions].sort(
    (a, b) => new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
  )[0];
}

/**
 * Known dependency relationships between mods to prevent Fabric Loader crashes
 */
export interface ModDependencyRule {
  targetMod: string;
  requiredMods: { slug: string; name: string }[];
  reason: string;
}

export const MOD_DEPENDENCIES_RULES: ModDependencyRule[] = [
  {
    targetMod: "sodium-extra",
    requiredMods: [
      { slug: "sodium", name: "Sodium" },
      { slug: "fabric-api", name: "Fabric API" }
    ],
    reason: "Sodium Extra là mod mở rộng các tùy chỉnh nâng cao bắt buộc chạy cùng Sodium & Fabric API"
  },
  {
    targetMod: "emotecraft",
    requiredMods: [
      { slug: "player-animation-library", name: "Player Animation Library (player_animation_library)" },
      { slug: "fabric-api", name: "Fabric API" }
    ],
    reason: "Emotecraft bắt buộc phải có Player Animation Library (player_animation_library) để khởi chạy hoạt ảnh người chơi"
  },
  {
    targetMod: "visuality",
    requiredMods: [
      { slug: "cloth-config", name: "Cloth Config API" },
      { slug: "fabric-api", name: "Fabric API" }
    ],
    reason: "Visuality yêu cầu Cloth Config để load cấu hình hạt particle"
  },
  {
    targetMod: "continuity",
    requiredMods: [
      { slug: "indium", name: "Indium" }
    ],
    reason: "Continuity yêu cầu Indium khi sử dụng chung với Sodium để nối vân khối (Connected Textures)"
  },
  {
    targetMod: "iris",
    requiredMods: [
      { slug: "sodium", name: "Sodium" }
    ],
    reason: "Iris Shaders hoạt động dựa trên Render Engine của Sodium"
  },
  {
    targetMod: "indium",
    requiredMods: [
      { slug: "sodium", name: "Sodium" }
    ],
    reason: "Indium là phần mở rộng rendering API dành cho Sodium"
  },
  {
    targetMod: "first-person-model",
    requiredMods: [
      { slug: "fabric-api", name: "Fabric API" }
    ],
    reason: "First-Person Model yêu cầu Fabric API"
  },
  {
    targetMod: "clockwork",
    requiredMods: [
      { slug: "valkyrien-skies", name: "Valkyrien Skies" },
      { slug: "create", name: "Create Mod" },
      { slug: "fabric-api", name: "Fabric API" }
    ],
    reason: "Clockwork yêu cầu Valkyrien Skies và Create để hoạt động"
  },
  {
    targetMod: "eureka",
    requiredMods: [
      { slug: "valkyrien-skies", name: "Valkyrien Skies" },
      { slug: "fabric-api", name: "Fabric API" }
    ],
    reason: "Eureka! Ships! yêu cầu Valkyrien Skies để xử lý vật lý tàu"
  },
  {
    targetMod: "create-interactive",
    requiredMods: [
      { slug: "valkyrien-skies", name: "Valkyrien Skies" },
      { slug: "create", name: "Create Mod" }
    ],
    reason: "Create: Interactive yêu cầu Valkyrien Skies và Create"
  },
  {
    targetMod: "lesraisins-tactical-equipements",
    requiredMods: [
      { slug: "tacz", name: "[TaCZ] Timeless and Classics Zero" }
    ],
    reason: "LesRaisins Tactical Equipements là bản mở rộng vũ khí & phụ kiện yêu cầu mod lõi TaCZ"
  },
  {
    targetMod: "tacz-lr-valorant-knife-pack",
    requiredMods: [
      { slug: "tacz", name: "[TaCZ] Timeless and Classics Zero" },
      { slug: "lesraisins-tactical-equipements", name: "[TACZ] LesRaisins Tactical Equipements" }
    ],
    reason: "Valorant Knife Pack yêu cầu TaCZ và LesRaisins Tactical Equipements để render dao và hoạt ảnh chém"
  },
  {
    targetMod: "tacz-cs-default-knife",
    requiredMods: [
      { slug: "tacz", name: "[TaCZ] Timeless and Classics Zero" }
    ],
    reason: "CS Default Knife yêu cầu mod lõi TaCZ để load mô hình và cơ chế vũ khí"
  },
  {
    targetMod: "tacz-lr-arena-breakout-infinite-melee-pack",
    requiredMods: [
      { slug: "tacz", name: "[TaCZ] Timeless and Classics Zero" },
      { slug: "lesraisins-tactical-equipements", name: "[TACZ] LesRaisins Tactical Equipements" }
    ],
    reason: "Arena Breakout Melee Pack yêu cầu TaCZ và LesRaisins Tactical Equipements"
  },
  {
    targetMod: "kaleidoscope-immersive-eating",
    requiredMods: [
      { slug: "kaleidoscope-cookery", name: "Kaleidoscope Cookery" }
    ],
    reason: "Kaleidoscope: Immersive Eating hoạt động đồng bộ với Kaleidoscope Cookery để cung cấp hoạt ảnh ăn 3D"
  },
  {
    targetMod: "better-combat",
    requiredMods: [
      { slug: "playeranimator", name: "Player Animator" },
      { slug: "cloth-config", name: "Cloth Config v15" }
    ],
    reason: "Better Combat yêu cầu Player Animator để phát hoạt ảnh chém vũ khí 3D và Cloth Config để tùy biến cấu hình"
  },
  {
    targetMod: "chunky-pregenerator",
    requiredMods: [
      { slug: "chunky", name: "Chunky (Core Chunk Pregenerator Engine)" }
    ],
    reason: "Chunky Pregenerator chạy trên nền thư viện Chunky để kích hoạt tác vụ nạp trước khối bản đồ"
  }
];

export function getMissingDependencies(currentMods: string[]): { targetMod: string; missing: { slug: string; name: string }[]; reason: string }[] {
  const missingList: { targetMod: string; missing: { slug: string; name: string }[]; reason: string }[] = [];
  const normalizedSet = new Set(currentMods.map(m => resolveModSlug(m)));

  for (const rule of MOD_DEPENDENCIES_RULES) {
    if (normalizedSet.has(rule.targetMod)) {
      const missing = rule.requiredMods.filter(req => !normalizedSet.has(req.slug));
      if (missing.length > 0) {
        missingList.push({
          targetMod: rule.targetMod,
          missing,
          reason: rule.reason
        });
      }
    }
  }

  return missingList;
}

export function selectBestCurseForgeFile(
  files: any[],
  channel: ReleaseChannel = "release"
): any | null {
  if (!files || files.length === 0) return null;

  if (channel === "beta") {
    // In beta channel, accept both release (1) and beta (2), newest first
    const releaseOrBeta = files
      .filter((f) => f.releaseType === 1 || f.releaseType === 2)
      .sort((a, b) => b.id - a.id);
    if (releaseOrBeta.length > 0) return releaseOrBeta[0];

    const alphas = files
      .filter((f) => f.releaseType === 3)
      .sort((a, b) => b.id - a.id);
    if (alphas.length > 0) return alphas[0];
  } else {
    // Default 'release' channel
    const releases = files
      .filter((f) => f.releaseType === 1)
      .sort((a, b) => b.id - a.id);
    if (releases.length > 0) return releases[0];

    const betas = files
      .filter((f) => f.releaseType === 2)
      .sort((a, b) => b.id - a.id);
    if (betas.length > 0) return betas[0];

    const alphas = files
      .filter((f) => f.releaseType === 3)
      .sort((a, b) => b.id - a.id);
    if (alphas.length > 0) return alphas[0];
  }

  return [...files].sort((a, b) => b.id - a.id)[0];
}

/**
 * Common Minecraft versions for selection
 */
export const MINECRAFT_VERSIONS = [
  "1.21.4",
  "1.21.3",
  "1.21.2",
  "1.21.1",
  "1.21",
  "1.20.6",
  "1.20.5",
  "1.20.4",
  "1.20.3",
  "1.20.2",
  "1.20.1",
  "1.20",
  "1.19.4",
  "1.19.3",
  "1.19.2",
  "1.19.1",
  "1.19",
  "1.18.2",
  "1.18.1",
  "1.18",
  "1.17.1",
  "1.16.5",
  "1.15.2",
  "1.14.4",
  "1.12.2",
  "1.8.9",
  "1.7.10"
];

/**
 * Formats file size in bytes into human-readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Generates the requested Python script with user-customized configurations
 */
export function generatePythonScript(
  minecraftVersion: string,
  loader: string,
  mods: string[],
  provider: "both" | "modrinth" | "curseforge" = "both",
  releaseChannel: ReleaseChannel = "release"
): string {
  const modsListString = mods.map((m) => `    "${m}"`).join(",\n");

  if (provider === "curseforge") {
    return `#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Kịch bản Python tự động cập nhật và tải về các Minecraft mods phiên bản mới nhất từ CurseForge API.
Yêu cầu mã API Key CurseForge. Bạn có thể cấu hình thông qua biến môi trường 'CURSEFORGE_API_KEY'.
"""

import os
import json
import sys
from datetime import datetime

# Đảm bảo thư viện 'requests' đã được cài đặt
try:
    import requests
except ImportError:
    print("[Hệ thống] Thư viện 'requests' chưa được cài đặt!")
    print("Vui lòng chạy lệnh sau để cài đặt: pip install requests")
    sys.exit(1)

# ==================== CẤU HÌNH SCRIPT ====================
MINECRAFT_VERSION = "${minecraftVersion}"
LOADER = "${loader.toLowerCase()}" # fabric hoặc forge
RELEASE_CHANNEL = "${releaseChannel}" # "release" (mặc định) hoặc "beta"
DOWNLOAD_DIR = "mods_downloaded"
MANIFEST_FILE = os.path.join(DOWNLOAD_DIR, "manifest_curseforge.json")

# Lấy CurseForge API Key từ biến môi trường hoặc điền thủ công vào đây
# (Đăng ký lấy key miễn phí tại: https://console.curseforge.com)
API_KEY = os.environ.get("CURSEFORGE_API_KEY", "")

# Danh sách Mod ID (ID số của CurseForge) hoặc Mod Slug
# Ví dụ: 324311 (Sodium/Embeddium), 603244 (ImmediatelyFast)...
MODS = [
${modsListString}
]
# =========================================================

def get_current_time():
    """Trả về chuỗi thời gian hiện tại định dạng hh:mm:ss"""
    return datetime.now().strftime("%H:%M:%S")

def load_manifest():
    """Tải tệp manifest lưu trữ thông tin các mods đã tải"""
    if os.path.exists(MANIFEST_FILE):
        try:
            with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[{get_current_time()}] [Cảnh báo] Không thể đọc manifest: {e}")
            return {}
    return {}

def save_manifest(manifest):
    """Lưu trữ trạng thái tải xuống vào manifest"""
    try:
        with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"[{get_current_time()}] [Lỗi] Không thể lưu manifest: {e}")

def download_file(url, path, filename):
    """Tải tệp từ URL về đường dẫn chỉ định"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        return True
    except Exception as e:
        print(f"\\n[{get_current_time()}] [Lỗi] Tải xuống thất bại cho '{filename}': {e}")
        return False

def main():
    if not API_KEY:
        print("=" * 70)
        print("[LỖI] Bạn chưa thiết lập CURSEFORGE_API_KEY!")
        print("CurseForge API yêu cầu khóa xác thực (API Key) để hoạt động.")
        print("Vui lòng đăng ký tại: https://console.curseforge.com")
        print("Sau đó chạy script với lệnh:")
        print("  export CURSEFORGE_API_KEY='khoa_cua_ban' && python script.py")
        print("Hoặc chỉnh sửa trực tiếp biến API_KEY trong tệp mã nguồn này.")
        print("=" * 70)
        sys.exit(1)

    # Tạo thư mục lưu trữ nếu chưa có
    if not os.path.exists(DOWNLOAD_DIR):
        try:
            os.makedirs(DOWNLOAD_DIR)
            print(f"[{get_current_time()}] [Hệ thống] Đã tạo thư mục lưu trữ: '{DOWNLOAD_DIR}'")
        except Exception as e:
            print(f"[{get_current_time()}] [Lỗi] Không thể tạo thư mục lưu trữ: {e}")
            sys.exit(1)
        
    manifest = load_manifest()
    
    print("=" * 70)
    print(f"BẮT ĐẦU KIỂM TRA MODS CURSEFORGE CHO MC {MINECRAFT_VERSION} ({LOADER.upper()})")
    print(f"Thư mục lưu trữ: {os.path.abspath(DOWNLOAD_DIR)}")
    print("=" * 70)
    
    headers = {
        "Accept": "application/json",
        "x-api-key": API_KEY
    }
    
    success_count = 0
    updated_count = 0
    error_count = 0
    
    # Chuẩn hóa loader cho CurseForge API
    cf_loader_type = 4 if LOADER == "fabric" else (1 if LOADER == "forge" else 0)
    
    for mod in MODS:
        mod = mod.strip()
        if not mod:
            continue
            
        print(f"[{get_current_time()}] [Kiểm tra] Đang kiểm tra CurseForge mod: {mod}...")
        
        try:
            # 1. Tìm kiếm hoặc lấy chi tiết dự án mod bằng Slug hoặc ID số
            # Nếu mod là chuỗi số, ta có thể gọi thẳng API /v1/mods/{id}
            is_numeric_id = mod.isdigit()
            
            project_title = mod
            mod_id = None
            
            if is_numeric_id:
                mod_id = int(mod)
                proj_url = f"https://api.curseforge.com/v1/mods/{mod_id}"
                proj_res = requests.get(proj_url, headers=headers)
                if proj_res.status_code == 200:
                    project_title = proj_res.json().get("data", {}).get("name", mod)
            else:
                # Tìm kiếm mod bằng slug thông qua tìm kiếm
                search_url = f"https://api.curseforge.com/v1/mods/search"
                params = {
                    "gameId": 432, # Minecraft ID
                    "slug": mod,
                    "classId": 6 # Bukkit Plugins hoặc Mods
                }
                search_res = requests.get(search_url, headers=headers, params=params)
                if search_res.status_code == 200:
                    data = search_res.json().get("data", [])
                    if data:
                        mod_id = data[0].get("id")
                        project_title = data[0].get("name")
            
            if not mod_id:
                print(f"[{get_current_time()}] [Lỗi] Không thể giải quyết ID cho mod: '{mod}'.")
                error_count += 1
                continue
                
            # 2. Truy vấn danh sách tệp đính kèm của mod
            files_url = f"https://api.curseforge.com/v1/mods/{mod_id}/files"
            # Truy vấn lọc theo phiên bản game và loại mod loader
            files_res = requests.get(files_url, headers=headers)
            files_res.raise_for_status()
            files_data = files_res.json().get("data", [])
            
            # Lọc các file phù hợp
            compatible_files = []
            for file_info in files_data:
                game_versions = file_info.get("gameVersions", [])
                # Kiểm tra Minecraft version và Loader
                has_mc = MINECRAFT_VERSION in game_versions
                
                # Ánh xạ tên loader (ví dụ: 'Fabric' hoặc 'Forge')
                has_loader = False
                for gv in game_versions:
                    if LOADER in gv.lower():
                        has_loader = True
                        break
                
                if has_mc and has_loader:
                    compatible_files.append(file_info)
            
            if not compatible_files:
                print(f"[{get_current_time()}] [Lỗi] Không tìm thấy tệp phù hợp cho '{project_title}' trên MC {MINECRAFT_VERSION} + {LOADER.upper()}.")
                error_count += 1
                continue
                
            # Lọc theo kênh phát hành (Release hoặc Beta)
            if RELEASE_CHANNEL == "beta":
                # Kênh Beta: Lấy bản mới nhất trong số Release và Beta
                beta_or_release = [f for f in compatible_files if f.get("releaseType") in (1, 2)]
                if beta_or_release:
                    beta_or_release.sort(key=lambda x: x.get("id", 0), reverse=True)
                    latest_file = beta_or_release[0]
                else:
                    compatible_files.sort(key=lambda x: x.get("id", 0), reverse=True)
                    latest_file = compatible_files[0]
            else:
                # Kênh Release (Mặc định): Ưu tiên bản Release (1) chính thức
                release_files = [f for f in compatible_files if f.get("releaseType") == 1]
                beta_files = [f for f in compatible_files if f.get("releaseType") == 2]
                
                if release_files:
                    release_files.sort(key=lambda x: x.get("id", 0), reverse=True)
                    latest_file = release_files[0]
                elif beta_files:
                    beta_files.sort(key=lambda x: x.get("id", 0), reverse=True)
                    latest_file = beta_files[0]
                else:
                    compatible_files.sort(key=lambda x: x.get("id", 0), reverse=True)
                    latest_file = compatible_files[0]
            
            file_id = latest_file.get("id")
            filename = latest_file.get("fileName")
            download_url = latest_file.get("downloadUrl")
            
            if not download_url:
                # Đôi khi downloadUrl bị null do nhà phát triển chặn tải bên thứ 3,
                # có thể giải quyết bằng CDN thay thế: v1/mods/{modId}/files/{fileId}/download-url
                dl_url_api = f"https://api.curseforge.com/v1/mods/{mod_id}/files/{file_id}/download-url"
                dl_res = requests.get(dl_url_api, headers=headers)
                if dl_res.status_code == 200:
                    download_url = dl_res.json().get("data")
            
            if not download_url:
                # Sử dụng fallback cấu trúc CDN thông thường
                # Ví dụ: /files/1234/567 -> 1234567 -> https://edge.forgecdn.net/files/1234/567/filename.jar
                # (định dạng: edge.forgecdn.net/files/{file_id_first_4_digits}/{file_id_last_3_digits}/{filename})
                file_str = str(file_id)
                part1 = file_str[:4]
                part2 = file_str[4:]
                download_url = f"https://edge.forgecdn.net/files/{part1}/{part2}/{filename}"
                
            target_path = os.path.join(DOWNLOAD_DIR, filename)
            
            # 3. So sánh phiên bản trong manifest để tránh tải trùng
            old_filename = manifest.get(mod, {}).get("filename")
            old_file_id = manifest.get(mod, {}).get("file_id")
            
            is_file_on_disk = old_filename and os.path.exists(os.path.join(DOWNLOAD_DIR, old_filename))
            
            if is_file_on_disk and old_file_id == file_id:
                print(f"[{get_current_time()}] [Thành công] Mod '{project_title}' đã là bản mới nhất: {filename} -> Bỏ qua.")
                success_count += 1
            else:
                if is_file_on_disk:
                    old_file_path = os.path.join(DOWNLOAD_DIR, old_filename)
                    try:
                        os.remove(old_file_path)
                        print(f"[{get_current_time()}] [Đã cập nhật] Phát hiện bản mới: ID {old_file_id} -> {file_id}. Đã xóa tệp cũ.")
                    except Exception as e:
                        print(f"[{get_current_time()}] [Cảnh báo] Không thể xóa tệp cũ '{old_filename}': {e}")
                else:
                    print(f"[{get_current_time()}] [Thành công] Tìm thấy tệp mới '{filename}' cho mod '{project_title}'. Tiến hành tải...")
                
                print(f"               -> Đang tải: {filename}...")
                if download_file(download_url, target_path, filename):
                    manifest[mod] = {
                        "file_id": file_id,
                        "filename": filename,
                        "downloaded_at": datetime.now().isoformat()
                    }
                    save_manifest(manifest)
                    print(f"               -> Tải thành công!")
                    if is_file_on_disk:
                        updated_count += 1
                    else:
                        success_count += 1
                else:
                    error_count += 1
                    
        except Exception as e:
            print(f"[{get_current_time()}] [Lỗi] Lỗi khi xử lý mod '{mod}': {e}")
            error_count += 1
            
        print("-" * 50)
        
    print("\\n" + "=" * 70)
    print("KẾT QUẢ HOÀN THÀNH:")
    print(f"  - Thành công: {success_count} mods")
    print(f"  - Đã cập nhật: {updated_count} mods")
    print(f"  - Gặp lỗi:    {error_count} mods")
    print("=" * 70)

if __name__ == "__main__":
    main()
`;
  }

  // Modrinth script fallback/original
  return `#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Kịch bản Python tự động cập nhật và tải về các Minecraft mods phiên bản mới nhất từ Modrinth API.
Hỗ trợ tự động kiểm tra, so sánh ngày phát hành, tránh tải trùng, và xóa phiên bản cũ khi cập nhật.
"""

import os
import json
import sys
from datetime import datetime

# Đảm bảo thư viện 'requests' đã được cài đặt
try:
    import requests
except ImportError:
    print("[Hệ thống] Thư viện 'requests' chưa được cài đặt!")
    print("Vui lòng chạy lệnh sau để cài đặt: pip install requests")
    sys.exit(1)

# ==================== CẤU HÌNH SCRIPT ====================
MINECRAFT_VERSION = "${minecraftVersion}"
LOADER = "${loader.toLowerCase()}"
RELEASE_CHANNEL = "${releaseChannel}" # "release" (mặc định) hoặc "beta"
BASE_DIR = "minecraft_pack"
MODS_DIR = os.path.join(BASE_DIR, "mods")
RESOURCEPACKS_DIR = os.path.join(BASE_DIR, "resourcepacks")
SHADERPACKS_DIR = os.path.join(BASE_DIR, "shaderpacks")
MANIFEST_FILE = os.path.join(BASE_DIR, "manifest.json")

# Danh sách slug/ID của các mod, resource pack & shader từ Modrinth
MODS = [
${modsListString}
]

# Danh sách resource pack đã biết để tự động phân loại
KNOWN_RESOURCE_PACKS = [
    "fresh-animations", "3d-default", "bare-bones", "itembound-rebound", 
    "clean-connected-glass", "freshanimations", "3dcreatorcraft", "barebones",
    "refined-tools", "fresh-food", "fresh-music-discs", "fresh-flowers-and-plants", "fresh-buckets"
]

# Danh sách shaders đã biết để tự động phân loại vào shaderpacks/
KNOWN_SHADERS = [
    "bsl-shaders", "complementary-reimagined", "makeup-ultra-fast", "sildurs-vibrant-shaders",
    "bsl", "complementary", "makeup", "sildur", "sildurs", "iris-shaders"
]
# =========================================================

def get_current_time():
    """Trả về chuỗi thời gian hiện tại định dạng hh:mm:ss"""
    return datetime.now().strftime("%H:%M:%S")

def load_manifest():
    """Tải tệp manifest lưu trữ thông tin các mods & packs đã tải"""
    if os.path.exists(MANIFEST_FILE):
        try:
            with open(MANIFEST_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[{get_current_time()}] [Cảnh báo] Không thể đọc manifest.json: {e}")
            return {}
    return {}

def save_manifest(manifest):
    """Lưu trữ trạng thái tải xuống vào manifest.json"""
    try:
        with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"[{get_current_time()}] [Lỗi] Không thể lưu manifest.json: {e}")

def create_guide_file():
    """Tạo file hướng dẫn cài đặt sau khi giải nén"""
    guide_path = os.path.join(BASE_DIR, "HUONG_DAN_CAI_DAT.txt")
    guide_content = """=== HƯỚNG DẪN CÀI ĐẶT MODS, RESOURCE PACKS & SHADERS MINECRAFT ===

Sau khi giải nén, bạn sẽ thấy 3 thư mục riêng biệt:

1. THƯ MỤC 'mods':
   - Chứa toàn bộ các file .jar (Fabric API, Sodium, Iris, Lithium, EMF, ETF, AppleSkin, v.v.).
   - Hãy copy toàn bộ các file trong thư mục 'mods' dán vào:
     .minecraft/mods  (hoặc thư mục mods của Launcher bạn đang dùng).

2. THƯ MỤC 'resourcepacks':
   - Chứa các file .zip gói tài nguyên (Fresh Animations, Fresh Food, Fresh Buckets, Refined Tools, 3D Default,...).
   - Hãy copy toàn bộ các file trong thư mục 'resourcepacks' dán vào:
     .minecraft/resourcepacks
   - Sau đó vào Minecraft -> Options -> Resource Packs -> Kích hoạt sang bên phải!

3. THƯ MỤC 'shaderpacks':
   - Chứa các file .zip Shaders đồ họa (BSL Shaders, Complementary Reimagined, MakeUp UltraFast, Sildur's Vibrant,...).
   - Hãy copy toàn bộ các file trong thư mục 'shaderpacks' dán vào:
     .minecraft/shaderpacks
   - Sau đó vào Minecraft -> Video Settings -> Shader Packs -> Chọn Shader muốn dùng và Bật (Apply)!
"""
    try:
        with open(guide_path, "w", encoding="utf-8") as f:
            f.write(guide_content)
    except Exception:
        pass

def download_file(url, path, filename):
    """Tải tệp từ URL về đường dẫn chỉ định hiển thị tiến trình đơn giản"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        downloaded = 0
        
        with open(path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    
        return True
    except Exception as e:
        print(f"\\n[{get_current_time()}] [Lỗi] Tải xuống thất bại cho '{filename}': {e}")
        return False

def main():
    # 1. Tạo các thư mục lưu trữ riêng biệt nếu chưa có
    try:
        os.makedirs(MODS_DIR, exist_ok=True)
        os.makedirs(RESOURCEPACKS_DIR, exist_ok=True)
        os.makedirs(SHADERPACKS_DIR, exist_ok=True)
        create_guide_file()
        print(f"[{get_current_time()}] [Hệ thống] Đã khởi tạo 3 thư mục riêng biệt:")
        print(f"  + Thư mục Mods (.jar): '{os.path.abspath(MODS_DIR)}'")
        print(f"  + Thư mục Resource Packs (.zip): '{os.path.abspath(RESOURCEPACKS_DIR)}'")
        print(f"  + Thư mục Shaders (.zip): '{os.path.abspath(SHADERPACKS_DIR)}'")
    except Exception as e:
        print(f"[{get_current_time()}] [Lỗi] Không thể tạo thư mục lưu trữ: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"[{get_current_time()}] [Lỗi] Không thể tạo thư mục lưu trữ: {e}")
        sys.exit(1)
        
    manifest = load_manifest()
    
    print("=" * 70)
    print(f"BẮT ĐẦU KIỂM TRA & TẢI MODS CHO MINECRAFT {MINECRAFT_VERSION} ({LOADER.upper()})")
    print(f"Thư mục gốc: {os.path.abspath(BASE_DIR)}")
    print("=" * 70)
    
    success_count = 0
    updated_count = 0
    error_count = 0
    
    # Thiết lập User-Agent thân thiện theo quy định của Modrinth API
    headers = {
        "User-Agent": "FabricModDownloaderScript/1.0 (trantrithanhthanh173@gmail.com)"
    }
    
    for mod in MODS:
        mod = mod.strip()
        if not mod:
            continue
            
        print(f"[{get_current_time()}] [Kiểm tra] Đang kiểm tra: {mod}...")
        
        try:
            # 2. Gọi Modrinth API lấy thông tin project & phiên bản
            proj_url = f"https://api.modrinth.com/v2/project/{mod}"
            proj_resp = requests.get(proj_url, headers=headers)
            project_type = "mod"
            if proj_resp.status_code == 200:
                project_type = proj_resp.json().get("project_type", "mod")

            api_url = f"https://api.modrinth.com/v2/project/{mod}/version"
            response = requests.get(api_url, headers=headers)
            
            if response.status_code == 404:
                print(f"[{get_current_time()}] [Lỗi] Không tìm thấy '{mod}' trên hệ thống Modrinth. Vui lòng kiểm tra lại slug.")
                error_count += 1
                continue
                
            response.raise_for_status()
            versions_data = response.json()
            
            # 3. Lọc phiên bản phù hợp với loader và phiên bản Minecraft được chọn
            # Đối với Resource Pack: chấp nhận loader 'minecraft' hoặc không bắt buộc strict loader
            valid_versions = []
            for ver in versions_data:
                loaders = [l.lower() for l in ver.get("loaders", [])]
                game_versions = ver.get("game_versions", [])
                
                has_loader = (LOADER in loaders) or ("minecraft" in loaders) or (len(loaders) == 0) or (project_type == "resourcepack")
                has_mc = MINECRAFT_VERSION in game_versions
                
                if has_loader and has_mc:
                    valid_versions.append(ver)
            
            # Fallback nếu là resource pack có thể tương thích các bản game lân cận
            if not valid_versions and (project_type == "resourcepack" or mod.lower() in KNOWN_RESOURCE_PACKS):
                mc_prefix = ".".join(MINECRAFT_VERSION.split(".")[:2])
                for ver in versions_data:
                    loaders = [l.lower() for l in ver.get("loaders", [])]
                    game_versions = ver.get("game_versions", [])
                    has_loader = (LOADER in loaders) or ("minecraft" in loaders) or (len(loaders) == 0) or (project_type == "resourcepack")
                    has_mc_prefix = any(gv.startswith(mc_prefix) for gv in game_versions)
                    if has_loader and has_mc_prefix:
                        valid_versions.append(ver)
            
            if not valid_versions:
                print(f"[{get_current_time()}] [Bỏ qua] Không tìm thấy phiên bản nào tương thích cho '{mod}' trên Minecraft {MINECRAFT_VERSION} + {LOADER.upper()}.")
                error_count += 1
                continue
                
            # 4. Lọc phiên bản theo kênh phát hành (Release hoặc Beta)
            if RELEASE_CHANNEL == "beta":
                # Kênh Beta: Lấy bản mới nhất trong số Release và Beta
                beta_or_release = [v for v in valid_versions if v.get("version_type") in ("release", "beta")]
                if beta_or_release:
                    beta_or_release.sort(key=lambda x: x.get("date_published", ""), reverse=True)
                    latest_version = beta_or_release[0]
                else:
                    valid_versions.sort(key=lambda x: x.get("date_published", ""), reverse=True)
                    latest_version = valid_versions[0]
            else:
                # Kênh Release (Mặc định): Ưu tiên bản Release chính thức
                release_versions = [v for v in valid_versions if v.get("version_type") == "release"]
                beta_versions = [v for v in valid_versions if v.get("version_type") == "beta"]
                
                if release_versions:
                    release_versions.sort(key=lambda x: x.get("date_published", ""), reverse=True)
                    latest_version = release_versions[0]
                elif beta_versions:
                    beta_versions.sort(key=lambda x: x.get("date_published", ""), reverse=True)
                    latest_version = beta_versions[0]
                else:
                    valid_versions.sort(key=lambda x: x.get("date_published", ""), reverse=True)
                    latest_version = valid_versions[0]
            
            version_number = latest_version.get("version_number")
            files = latest_version.get("files", [])
            
            if not files:
                print(f"[{get_current_time()}] [Lỗi] Phiên bản {version_number} của '{mod}' không có tệp đính kèm để tải về.")
                error_count += 1
                continue
                
            primary_file = next((f for f in files if f.get("primary")), files[0])
            filename = primary_file.get("filename")
            download_url = primary_file.get("url")
            
            # Phân loại thư mục: mods/, resourcepacks/ hoặc shaderpacks/
            is_shader = (project_type == "shader") or (mod.lower() in KNOWN_SHADERS) or ("shader" in mod.lower())
            is_resource_pack = (project_type == "resourcepack") or (mod.lower() in KNOWN_RESOURCE_PACKS)

            if is_shader:
                target_folder = SHADERPACKS_DIR
                folder_name = "shaderpacks"
            elif is_resource_pack or filename.lower().endswith(".zip"):
                target_folder = RESOURCEPACKS_DIR
                folder_name = "resourcepacks"
            else:
                target_folder = MODS_DIR
                folder_name = "mods"

            target_path = os.path.join(target_folder, filename)
            
            # 5. Kiểm tra tính trùng lặp và tiến hành cập nhật/tải về
            old_filename = manifest.get(mod, {}).get("filename")
            old_version = manifest.get(mod, {}).get("version_number")
            old_folder = manifest.get(mod, {}).get("folder", folder_name)
            old_file_path = os.path.join(BASE_DIR, old_folder, old_filename) if old_filename else None
            
            is_file_on_disk = old_file_path and os.path.exists(old_file_path)
            
            if is_file_on_disk and old_version == version_number:
                print(f"[{get_current_time()}] [Đã lưu] '{mod}' đã ở bản mới nhất: {version_number} ({folder_name}/{filename}) -> Bỏ qua.")
                success_count += 1
            else:
                if is_file_on_disk:
                    try:
                        os.remove(old_file_path)
                        print(f"[{get_current_time()}] [Đã cập nhật] Phát hiện bản mới hơn cho '{mod}': {old_version} -> {version_number}.")
                        print(f"               Đã xóa tệp cũ thành công: '{old_folder}/{old_filename}'")
                    except Exception as e:
                        print(f"[{get_current_time()}] [Cảnh báo] Không thể xóa tệp cũ '{old_filename}': {e}")
                else:
                    if old_filename:
                        print(f"[{get_current_time()}] [Đã cập nhật] Phát hiện tệp cũ '{old_filename}' bị thiếu trên ổ đĩa. Tải lại phiên bản {version_number}...")
                    else:
                        print(f"[{get_current_time()}] [Thành công] Tìm thấy mục mới '{mod}' phiên bản {version_number}. Bắt đầu tải...")
                
                print(f"               -> Đang tải vào [{folder_name}/]: {filename}...")
                if download_file(download_url, target_path, filename):
                    manifest[mod] = {
                        "version_number": version_number,
                        "filename": filename,
                        "folder": folder_name,
                        "downloaded_at": datetime.now().isoformat()
                    }
                    save_manifest(manifest)
                    print(f"               -> Tải thành công vào {folder_name}/!")
                    if is_file_on_disk:
                        updated_count += 1
                    else:
                        success_count += 1
                else:
                    error_count += 1
                    
        except Exception as e:
            print(f"[{get_current_time()}] [Lỗi] Lỗi ngoài ý muốn khi xử lý mod '{mod}': {e}")
            error_count += 1
            
        print("-" * 50)
        
    print("\n" + "=" * 70)
    print("KẾT QUẢ HOÀN THÀNH:")
    print(f"  - Thành công (Mới/Giữ nguyên): {success_count} mods")
    print(f"  - Đã cập nhật (Có bản mới):   {updated_count} mods")
    print(f"  - Gặp lỗi (Không tải được):   {error_count} mods")
    print("=" * 70)

if __name__ == "__main__":
    main()
`;
}

/**
 * Default folder paths configuration for Minecraft
 */
export const DEFAULT_FOLDER_PATHS: FolderPathsConfig = {
  autoInstallEnabled: false,
  baseMinecraftPath: "%appdata%\\.minecraft",
  modsPath: "%appdata%\\.minecraft\\mods",
  resourcePacksPath: "%appdata%\\.minecraft\\resourcepacks",
  shadersPath: "%appdata%\\.minecraft\\shaderpacks",
};

export interface LauncherPreset {
  id: string;
  name: string;
  platform: "windows" | "mac" | "linux";
  basePath: string;
  modsPath: string;
  resourcePacksPath: string;
  shadersPath: string;
  description: string;
}

export const LAUNCHER_PRESETS: LauncherPreset[] = [
  {
    id: "win-default",
    name: "Windows Tiêu Chuẩn (.minecraft)",
    platform: "windows",
    basePath: "%appdata%\\.minecraft",
    modsPath: "%appdata%\\.minecraft\\mods",
    resourcePacksPath: "%appdata%\\.minecraft\\resourcepacks",
    shadersPath: "%appdata%\\.minecraft\\shaderpacks",
    description: "Thư mục mặc định của Minecraft Launcher trên Windows"
  },
  {
    id: "win-curseforge",
    name: "CurseForge App (Windows)",
    platform: "windows",
    basePath: "C:\\Users\\%USERNAME%\\curseforge\\minecraft\\Instances\\<TenInstance>",
    modsPath: "C:\\Users\\%USERNAME%\\curseforge\\minecraft\\Instances\\<TenInstance>\\mods",
    resourcePacksPath: "C:\\Users\\%USERNAME%\\curseforge\\minecraft\\Instances\\<TenInstance>\\resourcepacks",
    shadersPath: "C:\\Users\\%USERNAME%\\curseforge\\minecraft\\Instances\\<TenInstance>\\shaderpacks",
    description: "Đường dẫn thư mục Profile của ứng dụng CurseForge"
  },
  {
    id: "win-prism",
    name: "Prism Launcher (Windows)",
    platform: "windows",
    basePath: "%appdata%\\PrismLauncher\\instances\\<TenInstance>\\.minecraft",
    modsPath: "%appdata%\\PrismLauncher\\instances\\<TenInstance>\\.minecraft\\mods",
    resourcePacksPath: "%appdata%\\PrismLauncher\\instances\\<TenInstance>\\.minecraft\\resourcepacks",
    shadersPath: "%appdata%\\PrismLauncher\\instances\\<TenInstance>\\.minecraft\\shaderpacks",
    description: "Instance của Prism Launcher / MultiMC trên Windows"
  },
  {
    id: "mac-default",
    name: "macOS Tiêu Chuẩn (Library)",
    platform: "mac",
    basePath: "~/Library/Application Support/minecraft",
    modsPath: "~/Library/Application Support/minecraft/mods",
    resourcePacksPath: "~/Library/Application Support/minecraft/resourcepacks",
    shadersPath: "~/Library/Application Support/minecraft/shaderpacks",
    description: "Thư mục mặc định của Minecraft trên Apple macOS"
  },
  {
    id: "linux-default",
    name: "Linux Tiêu Chuẩn (~/.minecraft)",
    platform: "linux",
    basePath: "~/.minecraft",
    modsPath: "~/.minecraft/mods",
    resourcePacksPath: "~/.minecraft/resourcepacks",
    shadersPath: "~/.minecraft/shaderpacks",
    description: "Thư mục gốc Minecraft trên hệ điều hành Linux / Ubuntu"
  }
];

/**
 * Generates an Auto-Install Windows Batch script based on user configured paths
 */
export function generateAutoInstallBat(
  modsPath: string,
  resourcePacksPath: string,
  shadersPath: string
): string {
  return `@echo off
chcp 65001 >nul
title MINECRAFT AUTO-INSTALLER - MOD SYNC
cls
echo ====================================================================
echo      MINECRAFT AUTO-INSTALLER SCRIPT (1-CLICK SYNC)
echo ====================================================================
echo.
echo [1/3] Kiem tra duong dan thu muc mod...
set "TARGET_MODS=${modsPath}"
set "TARGET_RP=${resourcePacksPath}"
set "TARGET_SH=${shadersPath}"

echo - Mods:          %TARGET_MODS%
echo - ResourcePacks: %TARGET_RP%
echo - ShaderPacks:   %TARGET_SH%
echo.

if not exist "%TARGET_MODS%" (
    echo [*] Dang tao thu muc mods: %TARGET_MODS%
    mkdir "%TARGET_MODS%" 2>nul
)

if not exist "%TARGET_RP%" (
    echo [*] Dang tao thu muc resourcepacks: %TARGET_RP%
    mkdir "%TARGET_RP%" 2>nul
)

if not exist "%TARGET_SH%" (
    echo [*] Dang tao thu muc shaderpacks: %TARGET_SH%
    mkdir "%TARGET_SH%" 2>nul
)

echo.
echo ====================================================================
echo Dang tien hanh copy cac tep vao thu muc game...
echo ====================================================================

if exist "mods" (
    echo [*] Dang sao chep toan bo mod (.jar) vao: %TARGET_MODS%
    xcopy /Y /E "mods\\*.*" "%TARGET_MODS%\\" >nul
    echo [OK] Da sao chep xong mods!
) else (
    echo [Bo qua] Khong tim thay thu muc 'mods' o thu muc chay script.
)

if exist "resourcepacks" (
    echo [*] Dang sao chep resource packs (.zip) vao: %TARGET_RP%
    xcopy /Y /E "resourcepacks\\*.*" "%TARGET_RP%\\" >nul
    echo [OK] Da sao chep xong resource packs!
) else (
    echo [Bo qua] Khong tim thay thu muc 'resourcepacks'.
)

if exist "shaderpacks" (
    echo [*] Dang sao chep shader packs (.zip) vao: %TARGET_SH%
    xcopy /Y /E "shaderpacks\\*.*" "%TARGET_SH%\\" >nul
    echo [OK] Da sao chep xong shader packs!
) else (
    echo [Bo qua] Khong tim thay thu muc 'shaderpacks'.
)

echo.
echo ====================================================================
echo [THANH CONG] Toan bo tep da duoc tu dong cai vao thu muc Minecraft!
echo Ban co the khoi dong Minecraft Launcher va thuong thuc game!
echo ====================================================================
pause
`;
}

/**
 * Generates an Auto-Install Unix Shell script (macOS/Linux)
 */
export function generateAutoInstallSh(
  modsPath: string,
  resourcePacksPath: string,
  shadersPath: string
): string {
  return `#!/bin/bash
# ====================================================================
# MINECRAFT AUTO-INSTALLER SCRIPT (macOS / Linux)
# ====================================================================

TARGET_MODS="${modsPath.replace(/\\/g, "/")}"
TARGET_RP="${resourcePacksPath.replace(/\\/g, "/")}"
TARGET_SH="${shadersPath.replace(/\\/g, "/")}"

# Expand home directory ~ if present
TARGET_MODS="\${TARGET_MODS/#\\~/$HOME}"
TARGET_RP="\${TARGET_RP/#\\~/$HOME}"
TARGET_SH="\${TARGET_SH/#\\~/$HOME}"

echo "===================================================================="
echo "    MINECRAFT AUTO-INSTALLER (1-CLICK SYNC)"
echo "===================================================================="
echo "Mods folder:          \$TARGET_MODS"
echo "ResourcePacks folder: \$TARGET_RP"
echo "ShaderPacks folder:   \$TARGET_SH"
echo ""

mkdir -p "\$TARGET_MODS"
mkdir -p "\$TARGET_RP"
mkdir -p "\$TARGET_SH"

if [ -d "mods" ]; then
    echo "[*] Dang sao chep mods..."
    cp -rf mods/* "\$TARGET_MODS/" 2>/dev/null || true
    echo "[OK] Da sao chep xong mods!"
fi

if [ -d "resourcepacks" ]; then
    echo "[*] Dang sao chep resourcepacks..."
    cp -rf resourcepacks/* "\$TARGET_RP/" 2>/dev/null || true
    echo "[OK] Da sao chep xong resourcepacks!"
fi

if [ -d "shaderpacks" ]; then
    echo "[*] Dang sao chep shaderpacks..."
    cp -rf shaderpacks/* "\$TARGET_SH/" 2>/dev/null || true
    echo "[OK] Da sao chep xong shaderpacks!"
fi

echo ""
echo "===================================================================="
echo "[THANH CONG] Toan bo tep da duoc sao chep vao Minecraft!"
echo "===================================================================="
`;
}
