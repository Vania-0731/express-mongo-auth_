const auth = {
    async apiFetch(url, options = {}) {
        const token = guard.getToken();
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };
        if (token && !guard.isTokenExpired(token)) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
        const headers = {
            ...defaultHeaders,
            ...options.headers
        };
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            if (response.status === 401) {
                auth.logout();
                return null;
            }
            return response;
        } catch (error) {
            console.error('Error en petición API:', error);
            throw error;
        }
    },

    async handleSignIn(email, password) {
        try {
            this.showLoading('Iniciando sesión...');
            const response = await fetch('/api/auth/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('token', data.token);
                this.showMessage('¡Bienvenido!', 'success');
                setTimeout(() => {
                    guard.redirectByRole();
                }, 1000);
            } else {
                this.showMessage(data.message || 'Error al iniciar sesión', 'error');
            }
        } catch (error) {
            console.error('Error en login:', error);
            this.showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
        } finally {
            this.hideLoading();
        }
    },

    async handleSignUp(userData) {
        try {
            this.showLoading('Creando cuenta...');
            const response = await fetch('/api/auth/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (response.ok) {
                this.showMessage('¡Cuenta creada exitosamente! Redirigiendo al login...', 'success');
                setTimeout(() => {
                    window.location.href = '/signIn';
                }, 2000);
            } else {
                this.showMessage(data.message || 'Error al crear la cuenta', 'error');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            this.showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
        } finally {
            this.hideLoading();
        }
    },

    logout() {
        sessionStorage.removeItem('token');
        this.showMessage('Sesión cerrada correctamente', 'info');
        setTimeout(() => {
            window.location.href = '/signIn';
        }, 1000);
    },

    async getCurrentUser() {
        try {
            const response = await this.apiFetch('/api/users/me');
            if (response && response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo usuario actual:', error);
            return null;
        }
    },

    async updateCurrentUser(userData) {
        try {
            const response = await this.apiFetch('/api/users/me', {
                method: 'PUT',
                body: JSON.stringify(userData)
            });
            if (response && response.ok) {
                this.showMessage('Perfil actualizado correctamente', 'success');
                return true;
            } else {
                const data = await response.json();
                this.showMessage(data.message || 'Error al actualizar el perfil', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            this.showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
            return false;
        }
    },

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert ${type}`;
        messageDiv.textContent = message;
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 5000);
        }
    },

    showLoading(message = 'Cargando...') {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="spinner-container">
                <div class="preloader-wrapper active">
                    <div class="spinner-layer spinner-blue-only">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div>
                        <div class="gap-patch">
                            <div class="circle"></div>
                        </div>
                        <div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>
                </div>
                <p style="margin-top: 20px;">${message}</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    },

    hideLoading() {
        const loadingDiv = document.getElementById('loading-overlay');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    },

    validateSignUpForm(formData) {
        const errors = [];
        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }
        if (!formData.lastName || formData.lastName.trim().length < 2) {
            errors.push('El apellido debe tener al menos 2 caracteres');
        }
        if (!formData.email) {
            errors.push('El email es requerido');
        }
        if (!formData.password || formData.password.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres');
        }
        if (!formData.phoneNumber || formData.phoneNumber.trim().length < 9) {
            errors.push('Ingresa un número de teléfono válido');
        }
        if (!formData.birthdate) {
            errors.push('La fecha de nacimiento es requerida');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    validateSignInForm(formData) {
        const errors = [];
        if (!formData.email) {
            errors.push('El email es requerido');
        }
        if (!formData.password) {
            errors.push('La contraseña es requerida');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

window.auth = auth;

