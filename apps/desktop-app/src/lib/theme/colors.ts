// Theme color configuration
// Centralized color palette for easy theme customization

export const colors = {
  // Primary brand colors
  primary: {
    50: 'bg-blue-50',
    100: 'bg-blue-100',
    200: 'bg-blue-200',
    500: 'bg-blue-500',
    600: 'bg-blue-600',
    700: 'bg-blue-700',
    hover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    textDark: 'text-blue-700',
    border: 'border-blue-200',
  },
  
  // Success colors
  success: {
    50: 'bg-green-50',
    100: 'bg-green-100',
    600: 'bg-green-600',
    text: 'text-green-600',
  },
  
  // Warning colors
  warning: {
    50: 'bg-orange-50',
    100: 'bg-orange-100',
    600: 'bg-orange-600',
    text: 'text-orange-600',
  },
  
  // Danger colors
  danger: {
    50: 'bg-red-50',
    100: 'bg-red-100',
    600: 'bg-red-600',
    text: 'text-red-600',
  },
  
  // Info colors
  info: {
    50: 'bg-purple-50',
    100: 'bg-purple-100',
    600: 'bg-purple-600',
    text: 'text-purple-600',
  },
  
  // Neutral colors
  neutral: {
    50: 'bg-gray-50',
    100: 'bg-gray-100',
    200: 'bg-gray-200',
    300: 'bg-gray-300',
    400: 'bg-gray-400',
    500: 'bg-gray-500',
    600: 'bg-gray-600',
    700: 'bg-gray-700',
    800: 'bg-gray-800',
    900: 'bg-gray-900',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      muted: 'text-gray-500',
      light: 'text-gray-400',
    },
    border: 'border-gray-200',
    borderDark: 'border-gray-300',
    hover: 'hover:bg-gray-50',
  },
  
  // Component-specific styles
  components: {
    button: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      ghost: 'text-gray-700 hover:bg-gray-100',
    },
    card: {
      bg: 'bg-white',
      shadow: 'shadow',
      shadowLg: 'shadow-lg',
      border: 'border border-gray-200',
    },
    input: {
      base: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    },
    badge: {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-orange-100 text-orange-800',
      danger: 'bg-red-100 text-red-800',
    },
  },
};

// Helper function to get color classes
export function getColorClass(
  colorKey: string,
  variant: 'bg' | 'text' | 'border' = 'bg'
): string {
  const paths = colorKey.split('.');
  let current: any = colors;
  
  for (const path of paths) {
    current = current[path];
    if (!current) return '';
  }
  
  return current;
}

// Theme presets for quick switching
export const themePresets = {
  default: {
    name: 'Default Blue',
    primary: 'blue',
    accent: 'purple',
  },
  green: {
    name: 'Forest Green',
    primary: 'green',
    accent: 'teal',
  },
  industrial: {
    name: 'Industrial',
    primary: 'gray',
    accent: 'orange',
  },
  professional: {
    name: 'Professional',
    primary: 'indigo',
    accent: 'slate',
  },
};