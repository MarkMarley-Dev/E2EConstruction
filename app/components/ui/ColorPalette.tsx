// @/app/components/ui/ColorPalette.tsx

import React from 'react';
import styles from './styles/ColorPalette.module.css';

interface ColorSwatchProps {
  name: string;
  color: string;
  textColor?: string;
  hexCode?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  name, 
  color, 
  textColor = 'var(--color-white)',
  hexCode
}) => (
  <div 
    className={styles.swatch} 
    style={{ backgroundColor: color, color: textColor }}
  >
    <div className={styles.swatchName}>{name}</div>
    <div className={styles.swatchValue}>{hexCode || color}</div>
  </div>
);

const ColorPalette: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Charcoal & Dusty Rose Color Palette</h2>
      
      <div className={styles.section}>
        <h3>Primary Colors - Charcoal</h3>
        <div className={styles.swatchGrid}>
          <ColorSwatch name="Primary" color="var(--color-primary)" hexCode="#37474F" />
          <ColorSwatch name="Primary Light" color="var(--color-primary-light)" hexCode="#546E7A" />
          <ColorSwatch name="Primary Dark" color="var(--color-primary-dark)" hexCode="#263238" />
        </div>
      </div>
      
      <div className={styles.section}>
        <h3>Secondary Colors - Dusty Rose</h3>
        <div className={styles.swatchGrid}>
          <ColorSwatch name="Secondary" color="var(--color-secondary)" hexCode="#C48B9F" />
          <ColorSwatch name="Secondary Light" color="var(--color-secondary-light)" hexCode="#D7A9B7" />
          <ColorSwatch name="Secondary Dark" color="var(--color-secondary-dark)" hexCode="#A76C82" />
        </div>
      </div>
      
      <div className={styles.section}>
        <h3>Accent Colors - Sage</h3>
        <div className={styles.swatchGrid}>
          <ColorSwatch name="Accent" color="var(--color-accent)" hexCode="#7D8C7C" />
          <ColorSwatch name="Accent Light" color="var(--color-accent-light)" hexCode="#9DAC9C" />
          <ColorSwatch name="Accent Dark" color="var(--color-accent-dark)" hexCode="#5E6B5E" />
        </div>
      </div>
      
      <div className={styles.section}>
        <h3>Neutral Colors</h3>
        <div className={styles.swatchGrid}>
          <ColorSwatch name="White" color="var(--color-white)" textColor="var(--color-gray-800)" hexCode="#FFFFFF" />
          <ColorSwatch name="Gray 100" color="var(--color-gray-100)" textColor="var(--color-gray-800)" hexCode="#F8F9FA" />
          <ColorSwatch name="Gray 200" color="var(--color-gray-200)" textColor="var(--color-gray-800)" hexCode="#E9ECEF" />
          <ColorSwatch name="Gray 300" color="var(--color-gray-300)" textColor="var(--color-gray-800)" hexCode="#DEE2E6" />
          <ColorSwatch name="Gray 400" color="var(--color-gray-400)" textColor="var(--color-gray-800)" hexCode="#CED4DA" />
          <ColorSwatch name="Gray 500" color="var(--color-gray-500)" textColor="var(--color-gray-800)" hexCode="#ADB5BD" />
          <ColorSwatch name="Gray 600" color="var(--color-gray-600)" hexCode="#6C757D" />
          <ColorSwatch name="Gray 700" color="var(--color-gray-700)" hexCode="#495057" />
          <ColorSwatch name="Gray 800" color="var(--color-gray-800)" hexCode="#343A40" />
          <ColorSwatch name="Gray 900" color="var(--color-gray-900)" hexCode="#212529" />
          <ColorSwatch name="Black" color="var(--color-black)" hexCode="#000000" />
        </div>
      </div>
      
      <div className={styles.section}>
        <h3>Functional Colors</h3>
        <div className={styles.swatchGrid}>
          <ColorSwatch name="Success" color="var(--color-success)" hexCode="#6B9080" />
          <ColorSwatch name="Success Light" color="var(--color-success-light)" hexCode="#87A496" />
          <ColorSwatch name="Success Dark" color="var(--color-success-dark)" hexCode="#55756A" />
          
          <ColorSwatch name="Warning" color="var(--color-warning)" textColor="var(--color-gray-800)" hexCode="#DDA448" />
          <ColorSwatch name="Warning Light" color="var(--color-warning-light)" textColor="var(--color-gray-800)" hexCode="#E6BB75" />
          <ColorSwatch name="Warning Dark" color="var(--color-warning-dark)" textColor="var(--color-gray-800)" hexCode="#CB8F32" />
          
          <ColorSwatch name="Error" color="var(--color-error)" hexCode="#B56357" />
          <ColorSwatch name="Error Light" color="var(--color-error-light)" hexCode="#C8867C" />
          <ColorSwatch name="Error Dark" color="var(--color-error-dark)" hexCode="#984A40" />
        </div>
      </div>
      
      <div className={styles.section}>
        <h3>Construction Specific</h3>
        <div className={styles.swatchGrid}>
          <ColorSwatch name="Planning" color="var(--color-planning)" hexCode="#37474F" />
          <ColorSwatch name="Party Wall" color="var(--color-party-wall)" hexCode="#C48B9F" />
          <ColorSwatch name="Contractor" color="var(--color-contractor)" hexCode="#7D8C7C" />
        </div>
      </div>

      <div className={styles.section}>
        <h3>UI Components Preview</h3>
        <div className={styles.componentPreview}>
          <button className={styles.button}>Primary Button</button>
          <button className={styles.buttonSecondary}>Secondary Button</button>
          <div className={styles.card}>
            <h4>Sample Card</h4>
            <p>This is how a card component would look with the current theme.</p>
          </div>
          <div className={styles.statusContainer}>
            <span className={styles.statusSuccess}>Success Status</span>
            <span className={styles.statusWarning}>Warning Status</span>
            <span className={styles.statusError}>Error Status</span>
          </div>
          <div className={styles.formElements}>
            <input type="text" placeholder="Input field" />
            <select>
              <option>Select dropdown</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;