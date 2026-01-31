// Data Store - localStorage version with async wrapper

const STORAGE_KEYS = {
    EMPLOYEES: 'g9_employees',
    CLIENTS: 'g9_clients',
    ARCHIVE: 'g9_archive'
};

// Helper functions
function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading from storage:', error);
        return [];
    }
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to storage:', error);
    }
}

// ==================== EMPLOYEES ====================

export async function getEmployees() {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    return employees.filter(e => !e.archived);
}

export async function getEmployeeById(id) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    return employees.find(e => e.id === id) || null;
}

export async function addEmployee(employee) {
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

export async function updateEmployee(id, updates) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...updates };
        saveToStorage(STORAGE_KEYS.EMPLOYEES, employees);
        return employees[index];
    }
    return null;
}

export async function deleteEmployee(id) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const filtered = employees.filter(e => e.id !== id);
    saveToStorage(STORAGE_KEYS.EMPLOYEES, filtered);
    return true;
}

export async function archiveEmployee(id) {
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

export async function getClients() {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    return clients.filter(c => !c.archived);
}

export async function getClientsByEmployee(employeeId) {
    const clients = await getClients();
    return clients.filter(c => c.employee_id === employeeId);
}

export async function getClientById(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    return clients.find(c => c.id === id) || null;
}

function calculateTotalAmount(funds) {
    if (!funds || !Array.isArray(funds)) return 0;
    return funds.reduce((sum, fund) => sum + (parseFloat(fund.amount) || 0), 0);
}

export async function addClient(client) {
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
        await updateEmployeeStats(newClient.employee_id);
    }

    return newClient;
}

export async function updateClient(id, updates) {
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
        if (oldEmployeeId) await updateEmployeeStats(oldEmployeeId);
        if (updates.employee_id && updates.employee_id !== oldEmployeeId) {
            await updateEmployeeStats(updates.employee_id);
        }

        return clients[index];
    }
    return null;
}

export async function deleteClient(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const client = clients.find(c => c.id === id);
    const employeeId = client?.employee_id;

    const filtered = clients.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, filtered);

    if (employeeId) await updateEmployeeStats(employeeId);
    return true;
}

export async function archiveClient(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const client = clients.find(c => c.id === id);

    if (client) {
        client.archived = true;
        client.archivedAt = new Date().toISOString();
        saveToStorage(STORAGE_KEYS.CLIENTS, clients);

        if (client.employee_id) await updateEmployeeStats(client.employee_id);
        return client;
    }
    return null;
}

// ==================== ARCHIVE ====================

export async function getArchivedEmployees() {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    return employees.filter(e => e.archived);
}

export async function getArchivedClients() {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    return clients.filter(c => c.archived);
}

export async function restoreEmployee(id) {
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

export async function restoreClient(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const client = clients.find(c => c.id === id);

    if (client) {
        client.archived = false;
        delete client.archivedAt;
        saveToStorage(STORAGE_KEYS.CLIENTS, clients);

        if (client.employee_id) await updateEmployeeStats(client.employee_id);
        return client;
    }
    return null;
}

export async function permanentlyDeleteEmployee(id) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const filtered = employees.filter(e => e.id !== id);
    saveToStorage(STORAGE_KEYS.EMPLOYEES, filtered);
    return true;
}

export async function permanentlyDeleteClient(id) {
    const clients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const filtered = clients.filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTS, filtered);
    return true;
}

// ==================== HELPERS ====================

async function updateEmployeeStats(employeeId) {
    const employees = loadFromStorage(STORAGE_KEYS.EMPLOYEES);
    const allClients = loadFromStorage(STORAGE_KEYS.CLIENTS);
    const clients = allClients.filter(c => c.employee_id === employeeId && !c.archived);

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
