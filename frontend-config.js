// ============================================
// FARMER MARKET - FRONTEND API CONFIGURATION
// ============================================

const API_BASE_URL = '/api';

console.log('✅ Frontend API Config Loaded');
console.log('📍 API Base URL:', API_BASE_URL);

const getAuthToken = () => sessionStorage.getItem('authToken');
const setAuthToken = (token) => sessionStorage.setItem('authToken', token);
const clearAuthToken = () => sessionStorage.removeItem('authToken');

// Universal API caller
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    try {
        console.log(`📡 API Call: ${options.method || 'GET'} ${url}`);
        
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
            credentials: 'include'
        });
        
        console.log(`📍 HTTP Status: ${response.status}`);
        
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
            console.log(`📦 Response Data:`, data);
        } else {
            const text = await response.text();
            data = { success: false, message: `Invalid response type: ${contentType}`, raw: text };
        }
        
        if (!response.ok) {
            console.error(`❌ HTTP Error ${response.status}:`, data?.message);
            throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        return data;
        
    } catch (error) {
        console.error(`❌ API Error (${url}):`, error.message);
        throw error;
    }
}

// ============================================
// AUTH ENDPOINTS
// ============================================

async function loginUser(email, password) {
    try {
        if (!email || !password) return { success: false, message: 'Email and password are required' };
        
        const response = await apiCall('/auth/login', { method: 'POST', body: { email, password } });
        
        if (!response?.success) return { success: false, message: response?.message || 'Login failed' };
        
        const userData = response.data;
        if (!userData || !userData.id || !userData.email || !userData.role)
            return { success: false, message: 'Invalid server response' };
        
        if (userData.token) setAuthToken(userData.token);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        
        return {
            success: true,
            message: 'Login successful',
            user: { id: userData.id, name: userData.name || 'User', email: userData.email, role: userData.role }
        };
    } catch (error) {
        return { success: false, message: error.message || 'Login failed' };
    }
}

async function registerUser(name, email, password, role) {
    try {
        if (!name || !email || !password || !role)
            return { success: false, message: 'All fields are required' };
        
        const response = await apiCall('/auth/register', { method: 'POST', body: { name, email, password, role } });
        
        if (!response?.success) return { success: false, message: response?.message || 'Registration failed' };
        
        const userData = response.data;
        if (!userData || !userData.id || !userData.email || !userData.role)
            return { success: false, message: 'Invalid server response - missing user data' };
        
        if (userData.token) setAuthToken(userData.token);
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        
        return {
            success: true,
            message: 'Registration successful',
            user: { id: userData.id, name: userData.name || name, email: userData.email, role: userData.role }
        };
    } catch (error) {
        return { success: false, message: error.message || 'Registration failed' };
    }
}

async function getCurrentUser() {
    try {
        const response = await apiCall('/auth/me');
        if (response?.success && response.data) return response.data;
        clearAuthToken();
        return null;
    } catch (error) {
        clearAuthToken();
        return null;
    }
}

async function updateUserProfile(updates) {
    try {
        const response = await apiCall('/auth/profile', { method: 'PUT', body: updates });
        if (response?.success && response.data) {
            sessionStorage.setItem('currentUser', JSON.stringify(response.data));
            return response.data;
        }
        return null;
    } catch (error) {
        throw error;
    }
}

// ============================================
// PRODUCT ENDPOINTS
// ============================================

/**
 * Get all products.
 * For BUYERS: always filters to only approved + not sold out.
 * For FARMERS/ADMIN: returns all their products (including pending/rejected).
 */
async function getProducts(filters = {}) {
    try {
        let endpoint = '/products';
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.search)   params.append('search',   filters.search);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sort)     params.append('sort',     filters.sort);
        if (params.toString()) endpoint += '?' + params.toString();
        
        const response = await apiCall(endpoint);
        
        if (response?.success && Array.isArray(response.data)) return response.data;
        if (Array.isArray(response?.data)) return response.data;
        return [];
    } catch (error) {
        console.error('❌ Failed to fetch products:', error?.message);
        return [];
    }
}

/**
 * ✅ BUYER SAFE: Only returns approved + available products.
 * Use this on all buyer-facing pages instead of getProducts().
 */
async function getApprovedProducts(filters = {}) {
    try {
        const all = await getProducts(filters);
        return all.filter(p => p.status === 'approved' && p.soldOut != 1);
    } catch (error) {
        console.error('❌ Failed to fetch approved products:', error?.message);
        return [];
    }
}

async function getProductById(id) {
    try {
        const response = await apiCall(`/products/${id}`);
        if (response?.success && response.data) return response.data;
        if (response?.data) return response.data;
        return null;
    } catch (error) {
        return null;
    }
}

async function createProduct(productData) {
    try {
        // status defaults to 'pending' on backend — do NOT set it here
        const response = await apiCall('/products', { method: 'POST', body: productData });
        if (response?.data) return response.data;
        throw new Error(response?.message || 'Failed to create product');
    } catch (error) {
        throw error;
    }
}

async function updateProduct(productId, productData) {
    try {
        const response = await apiCall(`/products/${productId}`, { method: 'PUT', body: productData });
        if (response?.data) return response.data;
        throw new Error(response?.message || 'Failed to update product');
    } catch (error) {
        throw error;
    }
}

async function deleteProduct(productId) {
    try {
        const response = await apiCall(`/products/${productId}`, { method: 'DELETE' });
        if (response?.success) return true;
        throw new Error(response?.message || 'Failed to delete product');
    } catch (error) {
        throw error;
    }
}

// ============================================
// ✅ ADMIN: APPROVE / REJECT PRODUCT
// PATCH /api/admin/products/:id/status
// Body: { status: 'approved' | 'rejected', reason?: string }
// ============================================

async function updateProductStatus(productId, status, reason = '') {
    try {
        console.log(`🔄 updateProductStatus: product=${productId}, status=${status}`);
        
        const response = await apiCall(`/admin/products/${productId}/status`, {
            method: 'PATCH',
            body: { status, reason }
        });
        
        console.log('✅ updateProductStatus response:', response);
        
        if (response?.success) return response.data || response;
        throw new Error(response?.message || 'Failed to update product status');
    } catch (error) {
        console.error('❌ updateProductStatus error:', error.message);
        throw error;
    }
}

// ============================================
// ORDER ENDPOINTS
// ============================================

async function getOrders(filters = {}) {
    try {
        let endpoint = '/orders/my-orders';
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.role)   params.append('role',   filters.role);
        if (params.toString()) endpoint += '?' + params.toString();
        
        const response = await apiCall(endpoint);
        if (response?.success && Array.isArray(response.data)) return response.data;
        if (Array.isArray(response?.data)) return response.data;
        return [];
    } catch (error) {
        return [];
    }
}

async function getOrderById(id) {
    try {
        const response = await apiCall(`/orders/${id}`);
        return response?.data || null;
    } catch (error) {
        return null;
    }
}

async function createOrder(orderData) {
    try {
        const response = await apiCall('/orders', { method: 'POST', body: orderData });
        if (response?.data) return response.data;
        throw new Error(response?.message || 'Failed to create order');
    } catch (error) {
        throw error;
    }
}

async function getFarmerOrders() {
    try {
        const response = await apiCall('/orders/farmer-orders');
        if (Array.isArray(response?.data))    return response.data;
        if (Array.isArray(response))          return response;
        if (response?.success && response.data) return Array.isArray(response.data) ? response.data : [];
        return [];
    } catch (error) {
        return [];
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        const response = await apiCall(`/orders/${orderId}/status`, { method: 'PUT', body: { status } });
        if (response?.data) return response.data;
        throw new Error(response?.message || 'Failed to update order');
    } catch (error) {
        throw error;
    }
}

// ============================================
// REVIEW ENDPOINTS
// ============================================

async function getProductReviews(productId) {
    try {
        const response = await apiCall(`/reviews/product/${productId}`);
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response))       return response;
        return [];
    } catch (error) {
        return [];
    }
}

async function createReview(productId, rating, comment) {
    try {
        const response = await apiCall('/reviews', { method: 'POST', body: { productId, rating, comment } });
        if (response?.data) return response.data;
        throw new Error(response?.message || 'Failed to create review');
    } catch (error) {
        throw error;
    }
}

// ============================================
// WISHLIST ENDPOINTS
// ============================================

async function getWishlist() {
    try {
        const response = await apiCall('/wishlist');
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response))       return response;
        return [];
    } catch (error) {
        return [];
    }
}

async function addToWishlist(productId) {
    try {
        const response = await apiCall('/wishlist', { method: 'POST', body: { productId } });
        return response?.data || { success: true };
    } catch (error) {
        throw error;
    }
}

async function removeFromWishlist(productId) {
    try {
        await apiCall(`/wishlist/${productId}`, { method: 'DELETE' });
        return true;
    } catch (error) {
        throw error;
    }
}

// ============================================
// ADMIN ENDPOINTS
// ============================================

async function getAdminUsers() {
    try {
        const response = await apiCall('/admin/users');
        if (response?.data && Array.isArray(response.data)) return response.data;
        return [];
    } catch (error) {
        return [];
    }
}

async function deleteAdminUser(userId) {
    try {
        const response = await apiCall(`/admin/users/${userId}`, { method: 'DELETE' });
        if (response?.success) return true;
        throw new Error(response?.message || 'Failed to delete user');
    } catch (error) {
        throw error;
    }
}

async function getAdminProducts() {
    try {
        const response = await apiCall('/admin/products');
        if (response?.data && Array.isArray(response.data)) return response.data;
        return [];
    } catch (error) {
        return [];
    }
}

async function deleteAdminProduct(productId) {
    try {
        const response = await apiCall(`/admin/products/${productId}`, { method: 'DELETE' });
        if (response?.success) return true;
        throw new Error(response?.message || 'Failed to delete product');
    } catch (error) {
        throw error;
    }
}

async function getAdminOrders() {
    try {
        const response = await apiCall('/admin/orders');
        if (response?.data && Array.isArray(response.data)) return response.data;
        return [];
    } catch (error) {
        return [];
    }
}

async function getAdminAnalytics() {
    try {
        const response = await apiCall('/admin/analytics');
        return response?.data || {};
    } catch (error) {
        return {};
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className   = `toast show ${type}`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}

function isLoggedIn() {
    return !!getAuthToken();
}

function logout() {
    clearAuthToken();
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    window.location.href = 'login.html';
}

function redirectIfNotLoggedIn() {
    if (!isLoggedIn()) window.location.href = 'login.html';
}
