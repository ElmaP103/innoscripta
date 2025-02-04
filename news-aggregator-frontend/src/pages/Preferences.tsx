import React from 'react';

const Preferences: React.FC = () => {
  return (
    <div>
      <h2>News Preferences</h2>
      <form>
        <div>
          <h3>Categories</h3>
          <label>
            <input type="checkbox" value="technology" /> Technology
          </label>
          <label>
            <input type="checkbox" value="business" /> Business
          </label>
        </div>
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default Preferences; 