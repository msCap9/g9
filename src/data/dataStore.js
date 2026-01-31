import { supabase } from '../lib/supabase';

// ==================== EMPLOYEES ====================

export async function getEmployees() {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
    return data || [];
}

export async function getEmployeeById(id) {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching employee:', error);
        return null;
    }
    return data;
}

export async function addEmployee(employee) {
    const { data, error } = await supabase
        .from('employees')
        .insert([{
            name: employee.name,
            role: employee.role,
            phone: employee.phone || '',
            email: employee.email || '',
            clients_count: 0,
            total_amount: 0
        }])
        .select()
        .single();

    if (error) {
        console.error('Error adding employee:', error);
        return null;
    }
    return data;
}

export async function updateEmployee(id, updates) {
    const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating employee:', error);
        return null;
    }
    return data;
}

export async function deleteEmployee(id) {
    const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting employee:', error);
        return false;
    }
    return true;
}

export async function archiveEmployee(id) {
    const { data, error } = await supabase
        .from('employees')
        .update({ archived: true })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error archiving employee:', error);
        return null;
    }
    return data;
}

// ==================== CLIENTS ====================

export async function getClients() {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
    return data || [];
}

export async function getClientsByEmployee(employeeId) {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('archived', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
    return data || [];
}

export async function getClientById(id) {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching client:', error);
        return null;
    }
    return data;
}

export async function addClient(client) {
    const amount = calculateTotalAmount(client.funds || []);

    const { data, error } = await supabase
        .from('clients')
        .insert([{
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
            notes: client.notes || ''
        }])
        .select()
        .single();

    if (error) {
        console.error('Error adding client:', error);
        return null;
    }

    // Обновляем счётчик клиентов у сотрудника
    if (data.employee_id) {
        await updateEmployeeStats(data.employee_id);
    }

    return data;
}

export async function updateClient(id, updates) {
    if (updates.funds) {
        updates.amount = calculateTotalAmount(updates.funds);
    }

    // Преобразуем camelCase в snake_case
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.operator !== undefined) dbUpdates.operator = updates.operator;
    if (updates.phoneType !== undefined) dbUpdates.phone_type = updates.phoneType;
    if (updates.phone_type !== undefined) dbUpdates.phone_type = updates.phone_type;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.coords !== undefined) dbUpdates.coords = updates.coords;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.validity !== undefined) dbUpdates.validity = updates.validity;
    if (updates.funds !== undefined) dbUpdates.funds = updates.funds;
    if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.employee_id !== undefined) dbUpdates.employee_id = updates.employee_id;
    if (updates.employeeId !== undefined) dbUpdates.employee_id = updates.employeeId;

    const { data, error } = await supabase
        .from('clients')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating client:', error);
        return null;
    }

    // Обновляем статистику сотрудника
    if (data.employee_id) {
        await updateEmployeeStats(data.employee_id);
    }

    return data;
}

export async function deleteClient(id) {
    // Получаем клиента перед удалением
    const client = await getClientById(id);

    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting client:', error);
        return false;
    }

    // Обновляем статистику сотрудника
    if (client?.employee_id) {
        await updateEmployeeStats(client.employee_id);
    }

    return true;
}

export async function archiveClient(id) {
    const client = await getClientById(id);

    const { data, error } = await supabase
        .from('clients')
        .update({ archived: true })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error archiving client:', error);
        return null;
    }

    // Обновляем статистику сотрудника
    if (client?.employee_id) {
        await updateEmployeeStats(client.employee_id);
    }

    return data;
}

// ==================== ARCHIVE ====================

export async function getArchivedEmployees() {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('archived', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching archived employees:', error);
        return [];
    }
    return data || [];
}

export async function getArchivedClients() {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('archived', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching archived clients:', error);
        return [];
    }
    return data || [];
}

export async function restoreEmployee(id) {
    const { data, error } = await supabase
        .from('employees')
        .update({ archived: false })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error restoring employee:', error);
        return null;
    }
    return data;
}

export async function restoreClient(id) {
    const client = await getClientById(id);

    const { data, error } = await supabase
        .from('clients')
        .update({ archived: false })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error restoring client:', error);
        return null;
    }

    // Обновляем статистику сотрудника
    if (client?.employee_id) {
        await updateEmployeeStats(client.employee_id);
    }

    return data;
}

// ==================== HELPERS ====================

function calculateTotalAmount(funds) {
    if (!funds || !Array.isArray(funds)) return 0;
    return funds.reduce((sum, fund) => sum + (parseFloat(fund.amount) || 0), 0);
}

async function updateEmployeeStats(employeeId) {
    // Получаем всех активных клиентов сотрудника
    const { data: clients } = await supabase
        .from('clients')
        .select('amount')
        .eq('employee_id', employeeId)
        .eq('archived', false);

    const clientsCount = clients?.length || 0;
    const totalAmount = clients?.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0) || 0;

    await supabase
        .from('employees')
        .update({
            clients_count: clientsCount,
            total_amount: totalAmount
        })
        .eq('id', employeeId);
}

// ==================== GEOCODING ====================

const russianCities = {
    'москва': [55.7558, 37.6173],
    'санкт-петербург': [59.9343, 30.3351],
    'новосибирск': [55.0084, 82.9357],
    'екатеринбург': [56.8389, 60.6057],
    'казань': [55.7879, 49.1233],
    'нижний новгород': [56.2965, 43.9361],
    'челябинск': [55.1644, 61.4368],
    'самара': [53.1959, 50.1002],
    'омск': [54.9885, 73.3242],
    'ростов-на-дону': [47.2357, 39.7015],
    'уфа': [54.7388, 55.9721],
    'красноярск': [56.0153, 92.8932],
    'воронеж': [51.6720, 39.1843],
    'пермь': [58.0105, 56.2502],
    'волгоград': [48.7080, 44.5133],
    'краснодар': [45.0355, 38.9753],
    'саратов': [51.5330, 46.0344],
    'тюмень': [57.1522, 65.5272],
    'тольятти': [53.5303, 49.3461],
    'ижевск': [56.8527, 53.2114],
    'барнаул': [53.3548, 83.7698],
    'ульяновск': [54.3142, 48.4031],
    'иркутск': [52.2978, 104.2964],
    'хабаровск': [48.4827, 135.0837],
    'ярославль': [57.6299, 39.8737],
    'владивосток': [43.1198, 131.8869],
    'махачкала': [42.9849, 47.5047],
    'томск': [56.4977, 84.9744],
    'оренбург': [51.7727, 55.0988],
    'кемерово': [55.3333, 86.0833],
    'новокузнецк': [53.7596, 87.1216],
    'рязань': [54.6269, 39.6916],
    'астрахань': [46.3497, 48.0408],
    'набережные челны': [55.7254, 52.4121],
    'пенза': [53.2007, 45.0046],
    'липецк': [52.6031, 39.5708],
    'тула': [54.1961, 37.6182],
    'киров': [58.5966, 49.6601],
    'чебоксары': [56.1322, 47.2519],
    'калининград': [54.7104, 20.4522],
    'брянск': [53.2521, 34.3717],
    'курск': [51.7373, 36.1874],
    'иваново': [56.9994, 40.9728],
    'магнитогорск': [53.4242, 58.9838],
    'тверь': [56.8587, 35.9176],
    'ставрополь': [45.0428, 41.9734],
    'белгород': [50.5997, 36.5986],
    'сочи': [43.5855, 39.7231]
};

export function geocodeCity(cityName) {
    if (!cityName) return null;
    const normalized = cityName.toLowerCase().trim();
    const coords = russianCities[normalized];
    if (coords) {
        // Добавляем небольшой разброс для разных адресов в одном городе
        const lat = coords[0] + (Math.random() - 0.5) * 0.05;
        const lng = coords[1] + (Math.random() - 0.5) * 0.05;
        return [lat, lng];
    }
    return null;
}
