"use client";

import { useState } from "react";
import { MenuItem, CustomizationChoice } from "@/types";
import { formatEUR } from "@/lib/utils";

interface DishCustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, qty: number, choices: CustomizationChoice[]) => void;
}

export function DishCustomizationModal({
  item,
  isOpen,
  onClose,
  onAddToCart
}: DishCustomizationModalProps) {
  const [qty, setQty] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, CustomizationChoice>>({});

  if (!isOpen || !item) return null;

  const groups = item.customizations && item.customizations.length > 0 ? item.customizations : [
    {
      name: "Choose Bread / Crust",
      isMulti: false,
      options: [
        { name: "Traditional White Artisan", extraEUR: 0.00 },
        { name: "Whole Wheat / Brown", extraEUR: 1.00 },
        { name: "Gluten-Free Certified", extraEUR: 2.50 }
      ]
    },
    {
      name: "Choose Portion Size",
      isMulti: false,
      options: [
        { name: "Regular Size", extraEUR: 0.00 },
        { name: "Large (+30% portion)", extraEUR: 3.50 }
      ]
    },
    {
      name: "Add Extras & Sauces",
      isMulti: true,
      options: [
        { name: "Extra Melted Cheese", extraEUR: 1.80 },
        { name: "Crispy Bacon / Pancetta", extraEUR: 2.20 },
        { name: "Special Truffle Sauce", extraEUR: 1.50 }
      ]
    }
  ];

  const handleSelectOption = (groupName: string, optionName: string, extraEUR: number, isMulti: boolean) => {
    if (isMulti) {
      const key = `${groupName}_${optionName}`;
      setSelectedChoices(prev => {
        const next = { ...prev };
        if (next[key]) {
          delete next[key];
        } else {
          next[key] = { groupName, optionName, extraEUR };
        }
        return next;
      });
    } else {
      setSelectedChoices(prev => {
        const next = { ...prev };
        // Remove other single-select choices in this group
        Object.keys(next).forEach(k => {
          if (next[k].groupName === groupName) {
            delete next[k];
          }
        });
        next[`${groupName}_${optionName}`] = { groupName, optionName, extraEUR };
        return next;
      });
    }
  };

  // Calculate total price automatically
  const extrasTotal = Object.values(selectedChoices).reduce((sum, c) => sum + c.extraEUR, 0);
  const unitPrice = item.priceEUR + extrasTotal;
  const totalPrice = unitPrice * qty;

  const handleConfirm = () => {
    onAddToCart(item, qty, Object.values(selectedChoices));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-white">{item.name}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-black text-orange-400">{formatEUR(item.priceEUR)}</span>
              {item.calories && <span className="text-[11px] text-slate-500">• {item.calories} kcal</span>}
              {item.prepMinutes && <span className="text-[11px] text-slate-500">• ~{item.prepMinutes} mins</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Customization Options */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {groups.map(group => (
            <div key={group.name} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{group.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {group.isMulti ? "Choose multiple" : "Choose one"}
                </span>
              </div>
              <div className="space-y-1.5">
                {group.options.map(opt => {
                  const key = `${group.name}_${opt.name}`;
                  const isSelected = !!selectedChoices[key];
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => handleSelectOption(group.name, opt.name, opt.extraEUR, !!group.isMulti)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? "bg-orange-500/10 border-orange-500/50 text-orange-300"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isSelected ? "bg-orange-500 text-slate-950 font-bold" : "border border-slate-700"
                        }`}>
                          {isSelected ? "✓" : ""}
                        </span>
                        <span>{opt.name}</span>
                      </div>
                      <span className="font-semibold">
                        {opt.extraEUR > 0 ? `+${formatEUR(opt.extraEUR)}` : "Free"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg transition"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-lg transition"
            >
              +
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-orange-500/10 flex items-center justify-between cursor-pointer"
          >
            <span>Add to Cart</span>
            <span>{formatEUR(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
