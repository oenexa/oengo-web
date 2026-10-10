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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 max-w-7xl mx-auto">
      {/* 1. Top Header */}
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

      {/* 2. Main Content Area */}
      {activeOrder ? (
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
      ) : (
        <div className="space-y-8">
          {/* Cuisine Filter Carousel & Search */}
          <CuisineFilter
            selectedCuisine={selectedCuisine}
            onSelectCuisine={setSelectedCuisine}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Restaurant Discovery Directory */}
          <RestaurantDirectory
            restaurants={filteredRestaurants}
            selectedRestaurant={selectedRestaurant}
            onSelectRestaurant={handleSelectRestaurant}
          />

          {/* Workspace: Menu Catalog & Sticky Cart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <MenuCatalog
                restaurant={selectedRestaurant}
                menuItems={menuItems}
                onAddToCart={handleAddToCart}
                onCustomize={dish => setCustomizingDish(dish)}
              />
            </div>

            <div className="lg:col-span-1 space-y-6">
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
