import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Aram-AI-Secret");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Lazy initialize Gemini API client
let genAiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
    }
    genAiClient = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return genAiClient;
}

// 1. Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "Aram Creations Unified Platform",
    timestamp: new Date().toISOString(),
    firebaseProject: "aramcreations-e1529",
  });
});

// 2. Gemini AI Assistant endpoint
async function handleBackofficeAi(req: Request, res: Response) {
  try {
    const {
      product = {},
      task = "full",
      prompt = "",
      imageDataUrl = "",
      imageDataUrls = [],
    } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is not set yet
      return res.json({
        title: product.name || product.title || "Χειροποίητη Δημιουργία Aram",
        description: product.description || "Χειροποίητο κόσμημα εξαιρετικής ποιότητας, κατασκευασμένο με προσοχή στη λεπτομέρεια και μοναδικά υλικά από το εργαστήριο Aram Creations.",
        category: product.category || "Κολιέ",
        status: "Διαθέσιμο",
        colors: product.colors || ["Χρυσό", "Μπεζ"],
        materials: product.materials || ["Υγρό Γυαλί", "Μέταλλο"],
        tags: ["χειροποίητο", "κόσμημα", "aramcreations", "handmade", "jewelry"],
        shortDescription: product.name || "Χειροποίητο κόσμημα Aram Creations",
        instagramCaption: `✨ ${product.name || "Χειροποίητη Δημιουργία"} ✨\nΦτιαγμένο στο χέρι με αγάπη και μοναδικά υλικά.\n\nΑνακαλύψτε το στο κατάστημά μας! 💛\n#aramcreations #handmadejewelry #greekdesigners #artisan`,
        altText: product.name || "Χειροποίητο κόσμημα Aram Creations",
      });
    }

    const ai = getGenAI();
    const contents: any[] = [];
    const imageList = Array.isArray(imageDataUrls) && imageDataUrls.length > 0
      ? imageDataUrls
      : imageDataUrl ? [imageDataUrl] : [];

    for (const img of imageList.slice(0, 3)) {
      if (typeof img === "string" && img.startsWith("data:")) {
        const matches = img.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (matches) {
          contents.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }
    }

    const systemPrompt = `Είσαι εξειδικευμένος copywriter και ειδικός catalog manager για το brand χειροποίητων κοσμημάτων και έργων τέχνης "Aram Creations".
Παράγεις ελκυστικούς, κομψούς, επαγγελματικούς τίτλους, περιγραφές, κατηγορίες, υλικά, χρώματα, tags και Instagram captions στα Ελληνικά.

Στοιχεία προϊόντος:
- Τίτλος/Όνομα: ${product.name || product.title || "(κενό)"}
- Κατηγορία: ${product.category || "(κενό)"}
- Συλλογή: ${product.collection || "(κενό)"}
- Περιγραφή/Σημειώσεις: ${product.description || product.notes || "(κενό)"}
- Τιμή: ${product.price ? product.price + "€" : "(κενό)"}
- Υλικά: ${Array.isArray(product.materials) ? product.materials.join(", ") : "(κενό)"}
- Χρώματα: ${Array.isArray(product.colors) ? product.colors.join(", ") : "(κενό)"}
${prompt ? `Ειδική απαίτηση: ${prompt}` : ""}
${task ? `Τύπος εργασίας: ${task}` : ""}

Απάντησε ΑΠΟΚΛΕΙΣΤΙΚΑ σε έγκυρο JSON (χωρίς backticks) με τη δομή:
{
  "title": "Ελκυστικός τίτλος στα Ελληνικά",
  "description": "Πλούσια, καλαίσθητη περιγραφή του κοσμήματος στα Ελληνικά",
  "category": "Κολιέ | Σκουλαρίκια | Βραχιόλια | Δαχτυλίδια | Σετ | Καρφίτσες | Θήκες Κινητών | Άλλα",
  "status": "Διαθέσιμο",
  "colors": ["Χρώμα 1", "Χρώμα 2"],
  "materials": ["Υλικό 1", "Υλικό 2"],
  "tags": ["χειροποίητο", "κόσμημα", "aramcreations", "handmade"],
  "shortDescription": "Σύντομη περιγραφή μίας γραμμής στα Ελληνικά",
  "instagramCaption": "Ελκυστικό caption με hashtags για social media",
  "altText": "Περιγραφικό alt text εικόνας στα Ελληνικά"
}`;

    contents.push(systemPrompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const responseText = response.text || "{}";
    let parsedData = {};
    try {
      const cleanJson = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsedData = JSON.parse(cleanJson);
    } catch {
      parsedData = {
        title: product.name || "Χειροποίητη Δημιουργία Aram",
        description: responseText,
        category: product.category || "Κολιέ",
        status: "Διαθέσιμο",
        colors: product.colors || [],
        materials: product.materials || [],
        tags: ["χειροποίητο", "aramcreations"],
        shortDescription: product.name || "Χειροποίητο κόσμημα Aram Creations",
        instagramCaption: `✨ ${product.name || "Χειροποίητο κόσμημα"} ✨ Aram Creations #handmadejewelry #aramcreations`,
        altText: product.name || "Χειροποίητο κόσμημα",
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in backoffice-ai:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI content",
    });
  }
}

app.post("/api/backoffice-ai", handleBackofficeAi);
app.post("/.netlify/functions/backoffice-ai", handleBackofficeAi);

// 3. Vinted Scraper Endpoint with robust multi-image, category, color, material, condition extraction & Gemini AI enhancement
async function handleVintedLink(req: Request, res: Response) {
  try {
    const rawUrl = (req.query.url as string) || (req.body?.url as string);
    if (!rawUrl) {
      return res.status(400).json({ ok: false, error: "Missing 'url' parameter" });
    }

    const decodedUrl = decodeURIComponent(rawUrl.trim());
    if (!/^https?:\/\//i.test(decodedUrl)) {
      return res.status(400).json({ ok: false, error: "Invalid URL format" });
    }

    // Extract item ID if in URL
    const idMatch = decodedUrl.match(/\/items\/(\d+)/i);
    const vintedId = idMatch ? idMatch[1] : "";

    // Generate readable fallback title from URL slug
    const slugMatch = decodedUrl.match(/\/items\/\d+-([^?#]+)/i);
    let fallbackTitle = "Χειροποίητο Κόσμημα Aram";
    if (slugMatch?.[1]) {
      fallbackTitle = slugMatch[1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    let html = "";
    try {
      const response = await fetch(decodedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "el-GR,el;q=0.9,en-US;q=0.8,en;q=0.7",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Upgrade-Insecure-Requests": "1",
        },
      });

      if (response.ok) {
        html = await response.text();
      }
    } catch (fetchErr) {
      console.warn("Direct fetch of Vinted page had error, proceeding with URL extraction:", fetchErr);
    }

    const parseNum = (val: any): number | null => {
      if (val === null || val === undefined) return null;
      if (typeof val === "number" && Number.isFinite(val)) return val;
      const str = String(val).trim().replace("€", "").replace(",", ".").replace(/[^\d.]/g, "");
      const num = parseFloat(str);
      return Number.isFinite(num) ? num : null;
    };

    let title = "";
    let description = "";
    let price: number | null = null;
    let currency = "EUR";
    let favoritesCount: number | null = null;
    let viewsCount: number | null = null;
    let isSold = false;
    let isReserved = false;
    let brand = "";
    let condition = "";
    let extractedCategory = "";
    const extractedColors: string[] = [];
    const extractedMaterials: string[] = [];
    const rawImages: string[] = [];

    if (html) {
      const getMeta = (prop: string): string => {
        const match =
          html.match(new RegExp(`<meta[^>]*property=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i")) ||
          html.match(new RegExp(`<meta[^>]*name=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i")) ||
          html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${prop}["']`, "i")) ||
          html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${prop}["']`, "i"));
        return match ? match[1].trim() : "";
      };

      title = getMeta("og:title") || getMeta("title");
      if (!title) {
        const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
        title = titleMatch ? titleMatch[1].trim() : "";
      }
      title = title.replace(/\s*\|\s*Vinted.*$/i, "").replace(/\s*-\s*Vinted.*$/i, "").trim();

      description = getMeta("og:description") || getMeta("description") || "";
      const mainImage = getMeta("og:image") || getMeta("twitter:image");
      if (mainImage) rawImages.push(mainImage);

      // Extract all vinted image URLs
      const allImageMatches = html.match(/https:\/\/[^"'\s]*vinted\.net\/[^"'\s\>\<\,]+/gi) || [];
      rawImages.push(...allImageMatches);

      // JSON-LD scan
      const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
      if (jsonLdMatches) {
        for (const scriptTag of jsonLdMatches) {
          try {
            const jsonText = scriptTag.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "");
            const parsed = JSON.parse(jsonText);
            const candidates = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed];
            for (const itemNode of candidates) {
              if (!itemNode) continue;
              if (itemNode.name && !title) title = itemNode.name;
              if (itemNode.description && !description) description = itemNode.description;
              if (itemNode.brand?.name) brand = itemNode.brand.name;
              if (itemNode.itemCondition) condition = String(itemNode.itemCondition).replace(/https?:\/\/schema\.org\//i, "");

              if (Array.isArray(itemNode.image)) {
                rawImages.push(...itemNode.image);
              } else if (typeof itemNode.image === "string") {
                rawImages.push(itemNode.image);
              }

              const offers = Array.isArray(itemNode.offers) ? itemNode.offers[0] : itemNode.offers;
              if (offers?.price) {
                const p = parseNum(offers.price);
                if (p !== null && price === null) price = p;
                if (offers.priceCurrency) currency = offers.priceCurrency;
                if (/SoldOut|OutOfStock|Discontinued/i.test(offers.availability || "")) isSold = true;
              }

              if (Array.isArray(itemNode.interactionStatistic)) {
                for (const stat of itemNode.interactionStatistic) {
                  const count = parseNum(stat.userInteractionCount);
                  if (count !== null) {
                    if (/Like|Favorite|Watch/i.test(stat.interactionType?.["@type"] || stat.interactionType || "")) {
                      favoritesCount = count;
                    } else if (/View/i.test(stat.interactionType?.["@type"] || stat.interactionType || "")) {
                      viewsCount = count;
                    }
                  }
                }
              }
            }
          } catch (_) {}
        }
      }

      // __NEXT_DATA__ scan
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/i);
      if (nextDataMatch) {
        try {
          const nextData = JSON.parse(nextDataMatch[1]);
          const itemData =
            nextData.props?.pageProps?.item ||
            nextData.props?.pageProps?.initialState?.item ||
            nextData.props?.pageProps?.product ||
            {};

          if (itemData.title && !title) title = itemData.title;
          if (itemData.description && !description) description = itemData.description;
          const rawPrice = itemData.price?.amount || itemData.price?.numeric || itemData.total_item_price || itemData.price_numeric || itemData.price;
          if (rawPrice && price === null) price = parseNum(rawPrice);
          if (itemData.price?.currency_code) currency = itemData.price.currency_code;
          if (itemData.favourite_count !== undefined && favoritesCount === null) favoritesCount = parseNum(itemData.favourite_count);
          if (itemData.view_count !== undefined && viewsCount === null) viewsCount = parseNum(itemData.view_count);
          if (itemData.is_closed || itemData.is_sold) isSold = true;
          if (itemData.is_reserved) isReserved = true;
          if (itemData.brand_title) brand = itemData.brand_title;
          if (itemData.status || itemData.status_title) condition = itemData.status_title || itemData.status;
          if (itemData.catalog_title || itemData.category_title) extractedCategory = itemData.catalog_title || itemData.category_title;

          if (itemData.color || itemData.color_title) {
            extractedColors.push(itemData.color_title || itemData.color);
          }

          if (Array.isArray(itemData.photos)) {
            for (const photo of itemData.photos) {
              const url = photo.full_size_url || photo.url || photo.high_resolution?.url;
              if (url) rawImages.push(url);
            }
          }
        } catch (_) {}
      }

      // Fallback regex for price
      if (price === null) {
        const priceMeta = getMeta("product:price:amount") || getMeta("og:price:amount");
        if (priceMeta) price = parseNum(priceMeta);
      }
      if (price === null) {
        const priceMatch = html.match(/(\d+[\.,]\d{2})\s*(?:€|EUR)/i) || html.match(/(?:€|EUR)\s*(\d+[\.,]\d{2})/i);
        if (priceMatch) price = parseFloat(priceMatch[1].replace(",", "."));
      }
    }

    // Process and filter unique high-resolution images
    const sanitizedImages: string[] = [];
    const seenImageSet = new Set<string>();

    for (const rawImg of rawImages) {
      if (!rawImg || typeof rawImg !== "string") continue;
      // Clean query parameters and URL quotes
      let cleanUrl = rawImg.replace(/["'\\]/g, "").trim();
      if (cleanUrl.startsWith("//")) cleanUrl = "https:" + cleanUrl;
      if (!/^https?:\/\//i.test(cleanUrl)) continue;

      // Ignore non-product UI images
      if (/avatar|logo|sprite|icon|placeholder|banner|member/i.test(cleanUrl)) continue;

      // Convert thumbnail URLs to full size if possible (Vinted f800 or full_size)
      cleanUrl = cleanUrl.replace(/\/t[0-9]+_/g, "/f800_").replace(/\/s[0-9]+_/g, "/f800_");

      // Extract unique base file ID to avoid duplicates
      const fileIdMatch = cleanUrl.match(/\/([^\/]+_\d+\.(?:jpg|jpeg|png|webp))/i) || [null, cleanUrl];
      const key = fileIdMatch[1] || cleanUrl;

      if (!seenImageSet.has(key)) {
        seenImageSet.add(key);
        sanitizedImages.push(cleanUrl);
      }
    }

    const finalTitle = title || fallbackTitle;
    const finalPrice = price !== null ? price : 15;
    const favSafe = favoritesCount !== null ? favoritesCount : 0;
    const viewsSafe = viewsCount !== null ? viewsCount : 0;

    // Detect Category accurately from text & Vinted metadata
    const textCorpus = `${finalTitle} ${description} ${extractedCategory} ${decodedUrl}`.toLowerCase();
    let mappedCategory = "Κολιέ";
    if (/σκουλαρίκ|earring|earrings|drops|hoops/i.test(textCorpus)) {
      mappedCategory = "Σκουλαρίκια";
    } else if (/βραχιόλ|bracelet|cuff|bangle/i.test(textCorpus)) {
      mappedCategory = "Βραχιόλια";
    } else if (/δαχτυλίδ|ring|signet/i.test(textCorpus)) {
      mappedCategory = "Δαχτυλίδια";
    } else if (/σετ|set|combo/i.test(textCorpus)) {
      mappedCategory = "Σετ";
    } else if (/καρφίτσ|brooch|pin/i.test(textCorpus)) {
      mappedCategory = "Καρφίτσες";
    } else if (/θήκ|case|cover|phone|iphone/i.test(textCorpus)) {
      mappedCategory = "Θήκες Κινητών";
    } else if (/κολιέ|necklace|μενταγιόν|pendant|choker/i.test(textCorpus)) {
      mappedCategory = "Κολιέ";
    } else if (extractedCategory) {
      mappedCategory = "Άλλα";
    }

    // Detect Colors from text
    const colorDictionary: Record<string, string> = {
      χρυσό: "Χρυσό", gold: "Χρυσό", ασημί: "Ασημί", silver: "Ασημί",
      μαύρο: "Μαύρο", black: "Μαύρο", κόκκινο: "Κόκκινο", red: "Κόκκινο",
      μπλε: "Μπλε", blue: "Μπλε", πράσινο: "Πράσινο", green: "Πράσινο",
      ροζ: "Ροζ", pink: "Ροζ", λευκό: "Λευκό", white: "Λευκό",
      μπεζ: "Μπεζ", beige: "Μπεζ", τυρκουάζ: "Τυρκουάζ", turquoise: "Τυρκουάζ",
      φούξια: "Φούξια", fuchsia: "Φούξια", μωβ: "Μωβ", purple: "Μωβ",
      κίτρινο: "Κίτρινο", yellow: "Κίτρινο", καφέ: "Καφέ", brown: "Καφέ",
      διάφανο: "Διάφανο", transparent: "Διάφανο", χάλκινο: "Χαλκός", bronze: "Χαλκός"
    };

    for (const [key, val] of Object.entries(colorDictionary)) {
      if (textCorpus.includes(key) && !extractedColors.includes(val)) {
        extractedColors.push(val);
      }
    }

    // Detect Materials from text
    const materialDictionary: Record<string, string> = {
      "υγρό γυαλί": "Υγρό Γυαλί (Resin)", resin: "Υγρό Γυαλί (Resin)",
      ατσάλι: "Ανοξείδωτο Ατσάλι", steel: "Ανοξείδωτο Ατσάλι",
      ασήμι: "Ασήμι 925", "925": "Ασήμι 925",
      σύρμα: "Χάλκινο Σύρμα", χαλκός: "Χαλκός", copper: "Χαλκός", brass: "Ορείχαλκος",
      άνθη: "Αληθινά Άνθη", λουλούδια: "Αληθινά Άνθη", flowers: "Αληθινά Άνθη",
      βότσαλα: "Φυσικά Βότσαλα", pebbles: "Φυσικά Βότσαλα",
      "φύλλα χρυσού": "Φύλλα Χρυσού 24Κ", goldleaf: "Φύλλα Χρυσού 24Κ",
      πηλός: "Πηλός", clay: "Πηλός"
    };

    for (const [key, val] of Object.entries(materialDictionary)) {
      if (textCorpus.includes(key) && !extractedMaterials.includes(val)) {
        extractedMaterials.push(val);
      }
    }
    if (extractedMaterials.length === 0) {
      extractedMaterials.push("Υγρό Γυαλί", "Μέταλλο");
    }

    // Clean condition text
    let cleanCondition = condition || "Καινούργιο";
    if (/new_with_tags|New with tags|Καινούργιο με ετικέτα/i.test(cleanCondition)) {
      cleanCondition = "Καινούργιο με ετικέτα";
    } else if (/new_without_tags|New without tags|Καινούργιο χωρίς ετικέτα/i.test(cleanCondition)) {
      cleanCondition = "Καινούργιο χωρίς ετικέτα";
    } else if (/very_good|Very good|Πολύ καλή/i.test(cleanCondition)) {
      cleanCondition = "Πολύ καλή κατάσταση";
    } else if (/good|Good|Καλή/i.test(cleanCondition)) {
      cleanCondition = "Καλή κατάσταση";
    }

    const item = {
      id: vintedId || String(Date.now()),
      title: finalTitle,
      name: finalTitle,
      description: description || `Χειροποίητο δημιούργημα Aram Creations. Εισήχθη από το Vinted.`,
      price: finalPrice,
      currency: currency || "EUR",
      category: mappedCategory,
      favorites: favSafe,
      favoritesCount: favSafe,
      views: viewsSafe,
      viewCount: viewsSafe,
      status: isSold ? "Πουλήθηκε" : isReserved ? "Κρατημένο" : "Διαθέσιμο",
      isSold,
      isReserved,
      brand: brand || "Aram Creations",
      condition: cleanCondition,
      materials: extractedMaterials,
      colors: extractedColors,
      sourceUrl: decodedUrl,
      url: decodedUrl,
      photos: sanitizedImages,
      images: sanitizedImages.length > 0 ? sanitizedImages : ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80"],
      image_urls: sanitizedImages.join(", "),
      imageUrl: sanitizedImages[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    };

    return res.json({
      ok: true,
      item,
    });
  } catch (error: any) {
    console.error("Error fetching Vinted item:", error);
    return res.status(500).json({
      ok: false,
      error: error.message || "Failed to process Vinted URL",
    });
  }
}

app.get("/api/vinted-link", handleVintedLink);
app.get("/.netlify/functions/vinted-link", handleVintedLink);

// 4. Image proxy
async function handleImageProxy(req: Request, res: Response) {
  try {
    const rawUrl = (req.query.url as string) || (req.body?.url as string);
    if (!rawUrl) return res.status(400).send("Missing url parameter");
    const decodedUrl = decodeURIComponent(rawUrl.trim());
    if (!/^https?:\/\//i.test(decodedUrl)) return res.status(400).send("Invalid URL");

    const imgResponse = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!imgResponse.ok) return res.status(imgResponse.status).send("Failed to fetch image");
    const contentType = imgResponse.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

    const arrayBuffer = await imgResponse.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    return res.status(500).send(error.message || "Image proxy failed");
  }
}

app.get("/api/vinted-image-proxy", handleImageProxy);
app.get("/.netlify/functions/vinted-image-proxy", handleImageProxy);
app.get("/api/image-proxy", handleImageProxy);

// 5. Orders API (Direct server receipt & fallback)
app.post("/api/orders", (req: Request, res: Response) => {
  const { customer, items, total, shippingMethod, paymentMethod, notes } = req.body || {};
  const orderId = "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  console.log(`[Order Received] ${orderId}: ${items?.length || 0} items, Total: €${total}, Customer: ${customer?.name || "Anonymous"}`);
  return res.json({
    ok: true,
    orderId,
    message: "Η παραγγελία καταχωρήθηκε επιτυχώς!",
    timestamp: new Date().toISOString(),
  });
});

// 6. Serve static public files
app.use(express.static(path.join(process.cwd(), "public")));

// 7. Vite middleware for development & static serving for production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aram Creations] Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
