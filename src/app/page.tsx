"use client";

import { Header } from "@/components/common/Header";
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
      
      {/* 1. Top Navigation Bar (Full Width) */}
      <div className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
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
      </div>

      {/* 2. Main Content Area */}
      {activeOrder ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
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
        </div>
      ) : (
        <>
          {/* 🦸‍♂️ Epic Full-Width Hero Section */}
          <div className="relative w-full h-[360px] bg-gradient-to-r from-orange-600 via-amber-500 to-rose-600 overflow-hidden mb-12">
            {/* Abstract Background Patterns */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" 
                 style={{ backgroundImage: 'radial-gradient(circle at 20% 150%, #ffffff 0%, transparent 50%), radial-gradient(circle at 80% -50%, #000000 0%, transparent 50%)' }}>
            </div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 blur-3xl rounded-full"></div>
            <div className="absolute top-10 -right-20 w-80 h-80 bg-black/20 blur-3xl rounded-full"></div>
            
            <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-start z-10">
              <span className="px-3 py-1 mb-4 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest shadow-xl">
                🚀 Zero-Fee Decentralized Delivery
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl leading-tight">
                Crave it? <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-100">
                  OENGO it.
                </span>
              </h1>
              <p className="mt-4 text-white/80 font-medium max-w-lg text-lg drop-shadow-md">
                Experience ultra-fast delivery powered by transparent blockchain escrows. No hidden service fees.
              </p>
            </div>

            {/* Gradient Fade to Black */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 space-y-12">
            {/* Cuisine Filter Carousel & Search */}
            <div className="bg-slate-900/40 p-4 rounded-3xl border border-slate-800 backdrop-blur-sm">
              <CuisineFilter
                selectedCuisine={selectedCuisine}
                onSelectCuisine={setSelectedCuisine}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Restaurant Discovery Directory */}
            <RestaurantDirectory
              restaurants={filteredRestaurants}
              selectedRestaurant={selectedRestaurant}
              onSelectRestaurant={handleSelectRestaurant}
            />

            {/* Workspace: Menu Catalog & Sticky Cart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <MenuCatalog
                  restaurant={selectedRestaurant}
                  menuItems={menuItems}
                  onAddToCart={handleAddToCart}
                  onCustomize={dish => setCustomizingDish(dish)}
                />
              </div>

              <div className="lg:col-span-4 sticky top-24 space-y-6">
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
          </div>
        </div>
        </>
      )}

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
