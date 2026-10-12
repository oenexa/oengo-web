"use client";

import { Header } from "@/components/common/Header";
import { StorefrontHero } from "@/components/customer/StorefrontHero";
import { CuisineFilter } from "@/components/customer/CuisineFilter";
import { RestaurantDirectory } from "@/components/customer/RestaurantDirectory";
import { MenuCatalog } from "@/components/customer/MenuCatalog";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { DishCustomizationModal } from "@/components/customer/DishCustomizationModal";
import { CustomerProfileDrawer } from "@/components/customer/CustomerProfileDrawer";
import { CustomerKYCModal } from "@/components/customer/CustomerKYCModal";
import { ActiveOrderTrackingView } from "@/components/tracking/ActiveOrderTrackingView";
import { useStorefront } from "@/hooks/useStorefront";

export default function Home() {
  const {
    wallet,
    deliveryAddress,
    isEditingAddress,
    setIsEditingAddress,
    setDeliveryAddress,
    selectedCuisine,
    setSelectedCuisine,
    searchQuery,
    setSearchQuery,
    filteredRestaurants,
    selectedRestaurant,
    handleSelectRestaurant,
    menuItems,
    handleAddToCart,
    setCustomizingDish,
    customizingDish,
    handleAddToCartWithCustomizations,
    cart,
    handleUpdateQty,
    foodSubtotal,
    deliveryFee,
    tipEUR,
    setTipEUR,
    carbonNeutral,
    setCarbonNeutral,
    orderTotal,
    commissionPct,
    handleUpdateCommission,
    loading,
    logMessage,
    selectedMethod,
    setSelectedMethod,
    cardNumber,
    setCardNumber,
    cardHolder,
    setCardHolder,
    cardExp,
    setCardExp,
    cardCvc,
    setCardCvc,
    saveCard,
    setSaveCard,
    handlePlaceOrder,
    activeOrder,
    setActiveOrder,
    setLogMessage,
    handleRestaurantAccept,
    handleCourierPickup,
    handleConfirmDelivery,
    isProfileOpen,
    setIsProfileOpen,
    isKYCModalOpen,
    setIsKYCModalOpen,
    isKYCVerified,
    setIsKYCVerified,
    refreshWallet,
  } = useStorefront();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      
      {/* 1. Top Navigation Bar (SRE Clean Boundary) */}
      <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Header
            wallet={wallet}
            deliveryAddress={deliveryAddress}
            isEditingAddress={isEditingAddress}
            onToggleEditAddress={() => setIsEditingAddress(!isEditingAddress)}
            onSaveAddress={addr => {
              setDeliveryAddress(addr);
              setIsEditingAddress(false);
            }}
            onAddressChange={setDeliveryAddress}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenKYC={() => setIsKYCModalOpen(true)}
            isKYCVerified={isKYCVerified}
          />
        </div>
      </nav>

      {/* 2. Main Content Area */}
      <main>
        {activeOrder ? (
          <section className="max-w-7xl mx-auto px-6 py-8" aria-label="Active Order Tracking">
            <ActiveOrderTrackingView
              order={activeOrder}
              loading={loading}
              onRestaurantAccept={handleRestaurantAccept}
              onCourierPickup={handleCourierPickup}
              onConfirmDelivery={handleConfirmDelivery}
              onResetOrder={() => {
                setActiveOrder(null);
                setLogMessage("Ready for next order");
              }}
            />
          </section>
        ) : (
          <>
            {/* 🦸‍♂️ Refactored Clean Hero Component */}
            <StorefrontHero />

            <div className="max-w-7xl mx-auto px-6 space-y-12">
              {/* Cuisine Filter Carousel & Search */}
              <section className="bg-slate-900/40 p-4 rounded-3xl border border-slate-800 backdrop-blur-sm" aria-label="Filter Cuisines">
                <CuisineFilter
                  selectedCuisine={selectedCuisine}
                  onSelectCuisine={setSelectedCuisine}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </section>

              {/* Restaurant Discovery Directory */}
              <section aria-label="Restaurant Directory">
                <RestaurantDirectory
                  restaurants={filteredRestaurants}
                  selectedRestaurant={selectedRestaurant}
                  onSelectRestaurant={handleSelectRestaurant}
                  onAddToCart={handleAddToCart}
                  onCustomize={dish => setCustomizingDish(dish)}
                />
              </section>

              {/* Workspace: Dedicated Menu Catalog for Selected Restaurant & Sticky Cart */}
              {selectedRestaurant ? (
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300" aria-label="Storefront Workspace">
                  <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{selectedRestaurant.icon}</span>
                        <div>
                          <h3 className="text-sm font-black text-white">{selectedRestaurant.name}</h3>
                          <p className="text-xs text-slate-400">Viewing exclusive menu dishes</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectRestaurant(null as any)}
                        className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        ✕ Close Menu
                      </button>
                    </div>

                    <MenuCatalog
                      restaurant={selectedRestaurant}
                      menuItems={menuItems}
                      onAddToCart={handleAddToCart}
                      onCustomize={dish => setCustomizingDish(dish)}
                    />
                  </div>

                  <aside className="lg:col-span-4 sticky top-24 space-y-6" aria-label="Shopping Cart">
                    <CartDrawer
                      cart={cart}
                      onUpdateQty={handleUpdateQty}
                      foodSubtotal={foodSubtotal}
                      deliveryFee={deliveryFee}
                      tipEUR={tipEUR}
                      setTipEUR={setTipEUR}
                      carbonNeutral={carbonNeutral}
                      setCarbonNeutral={setCarbonNeutral}
                      orderTotal={orderTotal}
                      commissionPct={commissionPct}
                      onUpdateCommission={handleUpdateCommission}
                      loading={loading}
                      logMessage={logMessage}
                      selectedMethod={selectedMethod}
                      onSelectMethod={setSelectedMethod}
                      wallet={wallet}
                      cardNumber={cardNumber}
                      setCardNumber={setCardNumber}
                      cardHolder={cardHolder}
                      setCardHolder={setCardHolder}
                      cardExp={cardExp}
                      setCardExp={setCardExp}
                      cardCvc={cardCvc}
                      setCardCvc={setCardCvc}
                      saveCard={saveCard}
                      setSaveCard={setSaveCard}
                      onPlaceOrder={handlePlaceOrder}
                    />
                  </aside>
                </section>
              ) : cart.length > 0 ? (
                <section className="flex justify-end animate-in fade-in duration-200">
                  <div className="w-full max-w-md">
                    <CartDrawer
                      cart={cart}
                      onUpdateQty={handleUpdateQty}
                      foodSubtotal={foodSubtotal}
                      deliveryFee={deliveryFee}
                      tipEUR={tipEUR}
                      setTipEUR={setTipEUR}
                      carbonNeutral={carbonNeutral}
                      setCarbonNeutral={setCarbonNeutral}
                      orderTotal={orderTotal}
                      commissionPct={commissionPct}
                      onUpdateCommission={handleUpdateCommission}
                      loading={loading}
                      logMessage={logMessage}
                      selectedMethod={selectedMethod}
                      onSelectMethod={setSelectedMethod}
                      wallet={wallet}
                      cardNumber={cardNumber}
                      setCardNumber={setCardNumber}
                      cardHolder={cardHolder}
                      setCardHolder={setCardHolder}
                      cardExp={cardExp}
                      setCardExp={setCardExp}
                      cardCvc={cardCvc}
                      setCardCvc={setCardCvc}
                      saveCard={saveCard}
                      setSaveCard={setSaveCard}
                      onPlaceOrder={handlePlaceOrder}
                    />
                  </div>
                </section>
              ) : null}
            </div>
          </>
        )}
      </main>

      {/* 3. Modal Dialogs */}
      <DishCustomizationModal
        item={customizingDish}
        isOpen={!!customizingDish}
        onClose={() => setCustomizingDish(null)}
        onAddToCart={handleAddToCartWithCustomizations}
      />

      <CustomerProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <CustomerKYCModal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        onSuccess={() => {
          setIsKYCVerified(true);
          refreshWallet();
        }}
      />
    </div>
  );
}
