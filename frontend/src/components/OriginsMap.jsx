import { useMemo, useState } from 'react';

const REGION_CHIPS = [
  'China',
  'Fujian',
  'Guangdong',
  'Pinglin',
  'Zhejiang',
  'Hangzhou',
  'Guizhou',
  'Anhui',
  'Taiwan',
  'Nantou',
  'Taitung',
  'Alishan',
  'Japan',
  'Korea',
  'Nepal',
  'Thailand',
  'Vietnam',
  'Sri Lanka',
  'Indonesia',
  'Java',
  'Kenya',
  'New Zealand'
];

function OriginsMap({ teas, loading }) {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regionTeas = useMemo(() => {
    if (!selectedRegion) return [];
    const region = selectedRegion.toLowerCase();
    return teas.filter((tea) => {
      if (!tea.origin) return false;
      const origin = tea.origin.toLowerCase();
      return origin.includes(region) || region.includes(origin);
    });
  }, [selectedRegion, teas]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="map-view">
      <header className="map-header">
        <h2>Origines des Thés</h2>
      </header>
      <div className="asia-map-container">
        <svg className="asia-map" viewBox="150 100 600 550">
          <path
            className={`region ${selectedRegion === 'China' ? 'active' : ''}`}
            data-region="China"
            d="M 350 180 L 380 160 L 420 150 L 460 155 L 490 160 L 520 170 L 545 185 L 560 200 L 570 220 L 575 245 L 570 270 L 560 290 L 545 305 L 525 315 L 500 320 L 475 325 L 450 325 L 425 320 L 400 310 L 380 295 L 365 280 L 355 260 L 350 240 L 345 220 L 345 200 Z"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('China')}
          />

          <path
            className={`region ${selectedRegion === 'India' ? 'active' : ''}`}
            data-region="India"
            d="M 220 260 L 250 255 L 280 260 L 305 275 L 320 295 L 330 320 L 335 345 L 335 370 L 330 395 L 320 415 L 305 430 L 285 440 L 265 445 L 245 440 L 230 425 L 220 405 L 215 380 L 215 355 L 215 330 L 215 305 L 218 280 Z"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('India')}
          />

          <path
            className={`region ${selectedRegion === 'Japan' ? 'active' : ''}`}
            data-region="Japan"
            d="M 680 200 L 695 190 L 705 195 L 710 210 L 710 230 L 705 245 L 695 250 L 685 245 L 680 230 L 680 215 Z M 690 255 L 700 250 L 710 255 L 715 270 L 715 290 L 710 305 L 700 310 L 690 305 L 685 290 L 685 270 Z"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('Japan')}
          />

          <path
            className={`region ${selectedRegion === 'Korea' ? 'active' : ''}`}
            data-region="Korea"
            d="M 620 195 L 635 188 L 645 190 L 650 205 L 650 225 L 645 240 L 635 250 L 625 248 L 620 235 L 618 215 Z"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('Korea')}
          />

          <ellipse
            className={`region ${selectedRegion === 'Taiwan' ? 'active' : ''}`}
            data-region="Taiwan"
            cx="610"
            cy="295"
            rx="10"
            ry="30"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('Taiwan')}
          />

          <path
            className={`region ${selectedRegion === 'Nepal' ? 'active' : ''}`}
            data-region="Nepal"
            d="M 320 255 L 340 250 L 355 252 L 365 258 L 368 268 L 360 275 L 345 278 L 330 275 L 322 268 Z"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('Nepal')}
          />

          <path
            className={`region ${selectedRegion === 'Thailand' ? 'active' : ''}`}
            data-region="Thailand"
            d="M 430 340 L 445 335 L 455 340 L 462 355 L 465 375 L 465 395 L 460 415 L 450 430 L 440 435 L 430 430 L 425 415 L 422 395 L 422 375 L 425 355 Z"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('Thailand')}
          />

          <path
            className={`region ${selectedRegion === 'Vietnam' ? 'active' : ''}`}
            data-region="Vietnam"
            d="M 475 335 L 490 330 L 500 335 L 505 350 L 507 370 L 505 390 L 500 410 L 492 430 L 485 445 L 478 455 L 472 450 L 468 435 L 467 415 L 468 395 L 470 375 L 472 355 Z"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('Vietnam')}
          />

          <ellipse
            className={`region ${selectedRegion === 'Sri Lanka' ? 'active' : ''}`}
            data-region="Sri Lanka"
            cx="285"
            cy="470"
            rx="12"
            ry="20"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('Sri Lanka')}
          />

          <path
            className={`region ${selectedRegion === 'Indonesia' ? 'active' : ''}`}
            data-region="Indonesia"
            d="M 420 480 L 480 475 L 540 478 L 590 485 L 620 492 L 610 510 L 580 515 L 540 515 L 490 512 L 440 508 L 410 500 Z M 470 525 L 510 522 L 540 525 L 555 535 L 545 545 L 510 547 L 475 543 Z"
            fill="#e8e8e8"
            stroke="#666666"
            strokeWidth="1"
            onClick={() => setSelectedRegion('Indonesia')}
          />

          <text x="450" y="240" textAnchor="middle" fill="#000000" fontSize="18" fontWeight="700">CHINA</text>
          <text x="270" y="350" textAnchor="middle" fill="#000000" fontSize="16" fontWeight="700">INDIA</text>
          <text x="695" y="230" textAnchor="middle" fill="#000000" fontSize="14" fontWeight="700">JAPAN</text>
          <text x="632" y="220" textAnchor="middle" fill="#000000" fontSize="12" fontWeight="600">KOREA</text>
          <text x="610" y="300" textAnchor="middle" fill="#000000" fontSize="11" fontWeight="600">TAIWAN</text>
          <text x="345" y="265" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="600">NEPAL</text>
          <text x="435" y="395" textAnchor="middle" fill="#000000" fontSize="13" fontWeight="600">THAILAND</text>
          <text x="487" y="385" textAnchor="middle" fill="#000000" fontSize="13" fontWeight="600">VIETNAM</text>
          <text x="285" y="473" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="600">SRI LANKA</text>
          <text x="510" y="500" textAnchor="middle" fill="#000000" fontSize="14" fontWeight="600">INDONESIA</text>
        </svg>

        <div className="filter-section" style={{ marginTop: '16px' }}>
          <label>Regions</label>
          <div className="filter-buttons">
            {REGION_CHIPS.map((region) => (
              <button
                key={region}
                className={`filter-btn ${selectedRegion === region ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {selectedRegion && (
          <div className="region-details">
            <button className="close-details" onClick={() => setSelectedRegion(null)}>×</button>
            <h3>{selectedRegion}</h3>
            <div id="region-teas-list">
              {regionTeas.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                  Aucun thé de {selectedRegion} dans votre collection
                </p>
              ) : (
                regionTeas.map((tea) => (
                  <div key={tea.id} className="tea-item">
                    <h4>{tea.name}</h4>
                    <p>{tea.type} - {tea.brand || ''}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OriginsMap;
