(() => {
  const prefix = 'angels_daycare_';

  window.angelsStore = {
    read(key, fallback = []) {
      try {
        const value = localStorage.getItem(prefix + key);
        return value ? JSON.parse(value) : fallback;
      } catch (error) {
        console.error(`Unable to read local data for ${key}.`, error);
        return fallback;
      }
    },
    write(key, value) {
      try {
        localStorage.setItem(prefix + key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`Unable to save local data for ${key}.`, error);
        return false;
      }
    },
    createId() {
      return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    },
    hasAdminPin() {
      return Boolean(localStorage.getItem(prefix + 'admin_pin'));
    },
    setAdminPin(pin) {
      localStorage.setItem(prefix + 'admin_pin', pin);
    },
    checkAdminPin(pin) {
      return localStorage.getItem(prefix + 'admin_pin') === pin;
    }
  };
})();
