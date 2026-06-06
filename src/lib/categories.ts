export const MENU_CATEGORIES = [
  { value: "Ethiopian",  label: "🌿 Ethiopian"  },
  { value: "Burgers",    label: "🍔 Burgers"    },
  { value: "Pizza",      label: "🍕 Pizza"      },
  { value: "Healthy",    label: "🥗 Healthy"    },
  { value: "Desserts",   label: "🍫 Desserts"   },
  { value: "Drinks",     label: "🧃 Drinks"     },
  {value: "Meat" ,    label:"🍖 Meat"},
  { value: "Other",      label: "🍽️ Other"      },
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number]["value"];

// The "All" pill + every category for the customer filter bar
export const FILTER_CATEGORIES = [
  { value: "All",       label: "🍽️ All"        },
  ...MENU_CATEGORIES,
] as const;