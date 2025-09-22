import useThemeStore, { type Themes } from '../../store/themeStore'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore()

  const themeGroups = {
    'Light Themes': [
      { value: 'light' as Themes, label: 'Light', description: 'Clean and minimal' },
      { value: 'cupcake' as Themes, label: 'Cupcake', description: 'Soft pastels' },
      { value: 'bumblebee' as Themes, label: 'Bumblebee', description: 'Yellow & black' },
      { value: 'emerald' as Themes, label: 'Emerald', description: 'Professional green' },
      { value: 'corporate' as Themes, label: 'Corporate', description: 'Business blue' },
      { value: 'retro' as Themes, label: 'Retro', description: 'Vintage vibes' },
      { value: 'garden' as Themes, label: 'Garden', description: 'Nature inspired' },
      { value: 'lofi' as Themes, label: 'Lofi', description: 'Muted aesthetic' },
      { value: 'pastel' as Themes, label: 'Pastel', description: 'Soft colors' },
      { value: 'fantasy' as Themes, label: 'Fantasy', description: 'Magical purples' },
      { value: 'wireframe' as Themes, label: 'Wireframe', description: 'Minimalist' },
      { value: 'cmyk' as Themes, label: 'CMYK', description: 'Print inspired' },
      { value: 'autumn' as Themes, label: 'Autumn', description: 'Warm oranges' },
      { value: 'acid' as Themes, label: 'Acid', description: 'Bright neons' },
      { value: 'lemonade' as Themes, label: 'Lemonade', description: 'Fresh citrus' },
      { value: 'winter' as Themes, label: 'Winter', description: 'Cool blues' },
    ],
    'Dark Themes': [
      { value: 'dark' as Themes, label: 'Dark', description: 'Default dark' },
      { value: 'synthwave' as Themes, label: 'Synthwave', description: '80s neon' },
      { value: 'halloween' as Themes, label: 'Halloween', description: 'Spooky orange' },
      { value: 'forest' as Themes, label: 'Forest', description: 'Deep greens' },
      { value: 'aqua' as Themes, label: 'Aqua', description: 'Ocean blues' },
      { value: 'black' as Themes, label: 'Black', description: 'Pure contrast' },
      { value: 'luxury' as Themes, label: 'Luxury', description: 'Rich golds' },
      { value: 'dracula' as Themes, label: 'Dracula', description: 'Vampire purple' },
      { value: 'cyberpunk' as Themes, label: 'Cyberpunk', description: 'Futuristic' },
      { value: 'valentine' as Themes, label: 'Valentine', description: 'Romantic reds' },
      { value: 'coffee' as Themes, label: 'Coffee', description: 'Brown warmth' },
      { value: 'business' as Themes, label: 'Business', description: 'Professional' },
      { value: 'night' as Themes, label: 'Night', description: 'Deep navy' },
    ]
  }

  const handleThemeChange = (newTheme: Themes) => {
    setTheme(newTheme)
  }

  const renderThemeCard = (themeOption: { value: Themes; label: string; description: string }) => (
    <div
      key={themeOption.value}
      className={`card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
        theme === themeOption.value 
          ? 'border-primary shadow-primary/20' 
          : 'border-base-300 hover:border-primary/50'
      }`}
      onClick={() => handleThemeChange(themeOption.value)}
      data-theme={themeOption.value}
    >
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="card-title text-lg">{themeOption.label}</h3>
          {theme === themeOption.value && (
            <div className="badge badge-primary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Theme Preview */}
        <div className="mb-3">
          <div className="flex gap-1 mb-2">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <div className="w-4 h-4 rounded-full bg-secondary"></div>
            <div className="w-4 h-4 rounded-full bg-accent"></div>
            <div className="w-4 h-4 rounded-full bg-neutral"></div>
          </div>
          <div className="text-xs text-base-content/60 mb-2">{themeOption.description}</div>
          
          {/* Mini UI Preview */}
          <div className="bg-base-200 p-2 rounded text-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="flex-1 h-1 bg-base-content/20 rounded"></div>
            </div>
            <div className="flex gap-1">
              <div className="btn btn-primary btn-xs">Primary</div>
              <div className="btn btn-secondary btn-xs">Secondary</div>
            </div>
          </div>
        </div>
        
        <div className="card-actions">
          <button 
            className={`btn btn-sm w-full ${
              theme === themeOption.value 
                ? 'btn-primary' 
                : 'btn-outline btn-primary'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handleThemeChange(themeOption.value)
            }}
          >
            {theme === themeOption.value ? 'Currently Active' : 'Apply Theme'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Theme Customization
          </span>
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Personalize your Vaultify experience by choosing from our collection of beautiful themes. 
          Each theme changes the entire color scheme of the application.
        </p>
      </div>

      {/* Current Theme Display */}
      <div className="alert alert-info mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">Current Theme</h3>
          <div className="text-sm">
            You're currently using the <span className="font-semibold capitalize">{theme}</span> theme. 
            Click any theme below to preview and apply it instantly.
          </div>
        </div>
      </div>

      {/* Theme Groups */}
      {Object.entries(themeGroups).map(([groupName, themes]) => (
        <div key={groupName} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">{groupName}</h2>
            <div className="flex-1 h-px bg-base-300"></div>
            <div className="badge badge-outline">{themes.length} themes</div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {themes.map(renderThemeCard)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ThemeSwitcher