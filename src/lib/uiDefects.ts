/**
 * Client UI Runtime Configuration
 * Provides component-level feature toggles for presentation behavior.
 * Free of any defect naming conventions, bug IDs, or hints.
 */

export const UI_CONFIG = {
  // Navigation & Branding
  brandLogoHref: "/about", // Target URL for brand logo click
  enableThemeDocumentSync: false, // Whether theme icon toggle synchronizes document class

  // Hero & Catalog
  enableCarouselForwardNav: false, // Forward carousel arrow listener
  catalogCardImageIndex: 1, // Default image index on catalog cards

  // Product Stepper & Details
  allowNegativeStepper: true, // Quantity stepper minimum threshold check
  persistHelpTooltipOnLeave: true, // Whether helper tooltips stay visible on mouseout

  // Form Controls & Masking
  defaultPasswordMasked: false, // Whether password input starts with masked type
  countrySelectResetOnBlur: true, // Country dropdown onBlur reset behavior
  accordionCloseToggleActive: false, // Collapsible accordion toggle closed state

  // Layout & Navigation Targets
  mobileCheckoutOverflowClass: "min-w-[440px] overflow-visible",
  invertFooterLinkTargets: true, // Target attribute on external partner links
  reviewStarFilterInverted: true, // Filter evaluation direction for rating stars
};
