import React from "react";
import * as FaIcons from "react-icons/fa"; // Import all Font Awesome icons

interface DynamicFaIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

const DynamicFaIcon: React.FC<DynamicFaIconProps> = ({
  iconName,
  size = 20,
  className,
}) => {
  // Try to find the icon component by its name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (FaIcons as any)[iconName];

  if (!IconComponent) {
    // Fallback to a default icon if the specified icon is not found
    return <FaIcons.FaQuestion size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};

export default DynamicFaIcon;
