import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as dataStore from '../data/dataStore';

function formatMoney(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(amount || 0);
}

// Фикс для иконок маркеров Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Кастомные иконки по статусу
const createIcon = (color) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="
    width: 30px;
    height: 30px;
    background: ${color};
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  "></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

const newMarkerIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    animation: pulse 1.5s infinite;
  "></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

const statusIcons = {
    'В работе': createIcon('#f59e0b'),
    'Заказал': createIcon('#10b981'),
    'Снял': createIcon('#ef4444'),
    'Новый': createIcon('#3b82f6'),
    'Отменён': createIcon('#6b7280')
};

// Города России
const CITIES = [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
    'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
    'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград', 'Краснодар',
    'Саратов', 'Тюмень', 'Тольятти', 'Ижевск', 'Барнаул', 'Ульяновск',
    'Иркутск', 'Хабаровск', 'Ярославль', 'Владивосток', 'Махачкала',
    'Томск', 'Оренбург', 'Кемерово', 'Новокузнецк', 'Рязань', 'Астрахань',
    'Набережные Челны', 'Пенза', 'Липецк', 'Тула', 'Киров', 'Чебоксары',
    'Калининград', 'Брянск', 'Курск', 'Иваново', 'Магнитогорск', 'Тверь',
    'Ставрополь', 'Белгород', 'Сочи'
];

const RUSSIA_BOUNDS = {
    center: [55.7558, 60],
    minZoom: 3,
    maxZoom: 18
};

// Компонент для отслеживания кликов на карте
function MapClickHandler({ onMapClick, isAddingMarker }) {
    useMapEvents({
        click: (e) => {
            if (isAddingMarker) {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
}

function MapView() {
    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isAddingMarker, setIsAddingMarker] = useState(false);
    const [newMarker, setNewMarker] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: 'Москва',
        employeeId: '',
        status: 'Новый',
        amount: 0
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [clientsData, employeesData] = await Promise.all([
                dataStore.getClients(),
                dataStore.getEmployees()
            ]);
            setClients(clientsData);
            setEmployees(employeesData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCityChange = (e) => {
        const city = e.target.value;
        const coords = dataStore.geocodeCity(city);
        setFormData(prev => ({ ...prev, city }));
        if (coords) {
            setNewMarker({ lat: coords[0], lng: coords[1] });
        }
    };

    const handleMapClick = (latlng) => {
        setNewMarker(latlng);
        setShowForm(true);
        setIsAddingMarker(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseInt(value) || 0 : value
        }));
    };

    const handleSaveMarker = async () => {
        if (!formData.name || !formData.employeeId) {
            alert('Заполните обязательные поля: ФИО и Сотрудник');
            return;
        }

        const coords = dataStore.geocodeCity(formData.city);

        const newClient = {
            employee_id: formData.employeeId,
            name: formData.name,
            phone: formData.phone || '+7 (000) 000-00-00',
            address: formData.address || 'Не указан',
            city: formData.city,
            status: formData.status,
            funds: formData.amount > 0 ? [{ type: 'Наличка', amount: formData.amount }] : [],
            phone_type: 'Смартфон',
            validity: 'Проверка',
            coords: coords
        };

        await dataStore.addClient(newClient);
        await loadData();

        setNewMarker(null);
        setShowForm(false);
        setFormData({
            name: '',
            phone: '',
            address: '',
            city: 'Москва',
            employeeId: '',
            status: 'Новый',
            amount: 0
        });
    };

    const handleCancelMarker = () => {
        setNewMarker(null);
        setShowForm(false);
        setIsAddingMarker(false);
    };

    const filteredClients = filter === 'all'
        ? clients
        : clients.filter(c => c.status === filter);

    const statusCounts = {
        all: clients.length,
        'В работе': clients.filter(c => c.status === 'В работе').length,
        'Заказал': clients.filter(c => c.status === 'Заказал').length,
        'Снял': clients.filter(c => c.status === 'Снял').length,
        'Новый': clients.filter(c => c.status === 'Новый').length,
    };

    const getClientCoords = (client) => {
        if (client.coords && Array.isArray(client.coords)) {
            return client.coords;
        }
        const coords = dataStore.geocodeCity(client.city || 'Москва');
        return coords || [55.7558, 37.6173];
    };

    if (loading) {
        return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <div style={{ color: 'var(--text-muted)' }}>Загрузка карты...</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">🇷🇺 Карта клиентов России</h1>
                    <p className="page-subtitle">Все клиенты отображаются по городам</p>
                </div>
                <button
                    className={`btn ${isAddingMarker ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => {
                        if (!isAddingMarker) {
                            setShowForm(true);
                            const coords = dataStore.geocodeCity('Москва');
                            if (coords) {
                                setNewMarker({ lat: coords[0], lng: coords[1] });
                            }
                        } else {
                            setIsAddingMarker(false);
                        }
                    }}
                    style={isAddingMarker ? { background: 'var(--status-work)', borderColor: 'var(--status-work)' } : {}}
                >
                    {isAddingMarker ? '✋ Отменить' : '+ Добавить клиента'}
                </button>
            </div>

            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('all')}
                >
                    Все ({statusCounts.all})
                </button>
                <button
                    className={`btn ${filter === 'В работе' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('В работе')}
                    style={{ background: filter === 'В работе' ? 'var(--status-work)' : undefined }}
                >
                    ⏳ В работе ({statusCounts['В работе']})
                </button>
                <button
                    className={`btn ${filter === 'Заказал' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('Заказал')}
                    style={{ background: filter === 'Заказал' ? 'var(--status-ordered)' : undefined }}
                >
                    ✅ Заказал ({statusCounts['Заказал']})
                </button>
                <button
                    className={`btn ${filter === 'Новый' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('Новый')}
                    style={{ background: filter === 'Новый' ? 'var(--status-new)' : undefined }}
                >
                    🆕 Новый ({statusCounts['Новый']})
                </button>
                <button
                    className={`btn ${filter === 'Снял' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('Снял')}
                    style={{ background: filter === 'Снял' ? 'var(--status-cancelled)' : undefined }}
                >
                    ❌ Снял ({statusCounts['Снял']})
                </button>
            </div>

            <div className="map-container">
                <MapContainer
                    center={RUSSIA_BOUNDS.center}
                    zoom={4}
                    minZoom={RUSSIA_BOUNDS.minZoom}
                    maxZoom={RUSSIA_BOUNDS.maxZoom}
                    style={{ height: '100%', width: '100%' }}
                    maxBounds={[[35, 19], [82, 190]]}
                    maxBoundsViscosity={1.0}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <MapClickHandler onMapClick={handleMapClick} isAddingMarker={isAddingMarker} />

                    {filteredClients.map(client => {
                        const coords = getClientCoords(client);
                        return (
                            <Marker
                                key={client.id}
                                position={coords}
                                icon={statusIcons[client.status] || statusIcons['Новый']}
                            >
                                <Popup>
                                    <div className="map-popup">
                                        <h4>{client.name}</h4>
                                        <p><strong>Город:</strong> {client.city || 'Москва'}</p>
                                        <p><strong>Статус:</strong> {client.status}</p>
                                        <p><strong>Сумма:</strong> {formatMoney(client.amount || 0)}</p>
                                        <p><strong>Адрес:</strong> {client.address}</p>
                                        <p><strong>Телефон:</strong> {client.phone}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {newMarker && (
                        <Marker
                            position={[newMarker.lat, newMarker.lng]}
                            icon={newMarkerIcon}
                        />
                    )}
                </MapContainer>
            </div>

            {/* Легенда */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginTop: '20px',
                padding: '16px 20px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#f59e0b' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>В работе</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Заказал</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#3b82f6' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Новый</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Снял</span>
                </div>
            </div>

            {/* Форма добавления клиента */}
            {showForm && (
                <div className="modal-overlay" onClick={handleCancelMarker}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">+ Новый клиент</h2>
                            <button className="modal-close" onClick={handleCancelMarker}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">ФИО клиента *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    placeholder="Иванов Иван Иванович"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Сотрудник *</label>
                                    <select
                                        name="employeeId"
                                        className="form-select"
                                        value={formData.employeeId}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="">Выберите</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name} ({emp.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">🏙️ Город России *</label>
                                    <select
                                        name="city"
                                        className="form-select"
                                        value={formData.city}
                                        onChange={handleCityChange}
                                    >
                                        {CITIES.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Адрес (улица, дом)</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-input"
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    placeholder="ул. Ленина, д. 15"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Телефон</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleFormChange}
                                        placeholder="+7 (999) 123-45-67"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Сумма (₽)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-input"
                                        value={formData.amount}
                                        onChange={handleFormChange}
                                        placeholder="100000"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Статус</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                >
                                    <option value="Новый">🆕 Новый</option>
                                    <option value="В работе">⏳ В работе</option>
                                    <option value="Заказал">✅ Заказал</option>
                                    <option value="Снял">❌ Снял</option>
                                </select>
                            </div>

                            <div style={{
                                padding: '12px',
                                background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '13px',
                                color: 'var(--text-secondary)'
                            }}>
                                📍 Маркер будет размещён в городе <strong>{formData.city}</strong>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCancelMarker}>
                                Отмена
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveMarker}>
                                Добавить клиента
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MapView;
