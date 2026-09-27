var require = function(name) {
  if (name === "react/jsx-runtime") {
    return {
      jsx: function(type, props, key) {
        return React.createElement(type, Object.assign({}, props, key === undefined ? null : { key: key }));
      },
      jsxs: function(type, props, key) {
        return React.createElement(type, Object.assign({}, props, key === undefined ? null : { key: key }));
      },
      Fragment: React.Fragment
    };
  }
  throw new Error("Unsupported module: " + name);
};
"use strict";

var _jsxRuntime = require("react/jsx-runtime");
const {
  useState,
  useMemo,
  useEffect,
  useRef
} = React;

const IconPlus = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-5 h-5",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 4v16m8-8H4"
  })
});
const IconSettings = () => /*#__PURE__*/(0, _jsxRuntime.jsxs)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  })]
});
const IconTrash = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  })
});
const IconEdit = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
  })
});
const IconEye = () => /*#__PURE__*/(0, _jsxRuntime.jsxs)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
  })]
});
const IconX = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-5 h-5",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M6 18L18 6M6 6l12 12"
  })
});
const IconImage = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-8 h-8 text-stone-300",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
  })
});
const IconGrid = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-5 h-5",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
  })
});
const IconList = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-5 h-5",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 6h16M4 12h16M4 18h16"
  })
});
const IconBox = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
  })
});
const IconDownload = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
  })
});
const IconClone = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
  })
});
const IconBolt = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M13 10V3L4 14h7v7l9-11h-7z"
  })
});
const IconExternalLink = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-3 h-3",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
  })
});
const IconGripVertical = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4 text-stone-400",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 5v.01M12 12v.01M12 19v.01M8 5v.01M8 12v.01M8 19v.01"
  })
});
const IconUndo = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
  })
});

const BASE_CATEGORIES = ['Κολιέ', 'Δαχτυλίδια', 'Σκουλαρίκια', 'Βραχιόλια', 'Καρφίτσες', 'Σετ', 'Θήκες Κινητών'];
const BASE_STATUSES = ['Διαθέσιμο', 'Πουλήθηκε', 'Δωρίστηκε', 'Προσωπική Συλλογή', 'Υπό Κατασκευή'];
const BASE_MATERIALS = ['Υγρό Γυαλί', 'Αποξηραμένα Άνθη', 'Φύλλα Χρυσού', 'Ασήμι 925', 'Ορείχαλκος', 'Ακρυλικά Χρώματα'];
const BASE_PLATFORMS = ['Vinted', 'Wix', 'Instagram', 'Facebook', 'TikTok', 'Etsy', 'Φυσικό Κατάστημα'];
const BASE_COLORS = ['Διάφανο', 'Μαύρο', 'Λευκό', 'Χρυσό', 'Ασημί', 'Κόκκινο', 'Μπλε', 'Πράσινο', 'Ροζ', 'Μωβ', 'Κίτρινο', 'Πολύχρωμο'];

const DEFAULT_SHOP_SETTINGS = {
  fontFamily: 'Jura',
  primaryColor: '#1c1917',
  bgColor: '#fafafa',
  textColor: '#1c1917',
  heroBgColor: '#1c1917',
  heroTitleColor: '#ffffff',
  heroSubtitleColor: '#a8a29e',
  heroTitleSize: 'text-3xl md:text-4xl',
  borderRadius: '0.75rem',
  heroVideoMode: 'auto',
  heroVideoItemId: '',
  heroVideoUrl: '',
  heroMinHeight: '72vh',
  heroOverlayOpacity: 0.12,
  heroTitle: 'Χειροποίητες Δημιουργίες',
  heroSubtitle: 'Μοναδικές δημιουργίες από μια μεγάλη γκάμα υλικών και τεχνικών. Κάθε κομμάτι είναι φτιαγμένο στο χέρι με αγάπη.',
  categoryOrder: [...BASE_CATEGORIES, 'Άλλα'],
  fallbackLinks: {
    'Vinted': '',
    'Wix': '',
    'Instagram': '',
    'Facebook': '',
    'TikTok': '',
    'Etsy': ''
  },
  aiAssistant: {
    backofficeEndpoint: ''
  }
};

const DEFAULT_VINTED_FEES = {
  buyerFixed: 0.70,
  buyerPercent: 5,
  shippingMin: 1.55,
  rounding: 'up_050'
};
const VINTED_FEE_STORAGE_KEY = 'aram_vinted_fee_settings';

const parseMoneyValue = value => {
  const cleaned = String(value ?? '').replace('€', '').replace(',', '.').replace(/[^\d.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};
const formatMoneyValue = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : '0.00';
};
const roundVintedSitePrice = (value, mode = 'nearest_050') => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  if (mode === 'up_050') return Math.ceil(parsed * 2) / 2;
  if (mode === 'nearest_100') return Math.round(parsed);
  if (mode === 'up_100') return Math.ceil(parsed);
  if (mode === 'none') return Math.round(parsed * 100) / 100;
  return Math.round(parsed * 2) / 2;
};
const calculateVintedPricing = (basePrice, feeSettings = DEFAULT_VINTED_FEES) => {
  const vintedBasePrice = parseMoneyValue(basePrice);
  const buyerFixed = parseMoneyValue(feeSettings.buyerFixed);
  const buyerPercent = parseMoneyValue(feeSettings.buyerPercent);
  const shippingMin = parseMoneyValue(feeSettings.shippingMin);
  const buyerProtection = vintedBasePrice > 0 ? buyerFixed + vintedBasePrice * buyerPercent / 100 : 0;
  const estimatedTotal = vintedBasePrice + buyerProtection + shippingMin;
  const sitePrice = roundVintedSitePrice(estimatedTotal, feeSettings.rounding);
  return {
    vintedBasePrice: Number(vintedBasePrice.toFixed(2)),
    buyerProtection: Number(buyerProtection.toFixed(2)),
    buyerFixed: Number(buyerFixed.toFixed(2)),
    buyerPercent: Number(buyerPercent.toFixed(2)),
    shippingMin: Number(shippingMin.toFixed(2)),
    estimatedTotal: Number(estimatedTotal.toFixed(2)),
    sitePrice: Number(sitePrice.toFixed(2)),
    rounding: feeSettings.rounding || 'nearest_050',
    parcelProfile: 'small_parcel_gr'
  };
};
const itemHasVintedLink = (item = {}) => {
  const safeItem = item || {};
  const links = [...(safeItem.purchaseLinks || safeItem.productLinks || []), ...(safeItem.postedPlatforms || [])];
  return links.some(link => String(link.site || '').toLowerCase() === 'vinted' || /vinted\./i.test(String(link.url || ''))) || String(safeItem.sourcePlatform || '').toLowerCase() === 'vinted';
};
const getItemVintedBasePrice = (item = {}) => {
  const safeItem = item || {};
  return parseMoneyValue(safeItem.vintedBasePrice || safeItem.vintedPricing?.vintedBasePrice || safeItem.price);
};
const ADMIN_PRODUCTS_CACHE_KEY = 'aram_admin_products_cache';
const ADMIN_SHOP_SETTINGS_CACHE_KEY = 'aram_admin_shop_settings_cache';
const readJsonCache = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (err) {
    return fallback;
  }
};
const writeJsonCache = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {}
};
const normalizeVideoUrl = rawUrl => {
  const url = String(rawUrl || '').trim();
  if (!url) return '';
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i) || url.match(/[?&]id=([^&]+)/i);
  if (driveMatch?.[1] && /drive\.google\.com/i.test(url)) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  }
  return url;
};
const MINIMAL_SHOP_SETTINGS = {
  ...DEFAULT_SHOP_SETTINGS,
  primaryColor: '#111111',
  bgColor: '#ffffff',
  textColor: '#111111',
  heroBgColor: '#ffffff',
  heroTitleColor: '#111111',
  heroSubtitleColor: '#57534e',
  borderRadius: '0.5rem',
  heroTitleSize: 'text-2xl md:text-3xl'
};
const isSoldItem = (item = {}) => {
  const safeItem = item || {};
  return safeItem.status === 'Πουλήθηκε' || Number(safeItem.stock || 0) === 0;
};
const isAvailableItem = (item = {}) => {
  const safeItem = item || {};
  return safeItem.status === 'Διαθέσιμο' && Number(safeItem.stock || 0) > 0;
};
const isUnavailableItem = (item = {}) => !isAvailableItem(item || {}) && !isSoldItem(item || {});
const splitTags = value => String(value || '').split(',').map(v => v.trim()).filter(Boolean);
const splitCleanupTerms = value => String(value || '').split(/[\n,]/).map(v => v.trim()).filter(Boolean);
const escapeRegExp = value => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const removeTermsFromText = (text, terms = []) => {
  const source = String(text || '');
  const cleanedTerms = Array.from(new Set((terms || []).map(term => String(term || '').trim()).filter(Boolean))).sort((a, b) => b.length - a.length);
  if (!source || cleanedTerms.length === 0) return source.trim();
  let nextText = source;
  cleanedTerms.forEach(term => {
    const pattern = new RegExp(escapeRegExp(term), 'gi');
    nextText = nextText.replace(pattern, ' ');
  });
  return nextText.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
};
const mergeUnique = (current = [], incoming = []) => Array.from(new Set([...current, ...incoming].filter(Boolean)));
const getEffectiveQty = (item = {}) => Math.max(Number((item || {}).stock || 0), 1);
const readStoredList = key => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value.filter(Boolean) : [];
  } catch (err) {
    return [];
  }
};
const writeStoredList = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(new Set((value || []).filter(Boolean)))));
  } catch (err) {}
};
const normalizeForMatch = (value = '') => value.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[._\-_/]+/g, ' ').replace(/\s+/g, ' ').trim();
const CATEGORY_KEYWORD_HINTS = {
  'Κολιέ': ['κολιε', 'περιδεραιο', 'μενταγιον', 'αλυσιδα', 'λαιμου', 'necklace', 'pendant', 'choker', 'chain', 'collar'],
  'Σκουλαρίκια': ['σκουλαρ', 'κρικοι', 'καρφωτα', 'αυτια', 'earring', 'earrings', 'studs', 'hoops', 'dangles', 'ear cuff'],
  'Βραχιόλια': ['βραχιολ', 'χειροπεδα', 'bracelet', 'bangle', 'cuff'],
  'Δαχτυλίδια': ['δαχτυλ', 'δαχτυλιδι', 'ring', 'rings'],
  'Καρφίτσες': ['καρφιτ', 'παραμανα', 'brooch', 'pin', 'lapel pin'],
  'Θήκες Κινητών': ['θηκη', 'κινητο', 'κινητου', 'τηλεφωνο', 'phone case', 'mobile case', 'case', 'phone', 'mobile'],
  'Σετ': ['σετ', 'ζευγαρι', 'σετακι', 'set', 'combo', 'pair', 'bundle'],
  'Μπρελόκ': ['μπρελοκ', 'κλειδια', 'keychain', 'key ring', 'keyring'],
  'Γούρια': ['γουρι', 'τυχερο', 'charm', 'lucky charm', 'good luck'],
  'Διακοσμητικά': ['διακοσμητικ', 'στολιδι', 'decor', 'decoration', 'ornament'],
  'Σελιδοδείκτες': ['σελιδοδεικ', 'bookmark', 'book mark'],
  'Μαγνητάκια': ['μαγνητ', 'magnet', 'fridge magnet']
};

const compressImage = async file => {
  if (/\.gif$/i.test(file.name || '') || /gif/i.test(file.type || '')) return file;
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_size = 1200;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }, 'image/jpeg', 0.8);
      };
    };
  });
};
const compressImageBlob = async (blob, maxSize = 1400, quality = 0.85) => {
  if (!blob || !/^image\//i.test(blob.type || '')) return blob;
  if (/gif/i.test(blob.type || '')) return blob;
  return new Promise(resolve => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        const ratio = Math.min(1, maxSize / Math.max(width, height));
        width = Math.max(1, Math.round(width * ratio));
        height = Math.max(1, Math.round(height * ratio));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(compressedBlob => {
          URL.revokeObjectURL(objectUrl);
          resolve(compressedBlob || blob);
        }, 'image/jpeg', quality);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        resolve(blob);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(blob);
    };
    img.src = objectUrl;
  });
};
