import { useEffect } from 'react';
import Cookies from 'js-cookie';

const ThemeSwitcher = ({ currentTheme, toggleTheme }) => {
  useEffect(() => {
    // Set cookie when theme changes
    Cookies.set('styleCookieName', currentTheme, { expires: 7 });
  }, [currentTheme]);

  const handleThemeChange = (theme) => (e) => {
    e.preventDefault();
    toggleTheme(theme);
  };

  return (
    <div id="my_switcher" className="my_switcher">
      <ul>
        <li>
          <button 
            onClick={handleThemeChange('light')}
            data-theme="light" 
            className={`setColor light ${currentTheme === 'light' ? 'active' : ''}`}
          >
            <img src="/src/assets/images/light/switch/sun-01.svg" alt="Sun images" />
            <span title="Light Mode">Light</span>
          </button>
        </li>
        <li>
          <button 
            onClick={handleThemeChange('dark')}
            data-theme="dark" 
            className={`setColor dark ${currentTheme === 'dark' ? 'active' : ''}`}
          >
            <img src="/src/assets/images/light/switch/vector.svg" alt="Vector Images" />
            <span title="Dark Mode">Dark</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ThemeSwitcher;