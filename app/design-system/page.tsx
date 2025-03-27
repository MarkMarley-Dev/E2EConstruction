// @/app/design-system/page.tsx

import React from 'react';
import ColorPalette from '../components/ui/ColorPalette';

export default function DesignSystemPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Construction Platform Design System</h1>
      <p style={{ 
        marginBottom: '2rem', 
        fontSize: '1.1rem', 
        maxWidth: '800px',
        color: 'var(--color-text-light)'
      }}>
        This design system defines our visual language and component standards. 
        The Charcoal & Dusty Rose color palette provides a sophisticated, professional look with warm accents.
      </p>
      <ColorPalette />
    </div>
  );
}