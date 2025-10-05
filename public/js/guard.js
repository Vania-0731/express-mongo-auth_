const guard = {
    getToken() {
        return sessionStorage.getItem('token');
    },

    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
    },

    isTokenExpired(token) {
        if (!token) return true;
        const payload = this.parseJwt(token);
        if (!payload || !payload.exp) return true;
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    },

    hasRole(role, token = null) {
        const currentToken = token || this.getToken();
        if (!currentToken) return false;
        const payload = this.parseJwt(currentToken);
        if (!payload || !payload.roles) return false;
        return payload.roles.includes(role);
    },

    hasAnyRole(roles, token = null) {
        const currentToken = token || this.getToken();
        if (!currentToken) return false;
        const payload = this.parseJwt(currentToken);
        if (!payload || !payload.roles) return false;
        return roles.some(role => payload.roles.includes(role));
    },

    checkAuth(requiredRoles = []) {
        const token = this.getToken();
        if (!token) {
            this.redirectToLogin();
            return false;
        }
        if (this.isTokenExpired(token)) {
            this.logout();
            return false;
        }
        if (requiredRoles.length > 0) {
            if (!this.hasAnyRole(requiredRoles, token)) {
                this.redirectTo403();
                return false;
            }
        }
        return true;
    },

    redirectToLogin() {
        window.location.href = '/signIn';
    },

    redirectTo403() {
        window.location.href = '/403';
    },

    logout() {
        sessionStorage.removeItem('token');
        this.redirectToLogin();
    },

    getUserInfo() {
        const token = this.getToken();
        if (!token || this.isTokenExpired(token)) {
            return null;
        }
        return this.parseJwt(token);
    },

    redirectByRole() {
        const userInfo = this.getUserInfo();
        if (!userInfo) {
            this.redirectToLogin();
            return;
        }
        if (userInfo.roles && userInfo.roles.includes('admin')) {
            window.location.href = '/admin';
        } else {
            window.location.href = '/dashboard';
        }
    },

    updateNavigation() {
        const token = this.getToken();
        const isAuthenticated = token && !this.isTokenExpired(token);
        const guestElements = [
            'nav-signin', 'nav-signup',
            'mobile-nav-signin', 'mobile-nav-signup'
        ];
        const authElements = [
            'nav-profile', 'nav-dashboard', 'nav-logout',
            'mobile-nav-profile', 'mobile-nav-dashboard', 'mobile-nav-logout'
        ];
        const adminElements = [
            'nav-admin', 'mobile-nav-admin'
        ];
        if (isAuthenticated) {
            guestElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = 'none';
            });
            authElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = 'block';
            });
            if (this.hasRole('admin')) {
                adminElements.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) element.style.display = 'block';
                });
            }
        } else {
            authElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = 'none';
            });
            adminElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = 'none';
            });
            guestElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = 'block';
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    guard.updateNavigation();
});

window.guard = guard;

