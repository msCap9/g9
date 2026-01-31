// Data Store - localStorage version (no Supabase)

const STORAGE_KEYS = {
    EMPLOYEES: 'g9_employees',
    CLIENTS: 'g9_clients',
    ARCHIVE: 'g9_archive'
};

// Helper functions
function loadFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ==================== EMPLOYEES ====================

export function getEmployees() {
    return loadFromStorage(STORAGE_KEYS.EMPLOYEES).filter(e => !e.archived);
}

export function getEmployeeById(id) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    return employees.find(e => e.id === id) || null;
}

export function addEmployee(employee) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const newEmployee = {
        id: Date.now(),
        name: employee.name,
        role: employee.role,
        phone: employee.phone || '',
        email: employee.email || '',
        clients_count: 0,
        total_amount: 0,
        created_at: new Date().toISOString(),
        archived: false
    };
    employees.push(newEmployee);
    saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
    return newEmployee;
}

export function updateEmployee(id, updates) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...updates };
        saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
        return employees[index];
    }
    return null;
}

export function deleteEmployee(id) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const filtered = employees.filter(e => e.id !== id);
    saveToStorage(STORAGE_KEYS.EMPLOYEES, filtered);
    return true;
}

export function archiveEmployee(id) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const employee = employees.find(e => e.id === id);
    if (employee) {
        employee.archived = true;
        employee.archivedAt = new Date().toISOString();
        saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
        return employee;
    }
    return null;
}

// ==================== CLIENTS ====================

export function getClients() {
    return loadFromStorage(STORAGE_KEYS.CLIENTS).filter(c => !c.archived);
}

export function getClientsByEmployee(employeeId) {
    return getClients().filter(c => c.employee_id === employeeId);
}

export function getClientById(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    return clients.find(c => c.id === id) || null;
}

function calculateTotalAmount(funds) {
    if (!funds || !Array.isArray(funds)) return 0;
    return funds.reduce((sum, fund) => sum + (parseFloat(fund.amount) || 0), 0);
}

export function addClient(client) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const amount = calculateTotalAmount(client.funds || []);

    const newClient = {
        id: Date.now(),
        employee_id: client.employee_id || client.employeeId || null,
        name: client.name,
        phone: client.phone || '',
        operator: client.operator || '',
        phone_type: client.phoneType || client.phone_type || '',
        city: client.city || '',
        address: client.address || '',
        coords: client.coords || null,
        status: client.status || 'Новый',
        validity: client.validity || 'Валид',
        funds: client.funds || [],
        amount: amount,
        notes: client.notes || '',
        created_at: new Date().toISOString(),
        archived: false
    };

    clients.push(newClient);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients);

    // Update employee stats
    if (newClient.employee_id) {
        updateEmployeeStats(newClient.employee_id);
    }

    return newClient;
}

export function updateClient(id, updates) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const index = clients.findIndex(c => c.id === id);

    if (index !== -1) {
        if (updates.funds) {
            updates.amount = calculateTotalAmount(updates.funds);
        }

        const oldEmployeeId = clients[index].employee_id;
        clients[index] = { ...clients[index], ...updates };
        saveToStorage(STORAGE_KEYS.CLIENTS, clients);

        // Update stats
        if (oldEmployeeId) updateEmployeeStats(oldEmployeeId);
        if (updates.employee_id && updates.employee_id !== oldEmployeeId) {
            updateEmployeeStats(updates.employee_id);
        }

        return clients[index];
    }
    return null;
}

export function deleteClient(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const client = clients.find(c => c.id === id);
    const employeeId = client?.employee_id;

    const filtered = clients.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, filtered);

    if (employeeId) updateEmployeeStats(employeeId);
    return true;
}

export function archiveClient(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const client = clients.find(c => c.id === id);

    if (client) {
        client.archived = true;
        client.archivedAt = new Date().toISOString();
        saveToStorage(STORAGE_KEYS.CLIENTS, clients);

        if (client.employee_id) updateEmployeeStats(client.employee_id);
        return client;
    }
    return null;
}

// ==================== ARCHIVE ====================

export function getArchivedEmployees() {
    return loadFromStorage(STORAGE_KEYS.EMPLOYEES).filter(e => e.archived);
}

export function getArchivedClients() {
    return loadFromStorage(STORAGE_KEYS.CLIENTS).filter(c => c.archived);
}

export function restoreEmployee(id) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const employee = employees.find(e => e.id === id);

    if (employee) {
        employee.archived = false;
        delete employee.archivedAt;
        saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
        return employee;
    }
    return null;
}

export function restoreClient(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const client = clients.find(c => c.id === id);

    if (client) {
        client.archived = false;
        delete client.archivedAt;
        saveToStorage(STORAGE_KEYS.CLIENTS, clients);

        if (client.employee_id) updateEmployeeStats(client.employee_id);
        return client;
    }
    return null;
}

export function permanentlyDeleteEmployee(id) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const filtered = employees.filter(e => e.id !== id);
    saveToStorage(STORAGE_KEYS.EMPLOYEES, filtered);
    return true;
}

export function permanentlyDeleteClient(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const filtered = clients.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, filtered);
    return true;
}

// ==================== HELPERS ====================

function updateEmployeeStats(employeeId) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const clients = getClientsByEmployee(employeeId);

    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
        employee.clients_count = clients.length;
        employee.total_amount = clients.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
        saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
    }
}

// Geocoding helper
export async function geocodeCity(cityName) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}, Россия&limit=1`
        );
        const data = await response.json();
        if (data && data[0]) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }
    return null;
}
