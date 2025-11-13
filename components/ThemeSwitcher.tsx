import React from 'react';
import { ColorPalette } from '../types';

interface ThemeEditorProps {
  palettes: ColorPalette[];
  currentPalette: ColorPalette;
  onPaletteChange: (palette: ColorPalette) => void;
}

const colorLabels: { [key: string]: string } = {
  primary: 'Primária',
  secondary: 'Secundária',
  accent: 'Destaque',
  'base-100': 'Fundo',
  'base-content': 'Texto',
};

export const ThemeSwitcher: React.FC<ThemeEditorProps> = ({ palettes, currentPalette, onPaletteChange }) => {

  const handleColorChange = (colorName: keyof ColorPalette['colors'], value: string) => {
    const newColors = { ...currentPalette.colors, [colorName]: value };
    onPaletteChange({ name: 'Personalizado', colors: newColors });
  };

  return (
    <div className="p-4 border rounded-lg bg-base-100">
      <h3 className="text-lg font-semibold mb-4">Mudar Tema do Site</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {palettes.map((palette) => (
          <div key={palette.name}>
            <button
              onClick={() => onPaletteChange(palette)}
              className={`w-full p-2 border-2 rounded-lg ${
                currentPalette.name === palette.name ? 'border-accent' : 'border-transparent'
              }`}
              aria-label={`Selecionar tema ${palette.name}`}
            >
              <span className="block mb-2 text-center text-sm">{palette.name}</span>
              <div className="flex justify-center items-center gap-1 h-8 rounded">
                <div className="w-1/4 h-full rounded-l" style={{ backgroundColor: palette.colors.primary }}></div>
                <div className="w-1/4 h-full" style={{ backgroundColor: palette.colors.secondary }}></div>
                <div className="w-1/4 h-full" style={{ backgroundColor: palette.colors.accent }}></div>
                <div className="w-1/4 h-full rounded-r" style={{ backgroundColor: palette.colors['base-content'] }}></div>
              </div>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
          <h4 className="text-md font-semibold mb-4">Personalizar Cores Atuais</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Object.entries(currentPalette.colors).map(([name, value]) => (
              <div key={name}>
                <label htmlFor={`color-${name}`} className="block text-sm font-medium mb-1">
                  {colorLabels[name]}
                </label>
                <input 
                  id={`color-${name}`}
                  type="color" 
                  value={value}
                  onChange={(e) => handleColorChange(name as keyof ColorPalette['colors'], e.target.value)}
                  className="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
                />
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};