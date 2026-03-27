(function () {
    'use strict';

    // ========================================
    // THEME TOGGLE
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('ww-theme', next);
        });
    }

    // ========================================
    // DASHBOARD ROUTE GUARD + SESSION
    // ========================================
    const guard = document.getElementById('dashboardGuard');
    const content = document.getElementById('dashboardContent');
    const authUserEmail = document.getElementById('authUserEmail');
    const authUserPanel = document.getElementById('authUserPanel');
    const dashboardUserName = document.getElementById('dashboardUserName');
    const dashboardEmail = document.getElementById('dashboardEmail');
    const dashboardCreatedAt = document.getElementById('dashboardCreatedAt');

    const authConfig = window.WW_AUTH_CONFIG || {};
    const hasUrl = !!authConfig.supabaseUrl && authConfig.supabaseUrl.indexOf('YOUR_PROJECT_ID') === -1;
    const hasKey = !!authConfig.supabaseAnonKey && authConfig.supabaseAnonKey.indexOf('YOUR_SUPABASE_ANON_KEY') === -1;
    const hasClient = !!(window.supabase && window.supabase.createClient);

    if (!hasUrl || !hasKey || !hasClient) {
        if (guard) guard.classList.add('is-visible');
        return;
    }

    const supabaseClient = window.supabase.createClient(authConfig.supabaseUrl, authConfig.supabaseAnonKey);

    function showDashboard(user) {
        if (guard) guard.classList.remove('is-visible');
        if (content) content.hidden = false;
        if (authUserPanel) authUserPanel.hidden = false;

        const email = user.email || '';
        const name = (user.user_metadata && user.user_metadata.full_name)
            ? user.user_metadata.full_name.split(' ')[0]
            : email.split('@')[0];
        const createdAt = user.created_at
            ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
            : '—';

        if (authUserEmail) authUserEmail.textContent = email;
        if (dashboardUserName) dashboardUserName.textContent = name;
        if (dashboardEmail) dashboardEmail.textContent = email;
        if (dashboardCreatedAt) dashboardCreatedAt.textContent = createdAt;
    }

    function showGuard() {
        if (guard) guard.classList.add('is-visible');
        if (content) content.hidden = true;
        if (authUserPanel) authUserPanel.hidden = true;
    }

    // Check session on load
    supabaseClient.auth.getSession().then(function (result) {
        const session = result && result.data ? result.data.session : null;
        if (session && session.user) {
            showDashboard(session.user);
        } else {
            showGuard();
        }
    });

    // React to auth state changes
    supabaseClient.auth.onAuthStateChange(function (_event, session) {
        if (session && session.user) {
            showDashboard(session.user);
        } else {
            showGuard();
        }
    });

}());
