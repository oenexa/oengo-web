export type SupportedLocale = "en" | "it" | "de" | "fr" | "es";

export interface LocaleDefinition {
  code: SupportedLocale;
  name: string;
  flag: string;
}

export const SUPPORTED_LOCALES: LocaleDefinition[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" }
];

export const translations: Record<SupportedLocale, Record<string, string>> = {
  en: {
    // Brand & Header
    "brand.tagline": "Decentralized Delivery",
    "header.deliveringTo": "Delivering to",
    "header.change": "Change",
    "header.save": "Save",
    "header.profile": "Profile",
    "header.login": "Login",
    "header.signUp": "Sign Up",
    "header.logOut": "Log Out",
    "header.adminConsole": "⚡ Admin Console",
    "header.kitchenPortal": "👨‍🍳 Kitchen Portal",
    "header.riderApp": "🚴 Rider App",
    "header.storefront": "🛒 Storefront",

    // Hero
    "hero.badge": "🚀 Zero-Fee Decentralized Delivery",
    "hero.title1": "Crave it?",
    "hero.title2": "OENGO it.",
    "hero.subtitle": "Experience ultra-fast delivery powered by transparent blockchain escrows. No hidden service fees.",

    // Directory
    "directory.featured": "Featured Partner Restaurants (Interactive Frames)",
    "directory.subtitle": "Click on any restaurant frame to expand and inspect dishes directly inside the card.",
    "directory.kitchensActive": "kitchens active",
    "directory.payoutGuaranteed": "95% Payout",
    "directory.openMenu": "⚡ Open Menu Frame",
    "directory.closeMenu": "📖 Close Interactive Menu",
    "directory.liveSync": "Live Kitchen Sync",
    "directory.loadingDishes": "Loading kitchen specialties...",
    "directory.noDishes": "Click on the restaurant to load active menu items.",
    "directory.addToCart": "Add +",
    "directory.soldOut": "Sold Out",

    // Menu Catalog
    "menu.selectPrompt": "Select a restaurant above to view its menu.",
    "menu.catalogTitle": "Menu Catalog",
    "menu.dishesAvailable": "Dishes Available",

    // Cart & Checkout
    "cart.title": "Your Order",
    "cart.empty": "Your cart is empty",
    "cart.subtotal": "Food Subtotal",
    "cart.deliveryFee": "Courier Delivery Fee",
    "cart.driverTip": "Driver Tip",
    "cart.carbonNeutral": "Carbon-Neutral Delivery",
    "cart.total": "Total Amount",
    "cart.checkout": "Place Order Securely",
    "cart.processing": "Processing Escrow...",

    // General & Status
    "status.ready": "Ready for next order",
    "status.loading": "Loading...",
    "status.error": "Error"
  },
  it: {
    // Brand & Header
    "brand.tagline": "Consegne Decentralizzate",
    "header.deliveringTo": "Consegna a",
    "header.change": "Modifica",
    "header.save": "Salva",
    "header.profile": "Profilo",
    "header.login": "Accedi",
    "header.signUp": "Registrati",
    "header.logOut": "Esci",
    "header.adminConsole": "⚡ Console Amministratore",
    "header.kitchenPortal": "👨‍🍳 Portale Cucina",
    "header.riderApp": "🚴 App Corriere",
    "header.storefront": "🛒 Vetrina Negozio",

    // Hero
    "hero.badge": "🚀 Consegna a Zero Commissioni Nascoste",
    "hero.title1": "Hai fame?",
    "hero.title2": "OENGO e gusta.",
    "hero.subtitle": "Ordina dai migliori ristoranti locali con escrow crittografici sicuri e pagamento diretto in Euro o OEN.",

    // Directory
    "directory.featured": "Ristoranti Partner Esclusivi (Menu Interattivi)",
    "directory.subtitle": "Clicca su qualsiasi ristorante per espandere il menu interattivo direttamente nella scheda.",
    "directory.kitchensActive": "cucine attive",
    "directory.payoutGuaranteed": "95% ai Ristoratori",
    "directory.openMenu": "⚡ Apri Menu nella Scheda",
    "directory.closeMenu": "📖 Chiudi Menu",
    "directory.liveSync": "Sincronizzato con la Cucina",
    "directory.loadingDishes": "Caricamento specialità culinarie...",
    "directory.noDishes": "Clicca sul ristorante per visualizzare i piatti.",
    "directory.addToCart": "Aggiungi +",
    "directory.soldOut": "Esaurito",

    // Menu Catalog
    "menu.selectPrompt": "Seleziona un ristorante sopra per visualizzare il catalogo.",
    "menu.catalogTitle": "Catalogo Prodotti",
    "menu.dishesAvailable": "Piatti Disponibili",

    // Cart & Checkout
    "cart.title": "Il Tuo Ordine",
    "cart.empty": "Il tuo carrello è vuoto",
    "cart.subtotal": "Subtotale Cibo",
    "cart.deliveryFee": "Costo di Consegna",
    "cart.driverTip": "Mancia al Rider",
    "cart.carbonNeutral": "Consegna a Impatto Zero",
    "cart.total": "Totale Complessivo",
    "cart.checkout": "Completa Ordine in Sicurezza",
    "cart.processing": "Elaborazione Escrow in corso...",

    // General & Status
    "status.ready": "Pronto per il prossimo ordine",
    "status.loading": "Caricamento...",
    "status.error": "Errore"
  },
  de: {
    // Brand & Header
    "brand.tagline": "Dezentraler Lieferservice",
    "header.deliveringTo": "Lieferadresse",
    "header.change": "Ändern",
    "header.save": "Speichern",
    "header.profile": "Profil",
    "header.login": "Anmelden",
    "header.signUp": "Registrieren",
    "header.logOut": "Abmelden",
    "header.adminConsole": "⚡ Admin-Konsole",
    "header.kitchenPortal": "👨‍🍳 Küchen-Portal",
    "header.riderApp": "🚴 Kurier-App",
    "header.storefront": "🛒 Marktplatz",

    // Hero
    "hero.badge": "🚀 Gebührenfreie dezentrale Lieferung",
    "hero.title1": "Hungrig?",
    "hero.title2": "OENGO liefert.",
    "hero.subtitle": "Ultraschnelle Lieferung abgesichert durch transparente Blockchain-Treuhand. Keine versteckten Kosten.",

    // Directory
    "directory.featured": "Ausgewählte Partner-Restaurants (Interaktive Menüs)",
    "directory.subtitle": "Klicken Sie auf ein Restaurant, um die Gerichte direkt in der Karte auszuklappen.",
    "directory.kitchensActive": "Küchen aktiv",
    "directory.payoutGuaranteed": "95% Auszahlung",
    "directory.openMenu": "⚡ Menü ausklappen",
    "directory.closeMenu": "📖 Menü schließen",
    "directory.liveSync": "Live-Küchensynchronisierung",
    "directory.loadingDishes": "Lade Gerichte...",
    "directory.noDishes": "Wählen Sie ein Restaurant, um Gerichte zu sehen.",
    "directory.addToCart": "Hinzufügen +",
    "directory.soldOut": "Ausverkauft",

    // Menu Catalog
    "menu.selectPrompt": "Wählen Sie oben ein Restaurant aus, um das Menü zu sehen.",
    "menu.catalogTitle": "Speisekarte",
    "menu.dishesAvailable": "Gerichte verfügbar",

    // Cart & Checkout
    "cart.title": "Ihre Bestellung",
    "cart.empty": "Ihr Warenkorb ist leer",
    "cart.subtotal": "Zwischensumme",
    "cart.deliveryFee": "Liefergebühr",
    "cart.driverTip": "Trinkgeld",
    "cart.carbonNeutral": "Klimaneutrale Lieferung",
    "cart.total": "Gesamtbetrag",
    "cart.checkout": "Sicher Bestellen",
    "cart.processing": "Treuhandzahlung wird verarbeitet...",

    // General & Status
    "status.ready": "Bereit für die nächste Bestellung",
    "status.loading": "Wird geladen...",
    "status.error": "Fehler"
  },
  fr: {
    // Brand & Header
    "brand.tagline": "Livraison Décentralisée",
    "header.deliveringTo": "Livraison à",
    "header.change": "Modifier",
    "header.save": "Enregistrer",
    "header.profile": "Profil",
    "header.login": "Connexion",
    "header.signUp": "Inscription",
    "header.logOut": "Déconnexion",
    "header.adminConsole": "⚡ Console Admin",
    "header.kitchenPortal": "👨‍🍳 Portail Cuisine",
    "header.riderApp": "🚴 Application Coursier",
    "header.storefront": "🛒 Boutique",

    // Hero
    "hero.badge": "🚀 Livraison Décentralisée Sans Frais Cachés",
    "hero.title1": "Envie de bien manger?",
    "hero.title2": "OENGO vous livre.",
    "hero.subtitle": "Livraison express propulsée par des tiers de confiance blockchain transparents. 0% de frais abusifs.",

    // Directory
    "directory.featured": "Restaurants Partenaires (Cadres Interactifs)",
    "directory.subtitle": "Cliquez sur un restaurant pour inspecter les plats directement dans sa fiche.",
    "directory.kitchensActive": "cuisines actives",
    "directory.payoutGuaranteed": "95% aux Restaurateurs",
    "directory.openMenu": "⚡ Ouvrir le Menu",
    "directory.closeMenu": "📖 Fermer le Menu",
    "directory.liveSync": "Synchronisation Cuisine en Direct",
    "directory.loadingDishes": "Chargement des plats...",
    "directory.noDishes": "Sélectionnez un restaurant pour afficher ses plats.",
    "directory.addToCart": "Ajouter +",
    "directory.soldOut": "Épuisé",

    // Menu Catalog
    "menu.selectPrompt": "Sélectionnez un restaurant ci-dessus pour voir sa carte.",
    "menu.catalogTitle": "Menu du Restaurant",
    "menu.dishesAvailable": "Plats Disponibles",

    // Cart & Checkout
    "cart.title": "Votre Panier",
    "cart.empty": "Votre panier est vide",
    "cart.subtotal": "Sous-total Plats",
    "cart.deliveryFee": "Frais de Livraison",
    "cart.driverTip": "Pourboire Coursier",
    "cart.carbonNeutral": "Livraison Neutre en Carbone",
    "cart.total": "Montant Total",
    "cart.checkout": "Commander en Toute Sécurité",
    "cart.processing": "Création du séquestre en cours...",

    // General & Status
    "status.ready": "Prêt pour la commande suivante",
    "status.loading": "Chargement...",
    "status.error": "Erreur"
  },
  es: {
    // Brand & Header
    "brand.tagline": "Entrega Descentralizada",
    "header.deliveringTo": "Entregar en",
    "header.change": "Cambiar",
    "header.save": "Guardar",
    "header.profile": "Perfil",
    "header.login": "Iniciar Sesión",
    "header.signUp": "Registrarse",
    "header.logOut": "Cerrar Sesión",
    "header.adminConsole": "⚡ Consola de Admin",
    "header.kitchenPortal": "👨‍🍳 Portal de Cocina",
    "header.riderApp": "🚴 App de Repartidor",
    "header.storefront": "🛒 Tienda",

    // Hero
    "hero.badge": "🚀 Entrega Descentralizada Sin Comisiones Ocultas",
    "hero.title1": "¿Antojo de algo?",
    "hero.title2": "Pídelo con OENGO.",
    "hero.subtitle": "Entrega ultra rápida respaldada por depósitos en garantía transparentes en blockchain. Sin tarifas abusivas.",

    // Directory
    "directory.featured": "Restaurantes Asociados (Menús Interactivos)",
    "directory.subtitle": "Haz clic en cualquier restaurante para desplegar los platos directamente en su tarjeta.",
    "directory.kitchensActive": "cocinas activas",
    "directory.payoutGuaranteed": "95% al Restaurante",
    "directory.openMenu": "⚡ Abrir Menú Interactivo",
    "directory.closeMenu": "📖 Cerrar Menú",
    "directory.liveSync": "Sincronización en Directo",
    "directory.loadingDishes": "Cargando platos...",
    "directory.noDishes": "Selecciona un restaurante para ver sus platos.",
    "directory.addToCart": "Añadir +",
    "directory.soldOut": "Agotado",

    // Menu Catalog
    "menu.selectPrompt": "Selecciona un restaurante arriba para ver el menú.",
    "menu.catalogTitle": "Menú del Restaurante",
    "menu.dishesAvailable": "Platos Disponibles",

    // Cart & Checkout
    "cart.title": "Tu Pedido",
    "cart.empty": "Tu carrito está vacío",
    "cart.subtotal": "Subtotal Comida",
    "cart.deliveryFee": "Tarifa de Entrega",
    "cart.driverTip": "Propina al Repartidor",
    "cart.carbonNeutral": "Entrega Neutra en Carbono",
    "cart.total": "Total a Pagar",
    "cart.checkout": "Pagar con Seguridad",
    "cart.processing": "Procesando fideicomiso...",

    // General & Status
    "status.ready": "Listo para el próximo pedido",
    "status.loading": "Cargando...",
    "status.error": "Error"
  }
};
