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
  useEffect
} = React;
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
const IconBag = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
  })
});
const IconExternalLink = () => /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
  className: "w-4 h-4",
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
const isSoldItem = (item = {}) => {
  const status = String(item.status || 'Διαθέσιμο').trim();
  return status !== 'Διαθέσιμο' || Number(item.stock ?? 1) <= 0;
};
const isAvailableItem = (item = {}) => String(item.status || '').trim() === 'Διαθέσιμο' && Number(item.stock ?? 1) > 0;
const getUnavailableLabel = (item = {}) => {
  const status = String(item.status || '').trim();
  if (status === 'Πουλήθηκε') return 'Πουλήθηκε';
  if (status === 'Δωρίστηκε') return 'Δωρίστηκε';
  return 'Μη διαθέσιμο';
};
const formatMoney = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : '0.00';
};
const getVintedPricingInfo = (item = {}) => {
  const pricing = item.vintedPricing || null;
  if (!pricing || !Number(pricing.vintedBasePrice)) return null;
  return pricing;
};
const SHOP_PRODUCTS_CACHE_KEY = 'aram_shop_products_cache';
const SHOP_SETTINGS_CACHE_KEY = 'aram_shop_settings_cache';
const readJsonCache = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};
const writeJsonCache = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
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
function Shop() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [jewelryList, setJewelryList] = useState(() => {
    const cached = readJsonCache(SHOP_PRODUCTS_CACHE_KEY, []);
    return Array.isArray(cached) ? cached : [];
  });
  const [isLoading, setIsLoading] = useState(() => {
    const cached = readJsonCache(SHOP_PRODUCTS_CACHE_KEY, []);
    return !Array.isArray(cached) || cached.length === 0;
  });
  const [loadError, setLoadError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Όλα');
  const [isMobileCategoryMenuOpen, setIsMobileCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('shop_order');
  const [selectedColor, setSelectedColor] = useState('Όλα');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aram_shop_favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [activeDetailMediaIdx, setActiveDetailMediaIdx] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [zoomedMediaUrl, setZoomedMediaUrl] = useState('');

  // --- ΠΛΗΡΕΣ ΠΑΚΕΤΟ ΔΥΝΑΜΙΚΩΝ ΡΥΘΜΙΣΕΩΝ ΕΜΦΑΝΙΣΗΣ ---
  const [settings, setSettings] = useState(() => {
    const cached = readJsonCache(SHOP_SETTINGS_CACHE_KEY, null);
    return {
      fontFamily: cached?.fontFamily || 'Jura',
      primaryColor: cached?.primaryColor || '#1c1917',
      bgColor: cached?.bgColor || '#fafafa',
      textColor: cached?.textColor || '#1c1917',
      heroBgColor: cached?.heroBgColor || '#1c1917',
      heroTitleColor: cached?.heroTitleColor || '#ffffff',
      heroSubtitleColor: cached?.heroSubtitleColor || '#a8a29e',
      heroTitleSize: cached?.heroTitleSize || 'text-3xl md:text-4xl',
      borderRadius: cached?.borderRadius !== undefined ? cached.borderRadius : '0.75rem',
      heroVideoMode: cached?.heroVideoMode || 'auto',
      heroVideoItemId: cached?.heroVideoItemId || '',
      heroVideoUrl: cached?.heroVideoUrl || '',
      heroMinHeight: cached?.heroMinHeight || '72vh',
      heroOverlayOpacity: cached?.heroOverlayOpacity !== undefined ? cached.heroOverlayOpacity : 0.12,
      heroTitle: cached?.heroTitle || 'Χειροποίητες Δημιουργίες',
      heroSubtitle: cached?.heroSubtitle || 'Μοναδικές δημιουργίες από μια μεγάλη γκάμα υλικών και τεχνικών. Κάθε κομμάτι είναι φτιαγμένο στο χέρι με αγάπη.',
      categoryOrder: cached?.categoryOrder || ['Κολιέ', 'Σκουλαρίκια', 'Βραχιόλια', 'Δαχτυλίδια', 'Σετ', 'Καρφίτσες', 'Θήκες Κινητών', 'Άλλα'],
      shopOrderAvailabilityOrder: Array.isArray(cached?.shopOrderAvailabilityOrder) ? cached.shopOrderAvailabilityOrder : ['Διαθέσιμα', 'Πωληθέντα', 'Μη διαθέσιμα'],
      shopOrderCollectionOrder: Array.isArray(cached?.shopOrderCollectionOrder) ? cached.shopOrderCollectionOrder : [],
      fallbackLinks: {
        'Vinted': '',
        'Wix': '',
        'Instagram': '',
        'Facebook': '',
        'TikTok': '',
        'Etsy': '',
        ...(cached?.fallbackLinks || {})
      }
    };
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  useEffect(() => {
    const handleStorage = event => {
      if (event.key === SHOP_PRODUCTS_CACHE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            setJewelryList(parsed);
            setIsLoading(false);
          }
        } catch {}
      }
      if (event.key === SHOP_SETTINGS_CACHE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed && typeof parsed === 'object') {
            setSettings(prev => ({
              ...prev,
              ...parsed,
              fallbackLinks: {
                ...prev.fallbackLinks,
                ...(parsed.fallbackLinks || {})
              }
            }));
            setSettingsLoaded(true);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  useEffect(() => {
    const bootShell = document.getElementById('initial-shell');
    if (bootShell) bootShell.style.display = 'none';
    const checkFirebase = () => {
      if (window.db && window.collection && window.doc) {
        setFirebaseReady(true);
      } else {
        setTimeout(checkFirebase, 50);
      }
    };
    checkFirebase();
  }, []);

  // Live συγχρονισμός ρυθμίσεων από το έγγραφο settings/shop
  useEffect(() => {
    if (!firebaseReady) return;
    const settingsDocRef = window.doc(window.db, "settings", "shop");
    const unsubscribe = window.onSnapshot(settingsDocRef, docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings(prev => {
          const merged = {
            fontFamily: data.fontFamily || prev.fontFamily,
            primaryColor: data.primaryColor || prev.primaryColor,
            bgColor: data.bgColor || prev.bgColor,
            textColor: data.textColor || prev.textColor,
            heroBgColor: data.heroBgColor || prev.heroBgColor,
            heroTitleColor: data.heroTitleColor || prev.heroTitleColor,
            heroSubtitleColor: data.heroSubtitleColor || prev.heroSubtitleColor,
            heroTitleSize: data.heroTitleSize || prev.heroTitleSize,
            borderRadius: data.borderRadius !== undefined ? data.borderRadius : prev.borderRadius,
            heroVideoMode: data.heroVideoMode || prev.heroVideoMode,
            heroVideoItemId: data.heroVideoItemId || prev.heroVideoItemId,
            heroVideoUrl: data.heroVideoUrl || prev.heroVideoUrl,
            heroMinHeight: data.heroMinHeight || prev.heroMinHeight,
            heroOverlayOpacity: data.heroOverlayOpacity !== undefined ? data.heroOverlayOpacity : prev.heroOverlayOpacity,
            heroTitle: data.heroTitle || prev.heroTitle,
            heroSubtitle: data.heroSubtitle || prev.heroSubtitle,
            categoryOrder: data.categoryOrder || prev.categoryOrder,
            shopOrderAvailabilityOrder: Array.isArray(data.shopOrderAvailabilityOrder) ? data.shopOrderAvailabilityOrder : prev.shopOrderAvailabilityOrder,
            shopOrderCollectionOrder: Array.isArray(data.shopOrderCollectionOrder) ? data.shopOrderCollectionOrder : prev.shopOrderCollectionOrder,
            fallbackLinks: {
              ...prev.fallbackLinks,
              ...(data.fallbackLinks || {})
            }
          };
          writeJsonCache(SHOP_SETTINGS_CACHE_KEY, merged);
          return merged;
        });
      }
      setSettingsLoaded(true);
    }, err => {
      console.error('Shop settings live sync failed:', err);
      setSettingsLoaded(true);
    });
    return () => unsubscribe();
  }, [firebaseReady]);
  useEffect(() => {
    setIsMobileCategoryMenuOpen(false);
  }, [selectedCategory]);

  // Αντιστοίχιση οικογενειών γραμματοσειρών
  const fontMapping = {
    'Jura': "'Jura', sans-serif",
    'Montserrat': "'Montserrat', sans-serif",
    'Roboto': "'Roboto', sans-serif",
    'Playfair': "'Playfair Display', serif",
    'Cinzel': "'Cinzel', serif"
  };
  useEffect(() => {
    const fName = fontMapping[settings.fontFamily] || "'Jura', sans-serif";
    document.body.style.fontFamily = fName;
    document.body.style.backgroundColor = settings.bgColor;
    document.body.style.color = settings.textColor;
  }, [settings.fontFamily, settings.bgColor, settings.textColor]);

  // Live συγχρονισμός προϊόντων
  useEffect(() => {
    if (!firebaseReady) return;
    let didLoad = false;
    let serverTried = false;
    let fallbackAttempts = 0;
    let fallbackTimer = null;
    let retryTimer = null;
    const jewelryCollection = window.collection(window.db, "jewelry");
    const MAX_FALLBACK_ATTEMPTS = 3;
    const INITIAL_FALLBACK_DELAY = 1200;
    const applyItems = items => {
      setJewelryList(items);
      setLoadError('');
      setIsLoading(false);
      writeJsonCache(SHOP_PRODUCTS_CACHE_KEY, items);
    };
    const finalizeEmptyState = (message = '') => {
      setJewelryList([]);
      setLoadError(message);
      setIsLoading(false);
    };
    const decodeFirestoreValue = value => {
      if (!value) return null;
      if (Object.prototype.hasOwnProperty.call(value, 'stringValue')) return value.stringValue;
      if (Object.prototype.hasOwnProperty.call(value, 'integerValue')) return Number(value.integerValue);
      if (Object.prototype.hasOwnProperty.call(value, 'doubleValue')) return Number(value.doubleValue);
      if (Object.prototype.hasOwnProperty.call(value, 'booleanValue')) return Boolean(value.booleanValue);
      if (Object.prototype.hasOwnProperty.call(value, 'timestampValue')) {
        const seconds = Math.floor(new Date(value.timestampValue).getTime() / 1000);
        return {
          seconds,
          timestampValue: value.timestampValue
        };
      }
      if (value.arrayValue) return (value.arrayValue.values || []).map(decodeFirestoreValue);
      if (value.mapValue) {
        return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, fieldValue]) => [key, decodeFirestoreValue(fieldValue)]));
      }
      return null;
    };
    const loadRestFallback = async () => {
      const projectId = window.firebaseProjectId;
      const apiKey = window.firebaseApiKey;
      if (!projectId || !apiKey) return [];
      const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/jewelry?key=${apiKey}&pageSize=300&_=${Date.now()}`;
      const response = await fetch(endpoint, {
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`Firestore REST ${response.status}`);
      const data = await response.json();
      return (data.documents || []).map(doc => {
        const fields = doc.fields || {};
        const item = Object.fromEntries(Object.entries(fields).map(([key, fieldValue]) => [key, decodeFirestoreValue(fieldValue)]));
        return {
          id: doc.name.split('/').pop(),
          ...item
        };
      });
    };
    const loadFallback = async () => {
      if (serverTried) return;
      serverTried = true;
      try {
        const getFreshDocs = window.getDocsFromServer || window.getDocs;
        const snapshot = await getFreshDocs(jewelryCollection);
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (fetchedItems.length > 0) {
          applyItems(fetchedItems);
          return;
        }
        const restItems = await loadRestFallback();
        if (restItems.length > 0) {
          applyItems(restItems);
          return;
        }
        fallbackAttempts += 1;
        if (fallbackAttempts < MAX_FALLBACK_ATTEMPTS) {
          serverTried = false;
          retryTimer = setTimeout(loadFallback, fallbackAttempts === 1 ? 600 : 1200);
          return;
        }
        finalizeEmptyState('Δεν βρέθηκαν προϊόντα ή δεν μπόρεσαν να φορτωθούν σωστά.');
      } catch (err) {
        console.error('Shop products fallback failed:', err);
        try {
          const snapshot = await window.getDocs(jewelryCollection);
          const fetchedItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          if (fetchedItems.length > 0) {
            applyItems(fetchedItems);
            return;
          }
          const restItems = await loadRestFallback();
          if (restItems.length > 0) {
            applyItems(restItems);
            return;
          }
          fallbackAttempts += 1;
          if (fallbackAttempts < MAX_FALLBACK_ATTEMPTS) {
            serverTried = false;
            retryTimer = setTimeout(loadFallback, fallbackAttempts === 1 ? 600 : 1200);
            return;
          }
          finalizeEmptyState('Δεν βρέθηκαν προϊόντα ή δεν μπόρεσαν να φορτωθούν σωστά.');
        } catch (secondErr) {
          console.error('Shop products cache fallback failed:', secondErr);
          try {
            const restItems = await loadRestFallback();
            if (restItems.length > 0) {
              applyItems(restItems);
              return;
            }
            fallbackAttempts += 1;
            if (fallbackAttempts < MAX_FALLBACK_ATTEMPTS) {
              serverTried = false;
              retryTimer = setTimeout(loadFallback, fallbackAttempts === 1 ? 600 : 1200);
              return;
            }
            finalizeEmptyState('Δεν βρέθηκαν προϊόντα ή δεν μπόρεσαν να φορτωθούν σωστά.');
          } catch (thirdErr) {
            console.error('Shop products REST fallback failed:', thirdErr);
            fallbackAttempts += 1;
            if (fallbackAttempts < MAX_FALLBACK_ATTEMPTS) {
              serverTried = false;
              retryTimer = setTimeout(loadFallback, fallbackAttempts === 1 ? 600 : 1200);
              return;
            }
            finalizeEmptyState('Δεν βρέθηκαν προϊόντα ή δεν μπόρεσαν να φορτωθούν σωστά.');
          }
        }
      }
    };
    const applySnapshot = snapshot => {
      didLoad = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (fetchedItems.length > 0) {
        applyItems(fetchedItems);
      } else if (!serverTried) {
        setIsLoading(true);
        retryTimer = setTimeout(loadFallback, 150);
      }
    };
    const unsubscribe = window.onSnapshot(jewelryCollection, applySnapshot, err => {
      console.error('Shop products live sync failed:', err);
      loadFallback();
    });
    fallbackTimer = setTimeout(() => {
      if (!didLoad) loadFallback();
    }, INITIAL_FALLBACK_DELAY);
    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (retryTimer) clearTimeout(retryTimer);
      unsubscribe();
    };
  }, [firebaseReady]);
  const getStatusColor = status => {
    if (status === 'Διαθέσιμο') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (status === 'Πουλήθηκε') return 'bg-rose-100 text-rose-700 border border-rose-200';
    if (status === 'Υπό Κατασκευή') return 'bg-amber-100 text-amber-700 border border-amber-200';
    if (status === 'Δωρίστηκε') return 'bg-blue-100 text-blue-700 border border-blue-200';
    return 'bg-stone-100 text-stone-600 border border-stone-200';
  };
  const visibleCatalog = useMemo(() => {
    return jewelryList.filter(item => !item.isDeleted && !item.deletedAt && item.showInShop !== false);
  }, [jewelryList]);
  const publicCatalog = useMemo(() => {
    const items = visibleCatalog.filter(item => {
      const categoryMatches = selectedCategory === 'Όλα' || item.category === selectedCategory;
      const favoriteMatches = !showFavoritesOnly || favoriteIds.includes(item.id);
      const colorMatches = selectedColor === 'Όλα' || (item.colors || []).includes(selectedColor);
      const term = searchQuery.trim().toLowerCase();
      const searchHaystack = [item.name, item.category, item.collection, item.notes, ...(item.materials || []), ...(item.colors || [])].filter(Boolean).join(' ').toLowerCase();
      const searchMatches = !term || searchHaystack.includes(term);
      return categoryMatches && favoriteMatches && colorMatches && searchMatches;
    });
    items.sort((a, b) => {
      if (sortBy === 'shop_order') {
        const orderA = a.shopOrder || 0;
        const orderB = b.shopOrder || 0;
        if (orderA !== orderB) return orderB - orderA;
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      }
      const unavailableA = isSoldItem(a);
      const unavailableB = isSoldItem(b);
      if (unavailableA !== unavailableB) return Number(unavailableA) - Number(unavailableB);
      if (sortBy === 'price_low') return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === 'price_high') return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === 'available') return Number(isSoldItem(a)) - Number(isSoldItem(b)) || (b.shopOrder || 0) - (a.shopOrder || 0);
      const orderA = a.shopOrder || 0;
      const orderB = b.shopOrder || 0;
      if (orderA !== orderB) return orderB - orderA;
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    });
    return items;
  }, [visibleCatalog, selectedCategory, showFavoritesOnly, favoriteIds, selectedColor, searchQuery, sortBy]);
  const allCategories = useMemo(() => {
    const embedded = visibleCatalog.map(item => item.category);
    const uniqueCats = Array.from(new Set(embedded)).filter(Boolean);
    uniqueCats.sort((a, b) => {
      const indexA = settings.categoryOrder.indexOf(a);
      const indexB = settings.categoryOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b, 'el');
    });
    return uniqueCats;
  }, [visibleCatalog, settings.categoryOrder]);
  const allColors = useMemo(() => {
    return Array.from(new Set(visibleCatalog.flatMap(item => item.colors || []))).filter(Boolean).sort((a, b) => a.localeCompare(b, 'el'));
  }, [visibleCatalog]);
  const getShopOrderAvailabilityKey = item => {
    if (isAvailableItem(item)) return 'Διαθέσιμα';
    if (isSoldItem(item)) return 'Πωληθέντα';
    return 'Μη διαθέσιμα';
  };
  const getShopOrderCollectionKey = item => (item.collection || 'Χωρίς συλλογή').trim() || 'Χωρίς συλλογή';
  const shopStats = useMemo(() => ({
    total: visibleCatalog.length,
    available: visibleCatalog.filter(item => !isSoldItem(item)).length,
    categories: allCategories.length
  }), [visibleCatalog, allCategories]);
  const latestItems = useMemo(() => {
    const getNewItemSortSeconds = (item = {}) => item.showInNewCollectionAt?.seconds || item.updatedAt?.seconds || item.createdAt?.seconds || 0;
    return [...visibleCatalog]
      .filter(item => !isSoldItem(item) && Boolean(item.showInNewCollection))
      .sort((a, b) => getNewItemSortSeconds(b) - getNewItemSortSeconds(a) || (b.shopOrder || 0) - (a.shopOrder || 0))
      .slice(0, 4);
  }, [visibleCatalog]);
  const promoVideoItem = useMemo(() => {
    if (!settingsLoaded) return null;
    const getVideoUrl = (item = {}) => {
      const videoMedia = (item.mediaList || []).find(media => media?.type === 'video' && media?.url && media.showInShop !== false);
      if (videoMedia?.url) return normalizeVideoUrl(videoMedia.url);
      if (item.fileType === 'video' && item.imageUrl) return normalizeVideoUrl(item.imageUrl);
      return '';
    };
    const mode = settings.heroVideoMode || 'auto';
    const candidateById = jewelryList.find(item => !item.isDeleted && !item.deletedAt && item.id === settings.heroVideoItemId);
    if (mode === 'custom') {
      if (!settings.heroVideoUrl) return null;
      return {
        name: 'Custom video',
        url: normalizeVideoUrl(settings.heroVideoUrl)
      };
    }
    if (mode === 'item') {
      if (!candidateById) return null;
      const selectedUrl = getVideoUrl(candidateById);
      if (!selectedUrl) return null;
      return {
        name: candidateById.name || 'Aram Creations',
        url: selectedUrl
      };
    }
    const candidate = jewelryList.find(item => !item.isDeleted && !item.deletedAt && Boolean(item.showAsHeroVideo) && Boolean(getVideoUrl(item)))
      || jewelryList.find(item => !item.isDeleted && !item.deletedAt && item.showInShop !== false && Boolean(getVideoUrl(item)));
    if (!candidate) return null;
    const videoUrl = getVideoUrl(candidate);
    if (!videoUrl) return null;
    return {
      name: candidate.name || 'Aram Creations',
      url: videoUrl
    };
  }, [jewelryList, settingsLoaded, settings.heroVideoMode, settings.heroVideoItemId, settings.heroVideoUrl]);
  const getVisibleFavoriteCount = (item = {}) => Number(item.shopFavorites ?? item.vintedFavorites ?? item.favorites ?? 0) || 0;
  const syncFavoriteCountLocal = (itemId, nextCount) => {
    const nextItemPatch = {
      shopFavorites: nextCount,
      vintedFavorites: nextCount,
      favorites: nextCount
    };
    setJewelryList(prev => {
      const next = prev.map(item => item.id === itemId ? {
        ...item,
        ...nextItemPatch
      } : item);
      try {
        writeJsonCache(SHOP_PRODUCTS_CACHE_KEY, next);
      } catch {}
      return next;
    });
    setCurrentItem(prev => prev && prev.id === itemId ? {
      ...prev,
      ...nextItemPatch
    } : prev);
  };
  const persistFavoriteCount = async (itemId, nextCount) => {
    if (!firebaseReady || !window.updateDoc || !window.doc) return;
    await window.updateDoc(window.doc(window.db, "jewelry", itemId), {
      shopFavorites: nextCount,
      vintedFavorites: nextCount,
      favorites: nextCount
    });
  };
  const toggleFavorite = async itemId => {
    const item = jewelryList.find(entry => entry.id === itemId);
    const currentCount = getVisibleFavoriteCount(item);
    const willRemove = favoriteIds.includes(itemId);
    const nextCount = Math.max(currentCount + (willRemove ? -1 : 1), 0);
    setFavoriteIds(prev => {
      const next = willRemove ? prev.filter(id => id !== itemId) : [...prev, itemId];
      try {
        localStorage.setItem('aram_shop_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
    syncFavoriteCountLocal(itemId, nextCount);
    try {
      await persistFavoriteCount(itemId, nextCount);
    } catch (err) {
      console.error('Failed to persist favorite count:', err);
    }
  };
  const getPrimaryPurchaseLink = (item = {}) => {
    const links = [...(item.purchaseLinks || item.productLinks || [])];
    const vinted = links.find(link => String(link.site || '').toLowerCase() === 'vinted' && link.url);
    return vinted || links.find(link => link.url) || null;
  };
  const currentIndex = currentItem ? publicCatalog.findIndex(item => item.id === currentItem.id) : -1;
  const hasNext = currentIndex !== -1 && currentIndex < publicCatalog.length - 1;
  const hasPrev = currentIndex > 0;
  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setZoomedMediaUrl('');
  };
  const closeZoomedMedia = () => {
    setZoomedMediaUrl('');
  };
  const handleViewDetails = item => {
    setCurrentItem(item);
    setActiveDetailMediaIdx(0);
    setShowContactInfo(false);
    setZoomedMediaUrl('');
    setIsDetailOpen(true);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "flex flex-col min-h-screen",
    style: {
      backgroundColor: settings.bgColor,
      color: settings.textColor
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("header", {
      className: "border-b shadow-sm sticky top-0 z-40 transition-colors duration-300",
      style: {
        backgroundColor: settings.bgColor,
        borderColor: `${settings.textColor}15`
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "max-w-6xl mx-auto px-6 py-5 flex flex-col items-center justify-center gap-4",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "flex flex-col items-center gap-2 text-center",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
            src: "logo.png",
            alt: "Aram Creations Logo",
            className: "h-14 w-auto object-contain",
            onError: e => e.target.style.display = 'none'
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
            className: "text-xl md:text-2xl font-black tracking-tight",
            style: {
              color: settings.textColor
            },
            children: "aram.creations"
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("nav", {
          className: "w-full",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
            type: "button",
            onClick: () => setIsMobileCategoryMenuOpen(open => !open),
            className: "sm:hidden w-full inline-flex items-center justify-between gap-3 border px-4 py-3 text-sm font-black transition shadow-sm",
            style: {
              borderRadius: settings.borderRadius,
              backgroundColor: `${settings.bgColor}F6`,
              color: settings.textColor,
              borderColor: `${settings.textColor}18`
            },
            "aria-expanded": isMobileCategoryMenuOpen,
            "aria-label": "Άνοιγμα μενού κατηγοριών",
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
              className: "inline-flex flex-col items-start leading-none",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                className: "text-[10px] uppercase tracking-wider opacity-55 font-black",
                children: "Μενού κατηγοριών"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                className: "mt-1 text-left",
                children: selectedCategory
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
              className: `relative inline-flex h-4 w-5 items-center justify-center transition-transform duration-300 ${isMobileCategoryMenuOpen ? 'rotate-90' : ''}`,
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                className: "absolute h-0.5 w-5 rounded-full bg-current -translate-y-1.5"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                className: "absolute h-0.5 w-5 rounded-full bg-current"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                className: "absolute h-0.5 w-5 rounded-full bg-current translate-y-1.5"
              })]
            })]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: `sm:hidden mt-3 overflow-hidden rounded-3xl border shadow-lg transition-all duration-300 ease-out ${isMobileCategoryMenuOpen ? 'max-h-[34rem] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none border-transparent'}`,
            style: {
              backgroundColor: `${settings.bgColor}F6`,
              borderColor: `${settings.textColor}18`
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "p-3",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: "flex items-center justify-between gap-3 mb-3",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                    className: "text-[10px] uppercase tracking-[0.28em] font-black opacity-50",
                    children: "Μενού κατηγοριών"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                    className: "mt-1 text-sm font-black",
                    children: selectedCategory
                  })]
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                  type: "button",
                  onClick: () => setIsMobileCategoryMenuOpen(false),
                  className: "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition",
                  style: {
                    borderRadius: settings.borderRadius,
                    color: settings.textColor,
                    borderColor: `${settings.textColor}18`,
                    backgroundColor: `${settings.textColor}04`
                  },
                  children: ["\u039A\u03BB\u03B5\u03AF\u03C3\u03B9\u03BC\u03BF", /*#__PURE__*/(0, _jsxRuntime.jsx)(IconX, {})]
                })]
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                className: "flex flex-col gap-2",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                  onClick: () => setSelectedCategory('Όλα'),
                  className: "w-full px-4 py-3 text-left text-sm font-bold transition border",
                  style: {
                    borderRadius: settings.borderRadius,
                    backgroundColor: selectedCategory === 'Όλα' ? settings.primaryColor : 'transparent',
                    color: selectedCategory === 'Όλα' ? '#fff' : settings.textColor,
                    borderColor: selectedCategory === 'Όλα' ? settings.primaryColor : `${settings.textColor}24`
                  },
                  children: "Όλη η Συλλογή"
                }), allCategories.map(cat => /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                  onClick: () => setSelectedCategory(cat),
                  className: "w-full px-4 py-3 text-left text-sm font-bold transition border",
                  style: {
                    borderRadius: settings.borderRadius,
                    backgroundColor: selectedCategory === cat ? settings.primaryColor : 'transparent',
                    color: selectedCategory === cat ? '#fff' : settings.textColor,
                    borderColor: selectedCategory === cat ? settings.primaryColor : `${settings.textColor}24`
                  },
                  children: cat
                }, cat))]
              })]
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: "hidden sm:flex w-full -mx-4 px-4 flex-nowrap gap-2 overflow-x-auto overflow-y-hidden max-w-full pb-2 no-scrollbar justify-start sm:justify-center snap-x snap-mandatory",
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
              onClick: () => setSelectedCategory('Όλα'),
              className: "shrink-0 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold whitespace-nowrap transition border snap-start",
              style: {
                borderRadius: settings.borderRadius,
                backgroundColor: selectedCategory === 'Όλα' ? settings.primaryColor : 'transparent',
                color: selectedCategory === 'Όλα' ? '#fff' : settings.textColor,
                borderColor: selectedCategory === 'Όλα' ? settings.primaryColor : `${settings.textColor}30`
              },
              children: "\u038C\u03BB\u03B7 \u03B7 \u03A3\u03C5\u03BB\u03BB\u03BF\u03B3\u03AE"
            }), allCategories.map(cat => /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
              onClick: () => setSelectedCategory(cat),
              className: "shrink-0 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold whitespace-nowrap transition border snap-start",
              style: {
                borderRadius: settings.borderRadius,
                backgroundColor: selectedCategory === cat ? settings.primaryColor : 'transparent',
                color: selectedCategory === cat ? '#fff' : settings.textColor,
                borderColor: selectedCategory === cat ? settings.primaryColor : `${settings.textColor}30`
              },
              children: cat
            }, cat))]
          })]
        })]
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("section", {
      className: "relative overflow-hidden -mt-6 md:-mt-8 pt-8 md:pt-12 pb-24 md:pb-32 px-4 text-center transition-all duration-300 flex items-center justify-center",
      style: {
        backgroundColor: settings.heroBgColor,
        minHeight: settings.heroMinHeight || '72vh'
      },
      children: [promoVideoItem && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "absolute inset-0 z-0 overflow-hidden pointer-events-none",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("video", {
          src: promoVideoItem.url,
          className: "w-full h-full object-cover scale-110",
          autoPlay: true,
          muted: true,
          loop: true,
          playsInline: true,
          preload: "auto",
          controls: false
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "absolute inset-0 z-[1] pointer-events-none",
        style: {
          background: `linear-gradient(180deg, rgba(255,255,255,${Math.max(0.02, Math.min(Number(settings.heroOverlayOpacity) || 0, 0.22))}) 0%, rgba(255,255,255,${Math.max(0.06, Math.min((Number(settings.heroOverlayOpacity) || 0) + 0.08, 0.36))}) 100%)`
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "relative z-[2] max-w-3xl mx-auto",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
          className: `font-black mb-4 tracking-tight drop-shadow-sm ${settings.heroTitleSize}`,
          style: {
            color: settings.heroTitleColor
          },
          children: settings.heroTitle
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
          className: "max-w-xl mx-auto text-sm md:text-base leading-relaxed opacity-95 drop-shadow-sm",
          style: {
            color: settings.heroSubtitleColor
          },
          children: settings.heroSubtitle
        }), shopStats.total > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "mt-6 flex flex-wrap justify-center gap-2 text-[11px] font-bold drop-shadow-sm",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
          className: "px-3 py-1 rounded-full bg-white/20 text-white",
            children: [shopStats.available, " διαθέσιμα"]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
            className: "px-3 py-1 rounded-full bg-white/20 text-white",
            children: [shopStats.categories, " κατηγορίες"]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
            className: "px-3 py-1 rounded-full bg-white/20 text-white",
            children: [shopStats.total, " δημιουργίες"]
          })]
        })]
      })]
    }), latestItems.length > 0 && !showFavoritesOnly && selectedCategory === 'Όλα' && /*#__PURE__*/(0, _jsxRuntime.jsxs)("section", {
      className: "max-w-6xl mx-auto px-6 pt-10 w-full",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "flex items-end justify-between gap-4 mb-4",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
            className: "text-[10px] uppercase font-black tracking-widest opacity-40",
            children: "New arrivals"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
            className: "text-2xl font-black",
            style: {
              color: settings.textColor
            },
            children: "\u039D\u03AD\u03B1 \u03C3\u03C4\u03B7 \u03C3\u03C5\u03BB\u03BB\u03BF\u03B3\u03AE"
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
          type: "button",
          onClick: () => {
            setSelectedCategory('Όλα');
            setSortBy('shop_order');
          },
          className: "hidden sm:inline-flex border px-4 py-2 text-xs font-black bg-white",
          style: {
            borderColor: `${settings.textColor}18`,
            borderRadius: settings.borderRadius,
            color: settings.textColor
          },
          children: "\u0394\u03B5\u03C2 \u03CC\u03BB\u03B7 \u03C4\u03B7 \u03C3\u03C5\u03BB\u03BB\u03BF\u03B3\u03AE"
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-4 sm:overflow-visible sm:mx-0 sm:px-0",
        children: latestItems.map(item => /*#__PURE__*/(0, _jsxRuntime.jsxs)("button", {
          onClick: () => handleViewDetails(item),
          className: "group text-left shrink-0 w-[31%] min-w-[7.25rem] snap-start sm:w-auto",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: "aspect-square overflow-hidden border shadow-sm",
            style: {
              borderColor: `${settings.textColor}10`,
              borderRadius: settings.borderRadius,
              backgroundColor: `${settings.textColor}05`
            },
            children: item.imageUrl ? item.fileType === 'video' ? /*#__PURE__*/(0, _jsxRuntime.jsx)("video", {
              src: item.imageUrl,
              className: "w-full h-full object-cover transition duration-500 group-hover:scale-105",
              autoPlay: true,
              muted: true,
              loop: true,
              playsInline: true,
              preload: "auto"
            }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
              src: item.imageUrl,
              alt: item.name,
              className: "w-full h-full object-cover transition duration-500 group-hover:scale-105",
              loading: "lazy",
              decoding: "async"
            }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              className: "w-full h-full flex items-center justify-center opacity-40",
              children: "Aram Creations"
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
            className: "mt-2 text-xs font-bold line-clamp-2 break-words",
            style: {
              color: settings.textColor
            },
            children: item.name
          })]
        }, `latest-${item.id}`))
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("main", {
      className: "flex-1 max-w-6xl mx-auto px-6 py-10 md:py-12 w-full",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "mb-8 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
          className: "block",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
            className: "sr-only",
            children: "\u0391\u03BD\u03B1\u03B6\u03AE\u03C4\u03B7\u03C3\u03B7"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
            type: "search",
            value: searchQuery,
            onChange: event => setSearchQuery(event.target.value),
            placeholder: "\u0391\u03BD\u03B1\u03B6\u03AE\u03C4\u03B7\u03C3\u03B7 \u03C3\u03B5 \u03CC\u03BD\u03BF\u03BC\u03B1, \u03C5\u03BB\u03B9\u03BA\u03AC, \u03C7\u03C1\u03CE\u03BC\u03B1\u03C4\u03B1...",
            className: "w-full border px-4 py-3 text-sm font-medium outline-none bg-white",
            style: {
              borderColor: `${settings.textColor}18`,
              borderRadius: settings.borderRadius,
              color: settings.textColor
            }
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("select", {
          value: selectedColor,
          onChange: event => setSelectedColor(event.target.value),
          className: "border px-4 py-3 text-sm font-bold outline-none bg-white",
          style: {
            borderColor: `${settings.textColor}18`,
            borderRadius: settings.borderRadius,
            color: settings.textColor
          },
          "aria-label": "\u03A6\u03AF\u03BB\u03C4\u03C1\u03BF \u03C7\u03C1\u03CE\u03BC\u03B1\u03C4\u03BF\u03C2",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
            value: "\u038C\u03BB\u03B1",
            children: "\u038C\u03BB\u03B1 \u03C4\u03B1 \u03C7\u03C1\u03CE\u03BC\u03B1\u03C4\u03B1"
          }), allColors.map(color => /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
            value: color,
            children: color
          }, color))]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("select", {
          value: sortBy,
          onChange: event => setSortBy(event.target.value),
          className: "border px-4 py-3 text-sm font-bold outline-none bg-white",
          style: {
            borderColor: `${settings.textColor}18`,
            borderRadius: settings.borderRadius,
            color: settings.textColor
          },
          "aria-label": "\u03A4\u03B1\u03BE\u03B9\u03BD\u03CC\u03BC\u03B7\u03C3\u03B7",
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
            value: "shop_order",
            children: "\u03A0\u03C1\u03BF\u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE"
           }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
            value: "available",
            children: "\u0394\u03B9\u03B1\u03B8\u03AD\u03C3\u03B9\u03BC\u03B1 \u03C0\u03C1\u03CE\u03C4\u03B1"
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
            value: "price_low",
            children: "\u03A4\u03B9\u03BC\u03AE \u03C7\u03B1\u03BC\u03B7\u03BB\u03AC"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
            value: "price_high",
            children: "\u03A4\u03B9\u03BC\u03AE \u03C8\u03B7\u03BB\u03AC"
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "md:col-span-3 flex flex-wrap gap-2 items-center justify-between",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: "flex flex-wrap gap-2",
          children: [(searchQuery || selectedColor !== 'Όλα' || showFavoritesOnly || selectedCategory !== 'Όλα') && /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
              type: "button",
              onClick: () => {
                setSearchQuery('');
                setSelectedColor('Όλα');
                setShowFavoritesOnly(false);
                setSelectedCategory('Όλα');
              },
              className: "px-3 py-2 text-xs font-black border bg-white",
              style: {
                borderRadius: settings.borderRadius,
                color: settings.textColor,
                borderColor: `${settings.textColor}18`
              },
              children: "\u039A\u03B1\u03B8\u03B1\u03C1\u03B9\u03C3\u03BC\u03CC\u03C2 \u03C6\u03AF\u03BB\u03C4\u03C1\u03C9\u03BD"
            })]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
            className: "text-xs font-bold opacity-50",
            children: [publicCatalog.length, " \u03B1\u03C0\u03BF\u03C4\u03B5\u03BB\u03AD\u03C3\u03BC\u03B1\u03C4\u03B1"]
          })]
        })]
      }), isLoading ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "text-center py-20 font-medium",
        style: {
          color: settings.textColor
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "mx-auto mb-4 h-10 w-10 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin"
        }), "\u03A6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B7 \u03C3\u03C5\u03BB\u03BB\u03BF\u03B3\u03AE\u03C2..."]
      }) : loadError ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "text-center py-20 max-w-md mx-auto",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
          className: "font-bold mb-3",
          style: {
            color: settings.textColor
          },
          children: loadError
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
          onClick: () => window.location.reload(),
          className: "px-4 py-2 text-sm font-bold border",
          style: {
            borderColor: `${settings.textColor}25`,
            borderRadius: settings.borderRadius,
            color: settings.textColor
          },
          children: "\u039E\u03B1\u03BD\u03B1\u03C6\u03CC\u03C1\u03C4\u03C9\u03C3\u03B7"
        })]
      }) : publicCatalog.length === 0 ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "text-center py-20",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
          className: "font-bold mb-2",
          style: {
            color: settings.textColor
          },
          children: showFavoritesOnly ? 'Δεν έχεις αγαπημένα σε αυτή την προβολή.' : 'Δεν βρέθηκαν δημιουργίες σε αυτή την κατηγορία.'
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
          onClick: () => {
            setSelectedCategory('Όλα');
            setShowFavoritesOnly(false);
          },
          className: "text-sm font-bold underline",
          style: {
            color: settings.primaryColor
          },
          children: "\u0395\u03C0\u03B9\u03C3\u03C4\u03C1\u03BF\u03C6\u03AE \u03C3\u03B5 \u03CC\u03BB\u03B7 \u03C4\u03B7 \u03C3\u03C5\u03BB\u03BB\u03BF\u03B3\u03AE"
        })]
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
        className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8",
        children: publicCatalog.map(item => {
          const isSold = isSoldItem(item);
          const primaryPurchaseLink = getPrimaryPurchaseLink(item);
          const visibleFavorites = getVisibleFavoriteCount(item);
          return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            onClick: () => handleViewDetails(item),
            className: "group cursor-pointer flex h-full flex-col",
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "aspect-[4/5] overflow-hidden mb-3 relative shadow-sm border flex-shrink-0",
              style: {
                backgroundColor: `${settings.textColor}05`,
                borderColor: `${settings.textColor}10`,
                borderRadius: settings.borderRadius
              },
              children: [item.imageUrl ? item.fileType === 'video' ? /*#__PURE__*/(0, _jsxRuntime.jsx)("video", {
                src: item.imageUrl,
                className: `w-full h-full object-cover transition duration-700 group-hover:scale-105 ${isSold ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : ''}`,
                autoPlay: true,
                muted: true,
                loop: true,
                playsInline: true,
                preload: "auto"
              }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
                src: item.imageUrl,
                className: `w-full h-full object-cover transition duration-700 group-hover:scale-105 ${isSold ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : ''}`,
                alt: item.name,
                loading: "lazy",
                decoding: "async"
              }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                className: "w-full h-full flex items-center justify-center opacity-40",
                children: "Aram Creations"
              }), isSold && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                className: "absolute inset-0 bg-black/10 flex items-center justify-center transition duration-300 group-hover:opacity-0",
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: "px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white bg-stone-900/80 shadow-sm",
                  style: {
                    borderRadius: settings.borderRadius
                  },
                  children: getUnavailableLabel(item)
                })
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                type: "button",
                onClick: event => {
                  event.stopPropagation();
                  toggleFavorite(item.id);
                },
                className: "absolute top-2 right-2 h-9 min-w-[3.5rem] px-2.5 rounded-full bg-white/90 shadow-sm flex items-center justify-center gap-1 text-lg transition hover:scale-105",
                "aria-label": favoriteIds.includes(item.id) ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα',
                title: favoriteIds.includes(item.id) ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα',
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: "inline-flex items-center gap-1 text-[11px] font-black",
                  style: {
                    color: favoriteIds.includes(item.id) ? '#be123c' : '#44403c'
                  },
                  children: [favoriteIds.includes(item.id) ? '♥' : '♡', /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                    className: "text-[10px] font-black leading-none",
                    children: visibleFavorites.toLocaleString('el-GR')
                  })]
                })
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "flex min-h-0 flex-1 flex-col px-1",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: "flex items-center justify-between mb-1.5",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: `text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(item.status)}`,
                  children: item.status
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: `font-black text-sm ${isSold ? 'opacity-40 line-through' : ''}`,
                  style: {
                    color: settings.textColor
                  },
                  children: item.price ? `${item.price}€` : '-'
                })]
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h3", {
                className: `font-bold text-sm ${isSold ? 'opacity-50' : ''}`,
                style: {
                  color: settings.textColor
                },
                children: item.name
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                className: "text-[10px] uppercase font-bold tracking-wider mt-1 line-clamp-2 min-h-[2.5rem]",
                style: {
                  color: settings.textColor,
                  opacity: 0.5
                },
                children: item.category
              }), !isSold && primaryPurchaseLink?.url && /*#__PURE__*/(0, _jsxRuntime.jsxs)("a", {
                href: primaryPurchaseLink.url,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: event => event.stopPropagation(),
                className: "mt-auto w-full inline-flex items-center justify-center border px-4 py-2.5 text-xs font-black text-center transition hover:opacity-80",
                style: {
                  borderColor: `${settings.textColor}18`,
                  borderRadius: settings.borderRadius,
                  color: settings.textColor
                },
                children: ["\u0391\u03B3\u03BF\u03C1\u03AC \u03BC\u03AD\u03C3\u03C9 ", primaryPurchaseLink.site || 'link']
              })]
            })]
          }, item.id);
        })
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("footer", {
      className: "border-t py-8 text-center mt-auto transition-colors duration-300",
      style: {
        borderColor: `${settings.textColor}10`,
        backgroundColor: settings.bgColor
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
        className: "text-xs font-medium",
        style: {
          color: settings.textColor,
          opacity: 0.5
        },
        children: ["\xA9 ", new Date().getFullYear(), " Aram Creations. \u038C\u03BB\u03B1 \u03C4\u03B1 \u03B4\u03B9\u03BA\u03B1\u03B9\u03CE\u03BC\u03B1\u03C4\u03B1 \u03B4\u03B9\u03B1\u03C4\u03B7\u03C1\u03BF\u03CD\u03BD\u03C4\u03B1\u03B9."]
      })
    }), isDetailOpen && currentItem && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center p-0 md:p-4 z-50 animate-fade-in overflow-y-auto overscroll-contain",
      onClick: e => {
        if (e.target === e.currentTarget) closeDetailModal();
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        onClick: e => {
          e.stopPropagation();
          closeDetailModal();
        },
        className: `fixed top-3 right-3 z-[80] md:hidden p-3 rounded-full bg-white text-stone-900 shadow-2xl border border-stone-200 ${zoomedMediaUrl ? 'opacity-0 pointer-events-none' : ''}`,
        "aria-label": "\u039A\u03BB\u03B5\u03AF\u03C3\u03B9\u03BC\u03BF \u03C0\u03C1\u03BF\u03CA\u03CC\u03BD\u03C4\u03BF\u03C2",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(IconX, {})
      }), hasPrev && /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        onClick: e => {
          e.stopPropagation();
          setCurrentItem(publicCatalog[currentIndex - 1]);
          setActiveDetailMediaIdx(0);
          setShowContactInfo(false);
          setZoomedMediaUrl('');
        },
        className: "hidden md:block fixed left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-stone-900/90 text-white rounded-full shadow-2xl z-50 hover:bg-stone-900 transition border border-stone-700",
        "aria-label": "\u03A0\u03C1\u03BF\u03B7\u03B3\u03BF\u03CD\u03BC\u03B5\u03BD\u03BF \u03C0\u03C1\u03BF\u03CA\u03CC\u03BD",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
          className: "w-5 h-5 md:w-6 md:h-6",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "3",
            d: "M15 19l-7-7 7-7"
          })
        })
      }), hasNext && /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        onClick: e => {
          e.stopPropagation();
          setCurrentItem(publicCatalog[currentIndex + 1]);
          setActiveDetailMediaIdx(0);
          setShowContactInfo(false);
          setZoomedMediaUrl('');
        },
        className: "hidden md:block fixed right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-stone-900/90 text-white rounded-full shadow-2xl z-50 hover:bg-stone-900 transition border border-stone-700",
        "aria-label": "\u0395\u03C0\u03CC\u03BC\u03B5\u03BD\u03BF \u03C0\u03C1\u03BF\u03CA\u03CC\u03BD",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
          className: "w-5 h-5 md:w-6 md:h-6",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "3",
            d: "M9 5l7 7-7 7"
          })
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "w-full md:max-w-4xl min-h-screen md:min-h-0 overflow-visible md:overflow-hidden shadow-2xl flex flex-col md:flex-row md:max-h-[90vh] border transition-colors duration-300 overscroll-contain",
        style: {
          backgroundColor: settings.bgColor,
          borderColor: `${settings.textColor}15`,
          borderRadius: settings.borderRadius
        },
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "w-full md:w-1/2 flex flex-col p-3 md:p-4 shrink-0",
          style: {
            backgroundColor: `${settings.textColor}03`
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: "aspect-square w-full overflow-hidden relative border shadow-sm",
            style: {
              borderRadius: '1.5rem',
              borderColor: `${settings.textColor}10`,
              background: `linear-gradient(180deg, ${settings.textColor}07 0%, ${settings.textColor}03 100%)`
            },
            children: (() => {
              const mediaArray = (currentItem.mediaList || [{
                url: currentItem.imageUrl,
                type: currentItem.fileType || 'image',
                showInShop: true
              }]).filter(m => m.showInShop !== false);
              // Ασφάλεια: αν για κάποιο λόγο όλα είναι κρυφά, δείξε την κεντρική φωτό
              const finalMediaArray = mediaArray.length > 0 ? mediaArray : [{
                url: currentItem.imageUrl,
                type: currentItem.fileType || 'image',
                showInShop: true
              }];
              const activeMedia = finalMediaArray[activeDetailMediaIdx] || finalMediaArray[0];
              const isCurrentSold = isSoldItem(currentItem);
              if (!activeMedia) return null;
              return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
                children: [activeMedia.type === 'video' ? /*#__PURE__*/(0, _jsxRuntime.jsx)("video", {
                  src: activeMedia.url,
                  className: "w-full h-full object-cover",
                  autoPlay: true,
                  muted: true,
                  loop: true,
                  playsInline: true,
                  preload: "auto"
                }, activeMedia.url) : /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                  type: "button",
                  onClick: e => {
                    e.stopPropagation();
                    setZoomedMediaUrl(activeMedia.url);
                  },
                  className: "w-full h-full block cursor-zoom-in",
                  "aria-label": "\u0391\u03C0\u03BF\u03BC\u03B5\u03B3\u03B5\u03B8\u03C5\u03BC\u03AD\u03BD\u03B7 \u03C0\u03C1\u03BF\u03B2\u03BF\u03BB\u03AE \u03B5\u03B9\u03BA\u03CC\u03BD\u03B1\u03C2",
                  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
                    src: activeMedia.url,
                    className: "w-full h-full object-cover",
                    alt: currentItem.name
                  })
                }, activeMedia.url), isCurrentSold && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                  className: "absolute inset-x-0 bottom-4 flex justify-center",
                  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                    className: "px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white bg-stone-900/80 shadow-sm",
                    style: {
                      borderRadius: settings.borderRadius
                    },
                    children: getUnavailableLabel(currentItem)
                  })
                }), zoomedMediaUrl && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: "fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4",
                  onClick: closeZoomedMedia,
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                    type: "button",
                    onClick: e => {
                      e.stopPropagation();
                      closeZoomedMedia();
                    },
                    className: "absolute top-4 right-4 p-3 rounded-full bg-white/95 text-stone-900 shadow-2xl",
                    "aria-label": "\u039A\u03BB\u03B5\u03AF\u03C3\u03B9\u03BC\u03BF \u03BC\u03B5\u03B3\u03AC\u03BB\u03B7\u03C2 \u03C0\u03C1\u03BF\u03B2\u03BF\u03BB\u03AE\u03C2",
                    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(IconX, {})
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
                    src: zoomedMediaUrl,
                    alt: currentItem.name,
                    className: "max-w-[96vw] max-h-[92vh] object-contain rounded-2xl shadow-2xl"
                  })]
                })]
              });
            })()
          }), (() => {
            const currentMediaArray = (currentItem.mediaList || [{
              url: currentItem.imageUrl,
              type: currentItem.fileType || 'image',
              showInShop: true
            }]).filter(m => m.showInShop !== false);
            if (currentMediaArray.length <= 1) return null;
            return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              className: "flex gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar",
              children: currentMediaArray.map((m, idx) => /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                onClick: () => setActiveDetailMediaIdx(idx),
                className: "w-16 h-16 overflow-hidden flex-shrink-0 border-2 transition",
                style: {
                  borderRadius: settings.borderRadius,
                  borderColor: activeDetailMediaIdx === idx || activeDetailMediaIdx >= currentMediaArray.length && idx === 0 ? settings.primaryColor : 'transparent',
                  opacity: activeDetailMediaIdx === idx || activeDetailMediaIdx >= currentMediaArray.length && idx === 0 ? 1 : 0.5
                },
                children: m.type === 'video' ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                  className: "w-full h-full flex items-center justify-center text-xs",
                  style: {
                    backgroundColor: `${settings.textColor}10`,
                    color: settings.textColor
                  },
                  children: "\u0392\u03AF\u03BD\u03C4\u03B5\u03BF"
                }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("img", {
                  src: m.url,
                  className: "w-full h-full object-cover",
                  loading: "lazy",
                  decoding: "async",
                  alt: ""
                })
              }, idx))
            });
          })()]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "w-full md:w-1/2 p-5 md:p-10 flex flex-col md:overflow-y-auto relative",
          style: {
            backgroundColor: settings.bgColor
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
            onClick: closeDetailModal,
            className: "hidden md:block absolute top-4 right-4 p-2 rounded-full transition hover:opacity-80",
            style: {
              backgroundColor: `${settings.textColor}10`,
              color: settings.textColor
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(IconX, {})
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: "mb-6 pr-8 mt-4 md:mt-0",
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "flex items-center gap-2 mb-2",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                className: `text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(currentItem.status)}`,
                children: currentItem.status
              }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
                className: "text-[10px] uppercase font-bold tracking-wider",
                style: {
                  color: settings.textColor,
                  opacity: 0.5
                },
                children: [currentItem.category, " ", currentItem.collection && `| ${currentItem.collection}`]
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
              className: "text-3xl font-black leading-tight mb-2",
              style: {
                color: settings.textColor
              },
              children: currentItem.name
            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
              className: "text-2xl font-medium",
              style: {
                color: settings.textColor
              },
              children: currentItem.price ? `${currentItem.price}€` : '-'
            }), (() => {
              const visibleFavorites = getVisibleFavoriteCount(currentItem);
              return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: "mt-4 flex items-center justify-end",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: "rounded-2xl border px-4 py-3",
                  style: {
                    borderColor: `${settings.textColor}12`,
                    backgroundColor: `${settings.textColor}04`
                  },
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                    className: "block text-[10px] font-black uppercase tracking-wider mb-1",
                    style: {
                      color: settings.textColor,
                      opacity: 0.45
                    },
                    children: "\u0391\u03B3\u03B1\u03C0\u03B7\u03BC\u03AD\u03BD\u03B1"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                    className: "text-lg font-black",
                    style: {
                      color: settings.textColor
                    },
                    children: visibleFavorites.toLocaleString('el-GR')
                  })]
                })]
              });
            })]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: "space-y-6 mb-8",
            children: [currentItem.notes && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                className: "text-sm leading-relaxed whitespace-pre-wrap",
                style: {
                  color: settings.textColor,
                  opacity: 0.8
                },
                children: currentItem.notes
              })
            }), (currentItem.materials?.length > 0 || currentItem.colors?.length > 0) && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "py-6 border-t border-b space-y-4",
              style: {
                borderColor: `${settings.textColor}15`
              },
              children: [currentItem.materials?.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: "text-xs font-bold uppercase block mb-2",
                  style: {
                    color: settings.textColor,
                    opacity: 0.4
                  },
                  children: "\u03A5\u03BB\u03B9\u03BA\u03B1 \u039A\u03B1\u03C4\u03B1\u03C3\u03BA\u03B5\u03C5\u03B7\u03C2"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                  className: "flex flex-wrap gap-2",
                  children: currentItem.materials.map(mat => /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                    className: "text-xs px-2.5 py-1",
                    style: {
                      backgroundColor: `${settings.textColor}08`,
                      color: settings.textColor,
                      borderRadius: settings.borderRadius
                    },
                    children: mat
                  }, mat))
                })]
              }), currentItem.colors?.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: "text-xs font-bold uppercase block mb-2",
                  style: {
                    color: settings.textColor,
                    opacity: 0.4
                  },
                  children: "\u03A7\u03C1\u03C9\u03BC\u03B1\u03C4\u03B1"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                  className: "flex flex-wrap gap-2",
                  children: currentItem.colors.map(col => /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                    className: "text-xs border px-2.5 py-1",
                    style: {
                      borderColor: `${settings.textColor}15`,
                      color: settings.textColor,
                      borderRadius: settings.borderRadius
                    },
                    children: col
                  }, col))
                })]
              })]
            }), (currentItem.dimensions || currentItem.weight) && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "flex gap-8 text-sm",
              children: [currentItem.dimensions && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: "block text-[10px] font-bold uppercase mb-1",
                  style: {
                    color: settings.textColor,
                    opacity: 0.4
                  },
                  children: "\u0394\u03B9\u03B1\u03C3\u03C4\u03B1\u03C3\u03B5\u03B9\u03C2"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: "font-medium",
                  style: {
                    color: settings.textColor
                  },
                  children: currentItem.dimensions
                })]
              }), currentItem.weight && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: "block text-[10px] font-bold uppercase mb-1",
                  style: {
                    color: settings.textColor,
                    opacity: 0.4
                  },
                  children: "\u0392\u03B1\u03C1\u03BF\u03C2"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  className: "font-medium",
                  style: {
                    color: settings.textColor
                  },
                  children: currentItem.weight
                })]
              })]
            })]
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
            className: "mt-auto pt-6",
            children: (() => {
              const isCurrentSold = isSoldItem(currentItem);
              if (!showContactInfo) {
                return /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                  onClick: () => setShowContactInfo(true),
                  className: "w-full py-4 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg hover:opacity-95",
                  style: {
                    backgroundColor: isCurrentSold ? '#78716c' : settings.primaryColor,
                    borderRadius: settings.borderRadius
                  },
                  children: isCurrentSold ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(IconBag, {}), " \u0395\u03BE\u03B1\u03BD\u03C4\u03BB\u03AE\u03B8\u03B7\u03BA\u03B5 - \u03A1\u03C9\u03C4\u03AE\u03C3\u03C4\u03B5 \u03B3\u03B9\u03B1 \u03C0\u03B1\u03C1\u03CC\u03BC\u03BF\u03B9\u03BF"]
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(IconBag, {}), " \u03A0\u03CE\u03C2 \u03BD\u03B1 \u03C4\u03BF \u03B1\u03C0\u03BF\u03BA\u03C4\u03AE\u03C3\u03B5\u03C4\u03B5"]
                  })
                });
              } else {
                if (isCurrentSold) {
                  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                    className: "border p-6 text-center animate-fade-in",
                    style: {
                      backgroundColor: `${settings.textColor}03`,
                      borderColor: `${settings.textColor}10`,
                      borderRadius: settings.borderRadius
                    },
                    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "flex flex-col gap-3",
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
                        className: "text-sm mb-2",
                        style: {
                          color: settings.textColor
                        },
                        children: ["\u03A4\u03BF \u03C3\u03C5\u03B3\u03BA\u03B5\u03BA\u03C1\u03B9\u03BC\u03AD\u03BD\u03BF \u03BA\u03BF\u03BC\u03BC\u03AC\u03C4\u03B9 \u03AD\u03C7\u03B5\u03B9 \u03AE\u03B4\u03B7 \u03B4\u03BF\u03B8\u03B5\u03AF.", /*#__PURE__*/(0, _jsxRuntime.jsx)("br", {}), "\u03A3\u03C4\u03B5\u03AF\u03BB\u03C4\u03B5 \u03BC\u03BF\u03C5 \u03AD\u03BD\u03B1 \u03BC\u03AE\u03BD\u03C5\u03BC\u03B1 \u03B3\u03B9\u03B1 \u03BD\u03B1 \u03B4\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AE\u03C3\u03BF\u03C5\u03BC\u03B5 \u03BA\u03AC\u03C4\u03B9 \u03C0\u03B1\u03C1\u03CC\u03BC\u03BF\u03B9\u03BF!"]
                      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("a", {
                        href: settings.fallbackLinks['Instagram'],
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "w-full py-3 text-white font-bold transition flex items-center justify-center gap-2 shadow-sm hover:opacity-90",
                        style: {
                          backgroundColor: settings.primaryColor,
                          borderRadius: settings.borderRadius
                        },
                        children: ["\u039C\u03AE\u03BD\u03C5\u03BC\u03B1 \u03C3\u03C4\u03BF Instagram ", /*#__PURE__*/(0, _jsxRuntime.jsx)(IconExternalLink, {})]
                      })]
                    })
                  });
                }
                const pLinks = currentItem.purchaseLinks || currentItem.productLinks || [];
                const pPlatforms = (currentItem.postedPlatforms || []).filter(p => p.showInShop !== false && p.site !== 'Vinted');
                const fallbackPlatforms = !currentItem.postedPlatforms && currentItem.platforms ? currentItem.platforms.map(p => ({
                  site: p,
                  showInShop: true
                })).filter(p => p.site !== 'Vinted') : [];
                const displayPlatforms = [...pPlatforms, ...fallbackPlatforms].filter(p => p.showInShop !== false);
                const hasAnyLink = pLinks.length > 0 || displayPlatforms.length > 0;
                return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: "border p-6 text-center animate-fade-in",
                  style: {
                    backgroundColor: `${settings.textColor}03`,
                    borderColor: `${settings.textColor}10`,
                    borderRadius: settings.borderRadius
                  },
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h4", {
                    className: "font-bold mb-4",
                    style: {
                      color: settings.textColor
                    },
                    children: "\u0395\u03C0\u03B9\u03BB\u03AD\u03BE\u03C4\u03B5 \u03C4\u03C1\u03CC\u03C0\u03BF \u03B1\u03B3\u03BF\u03C1\u03AC\u03C2:"
                  }), hasAnyLink ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "flex flex-col gap-3",
                    children: [pLinks.map((link, idx) => {
                      const finalUrl = link.url || settings.fallbackLinks[link.site];
                      if (finalUrl) {
                        const isVintedLink = String(link.site || '').toLowerCase() === 'vinted';
                        return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                          className: "w-full",
                          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("a", {
                            href: finalUrl,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "w-full py-3 border font-bold transition flex items-center justify-center gap-2 shadow-sm hover:opacity-90 text-center",
                            style: {
                              backgroundColor: settings.bgColor,
                              borderColor: `${settings.textColor}15`,
                              color: settings.textColor,
                              borderRadius: settings.borderRadius
                            },
                            children: ["\u0391\u03B3\u03BF\u03C1\u03AC \u03BC\u03AD\u03C3\u03C9 ", link.site, " ", /*#__PURE__*/(0, _jsxRuntime.jsx)(IconExternalLink, {})]
                          }), isVintedLink && /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                            className: "text-[11px] leading-relaxed mt-2 px-2",
                            style: {
                              color: settings.textColor,
                              opacity: 0.58
                            },
                            children: "\u0397 \u03C4\u03B5\u03BB\u03B9\u03BA\u03AE \u03C4\u03B9\u03BC\u03AE \u03C3\u03C4\u03BF Vinted \u03BC\u03C0\u03BF\u03C1\u03B5\u03AF \u03BD\u03B1 \u03B1\u03BB\u03BB\u03AC\u03BE\u03B5\u03B9 \u03BA\u03B1\u03C4\u03AC \u03C4\u03B7\u03BD \u03B1\u03B3\u03BF\u03C1\u03AC \u03BB\u03CC\u03B3\u03C9 \u03C0\u03C1\u03BF\u03C3\u03C4\u03B1\u03C3\u03AF\u03B1\u03C2 \u03B1\u03B3\u03BF\u03C1\u03B1\u03C3\u03C4\u03AE \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE\u03C2 \u03B1\u03C0\u03BF\u03C3\u03C4\u03BF\u03BB\u03AE\u03C2."
                          })]
                        }, `buy-${idx}`);
                      }
                      return /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
                        className: "w-full py-3 border font-bold flex items-center justify-center text-center",
                        style: {
                          backgroundColor: `${settings.textColor}05`,
                          borderColor: `${settings.textColor}15`,
                          color: settings.textColor,
                          borderRadius: settings.borderRadius,
                          opacity: 0.7
                        },
                        children: ["\u0394\u03B9\u03B1\u03B8\u03AD\u03C3\u03B9\u03BC\u03BF \u03C3\u03C4\u03BF: ", link.site]
                      }, `buy-${idx}`);
                    }), displayPlatforms.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "mt-2",
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                        className: "text-xs mb-2",
                        style: {
                          color: settings.textColor,
                          opacity: 0.5
                        },
                        children: "\u0394\u03B5\u03AF\u03C4\u03B5 \u03C4\u03BF \u03B5\u03C0\u03AF\u03C3\u03B7\u03C2 \u03C3\u03C4\u03B1 Social:"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                        className: "flex flex-wrap gap-2 justify-center",
                        children: displayPlatforms.map((plat, idx) => {
                          const finalUrl = plat.url || settings.fallbackLinks[plat.site];
                          if (finalUrl) {
                            return /*#__PURE__*/(0, _jsxRuntime.jsxs)("a", {
                              href: finalUrl,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "px-3 py-1.5 text-xs font-bold transition flex items-center gap-1 hover:opacity-90",
                              style: {
                                backgroundColor: `${settings.textColor}08`,
                                color: settings.textColor,
                                borderRadius: settings.borderRadius
                              },
                              children: [plat.site, " ", /*#__PURE__*/(0, _jsxRuntime.jsx)(IconExternalLink, {})]
                            }, `plat-${idx}`);
                          }
                          return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                            className: "px-3 py-1.5 border text-xs font-bold shadow-sm",
                            style: {
                              backgroundColor: settings.bgColor,
                              borderColor: `${settings.textColor}15`,
                              color: settings.textColor,
                              borderRadius: settings.borderRadius,
                              opacity: 0.7
                            },
                            children: plat.site
                          }, `plat-${idx}`);
                        })
                      })]
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "mt-4 pt-4 border-t",
                      style: {
                        borderColor: `${settings.textColor}15`
                      },
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                        className: "text-xs mb-2",
                        style: {
                          color: settings.textColor,
                          opacity: 0.5
                        },
                        children: "\u0394\u03B5\u03BD \u03C3\u03B1\u03C2 \u03B2\u03BF\u03BB\u03B5\u03CD\u03BF\u03C5\u03BD \u03C4\u03B1 \u03C0\u03B1\u03C1\u03B1\u03C0\u03AC\u03BD\u03C9;"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("a", {
                        href: settings.fallbackLinks['Instagram'],
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-sm font-bold underline",
                        style: {
                          color: settings.primaryColor
                        },
                        children: "\u03A3\u03C4\u03B5\u03AF\u03BB\u03C4\u03B5 \u03BC\u03BF\u03C5 \u03BC\u03AE\u03BD\u03C5\u03BC\u03B1 \u03C3\u03C4\u03BF Instagram"
                      })]
                    })]
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "flex flex-col gap-3",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                      className: "text-sm mb-2",
                      style: {
                        color: settings.textColor,
                        opacity: 0.8
                      },
                      children: "\u0392\u03B3\u03AC\u03BB\u03C4\u03B5 \u03BC\u03B9\u03B1 \u03C6\u03C9\u03C4\u03BF\u03B3\u03C1\u03B1\u03C6\u03AF\u03B1 \u03C4\u03B7 \u03B4\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03AF\u03B1 \u03C0\u03BF\u03C5 \u03C3\u03B1\u03C2 \u03B5\u03BD\u03B4\u03B9\u03B1\u03C6\u03AD\u03C1\u03B5\u03B9 \u03BA\u03B1\u03B9 \u03C3\u03C4\u03B5\u03AF\u03BB\u03C4\u03B5 \u03BC\u03BF\u03C5 \u03BC\u03AE\u03BD\u03C5\u03BC\u03B1 \u03C3\u03C4\u03B1 Social Media!"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("a", {
                      href: settings.fallbackLinks['Instagram'],
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "w-full py-3 text-white font-bold transition flex items-center justify-center gap-2 shadow-sm hover:opacity-90",
                      style: {
                        backgroundColor: settings.primaryColor,
                        borderRadius: settings.borderRadius
                      },
                      children: ["\u039C\u03AE\u03BD\u03C5\u03BC\u03B1 \u03C3\u03C4\u03BF Instagram ", /*#__PURE__*/(0, _jsxRuntime.jsx)(IconExternalLink, {})]
                    })]
                  })]
                });
              }
            })()
          })]
        })]
      })]
    })]
  });
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/(0, _jsxRuntime.jsx)(Shop, {}));

