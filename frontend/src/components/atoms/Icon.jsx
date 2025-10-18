import { icons } from 'lucide-react';

/**
 * A dynamic icon component that renders any icon from the lucide-react library.
 * This provides a single, consistent interface for using icons throughout the app.
 * @param {{ name: string } & React.SVGProps<SVGSVGElement>} props
 */
const Icon = ({ name, color, size, strokeWidth = 1.5, ...props }) => {
  // Dynamically select the icon component from the lucide-react library.
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    // Return a fallback or null if the icon name is invalid.
    return null;
  }

  // Render the selected icon with the given props.
  return <LucideIcon color={color} size={size} strokeWidth={strokeWidth} {...props} />;
};

export default Icon;
