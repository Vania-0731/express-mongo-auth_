const admin = {
    async getAllUsers() {
        try {
            const response = await auth.apiFetch('/api/users');
            if (response && response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            auth.showMessage('Error al cargar la lista de usuarios', 'error');
            return null;
        }
    },
    async getUserById(userId) {
        try {
            const response = await auth.apiFetch(`/api/users/${userId}`);
            if (response && response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            auth.showMessage('Error al cargar los datos del usuario', 'error');
            return null;
        }
    },

    renderUsersTable(users) {
        const tableContainer = document.getElementById('users-table-container');
        if (!tableContainer) return;

        if (!users || users.length === 0) {
            tableContainer.innerHTML = `
                <div class="card">
                    <div class="card-content center-align">
                        <p>No hay usuarios registrados</p>
                    </div>
                </div>
            `;
            return;
        }

        const tableHTML = `
            <div class="card">
                <div class="card-content">
                    <h5>Usuarios Registrados</h5>
                    <div class="table-container">
                        <table class="striped responsive-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Edad</th>
                                    <th>Teléfono</th>
                                    <th>Roles</th>
                                    <th>Fecha Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(user => `
                                    <tr>
                                        <td>${user.name} ${user.lastName}</td>
                                        <td>${user.email}</td>
                                        <td>${user.ageText || 'N/A'}</td>
                                        <td>${user.phoneNumber || 'N/A'}</td>
                                        <td>
                                            ${user.roles ? user.roles.map(role => 
                                                `<span class="chip">${role}</span>`
                                            ).join(' ') : 'N/A'}
                                        </td>
                                        <td>${user.createdAtShort || 'N/A'}</td>
                                        <td>
                                            <button class="btn-small blue" onclick="admin.viewUserDetails('${user._id}')">
                                                <i class="material-icons">visibility</i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        tableContainer.innerHTML = tableHTML;
    },

    async viewUserDetails(userId) {
        try {
            auth.showLoading('Cargando detalles del usuario...');
            const user = await this.getUserById(userId);
            if (user) {
                this.showUserModal(user);
            } else {
                auth.showMessage('No se pudieron cargar los detalles del usuario', 'error');
            }
        } catch (error) {
            console.error('Error mostrando detalles del usuario:', error);
            auth.showMessage('Error al cargar los detalles del usuario', 'error');
        } finally {
            auth.hideLoading();
        }
    },
    showUserModal(user) {
        const modalHTML = `
            <div id="user-modal" class="modal">
                <div class="modal-content">
                    <h4>Detalles del Usuario</h4>
                    <div class="row">
                        <div class="col s12 m6">
                            <p><strong>Nombre:</strong> ${user.name} ${user.lastName}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Edad:</strong> ${user.ageText || 'N/A'}</p>
                            <p><strong>Teléfono:</strong> ${user.phoneNumber || 'N/A'}</p>
                            <p><strong>Fecha de Nacimiento:</strong> ${user.birthdateFormatted || 'N/A'}</p>
                        </div>
                        <div class="col s12 m6">
                            <p><strong>Roles:</strong></p>
                            <div>
                                ${user.roles ? user.roles.map(role => 
                                    `<span class="chip">${role}</span>`
                                ).join(' ') : 'N/A'}
                            </div>
                            <p><strong>Fecha de Registro:</strong> ${user.createdAtFormatted || 'N/A'}</p>
                            <p><strong>Última Actualización:</strong> ${user.updatedAtFormatted || 'N/A'}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close btn blue">Cerrar</a>
                </div>
            </div>
        `;
        const existingModal = document.getElementById('user-modal');
        if (existingModal) {
            existingModal.remove();
        }
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('user-modal');
        const instance = M.Modal.init(modal);
        instance.open();
    },
    renderAdminStats(users) {
        const statsContainer = document.getElementById('admin-stats');
        if (!statsContainer) return;

        const totalUsers = users ? users.length : 0;
        const adminUsers = users ? users.filter(user => 
            user.roles && user.roles.includes('admin')
        ).length : 0;
        const regularUsers = totalUsers - adminUsers;
        const statsHTML = `
            <div class="row">
                <div class="col s12 m4">
                    <div class="card stats-card blue">
                        <div class="card-content white-text">
                            <span class="stats-number">${totalUsers}</span>
                            <p class="stats-label">Total Usuarios</p>
                        </div>
                    </div>
                </div>
                <div class="col s12 m4">
                    <div class="card stats-card green">
                        <div class="card-content white-text">
                            <span class="stats-number">${adminUsers}</span>
                            <p class="stats-label">Administradores</p>
                        </div>
                    </div>
                </div>
                <div class="col s12 m4">
                    <div class="card stats-card orange">
                        <div class="card-content white-text">
                            <span class="stats-number">${regularUsers}</span>
                            <p class="stats-label">Usuarios Regulares</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        statsContainer.innerHTML = statsHTML;
    },

    async initAdminDashboard() {
        try {
            if (!guard.hasRole('admin')) {
                guard.redirectTo403();
                return;
            }
            auth.showLoading('Cargando dashboard...');
            const users = await this.getAllUsers();
            if (users) {
                this.renderAdminStats(users);
                this.renderUsersTable(users);
            } else {
                auth.showMessage('Error al cargar los datos del dashboard', 'error');
            }
        } catch (error) {
            console.error('Error inicializando dashboard admin:', error);
            auth.showMessage('Error al cargar el dashboard', 'error');
        } finally {
            auth.hideLoading();
        }
    }
};
window.admin = admin;
