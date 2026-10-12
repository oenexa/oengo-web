"use client";

import { Header } from "@/components/common/Header";
import { StorefrontHero } from "@/components/customer/StorefrontHero";
import { CuisineFilter } from "@/components/customer/CuisineFilter";
import { RestaurantDirectory } from "@/components/customer/RestaurantDirectory";
import { MenuCatalog } from "@/components/customer/MenuCatalog";
import { CartDrawer } from "@/components/customer/CartDrawer";
import { DishCustomizationModal } from "@/components/customer/DishCustomizationModal";
import { CustomerProfileDrawer } from "@/components/customer/CustomerProfileDrawer";
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

              {/* Workspace: Menu Catalog & Sticky Cart */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" aria-label="Storefront Workspace">
                <div className="lg:col-span-8">
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
    </div>
  );
}
