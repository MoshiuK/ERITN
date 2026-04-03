// Infrastructure Monitoring Dashboard
// Simulated data for all dashboard sections

$(document).ready(function () {

    // ===== TAB NAVIGATION =====
    $('.sidebar .nav-link').on('click', function (e) {
        e.preventDefault();
        $('.sidebar .nav-link').removeClass('active');
        $(this).addClass('active');
        var tab = $(this).data('tab');
        $('.tab-panel').removeClass('active');
        $('#tab-' + tab).addClass('active');
    });

    // ===== SIMULATED DATA =====
    var services = [
        { name: 'AccessManagement.Web', status: 'running', cpu: 38, ram: 512, port: 443, version: '5.3.1', uptime: '14d 6h' },
        { name: 'AccessManagement.API', status: 'running', cpu: 25, ram: 384, port: 8443, version: '5.3.1', uptime: '14d 6h' },
        { name: 'IdentityServer (B2C)', status: 'running', cpu: 12, ram: 256, port: 5001, version: '4.2.0', uptime: '30d 2h' },
        { name: 'WebJob Scheduler', status: 'running', cpu: 8, ram: 128, port: '-', version: '2.1.4', uptime: '7d 18h' },
        { name: 'Redis Cache', status: 'running', cpu: 5, ram: 1024, port: 6380, version: '7.2.4', uptime: '45d 12h' },
        { name: 'Azure SQL', status: 'running', cpu: 42, ram: 2048, port: 1433, version: '12.0', uptime: '90d 0h' },
        { name: 'Blob Storage', status: 'warning', cpu: 3, ram: 64, port: 443, version: '-', uptime: '90d 0h' },
        { name: 'App Insights Collector', status: 'running', cpu: 15, ram: 192, port: 8888, version: '3.4.1', uptime: '21d 3h' }
    ];

    var websites = [
        { url: 'truentry.net', latency: 42, uptime: 99.98, sslDays: 247, dns: 'Azure DNS', proto: 'HTTP/2', status: 'healthy' },
        { url: 'eritn.truentry.net', latency: 38, uptime: 99.97, sslDays: 247, dns: 'Azure DNS', proto: 'HTTP/2', status: 'healthy' },
        { url: 'api.truentry.net', latency: 156, uptime: 99.42, sslDays: 18, dns: 'Azure DNS', proto: 'HTTP/2', status: 'degraded' },
        { url: 'portal.truentry.net', latency: 51, uptime: 99.95, sslDays: 247, dns: 'Azure DNS', proto: 'HTTP/3', status: 'healthy' },
        { url: 'admin.truentry.net', latency: 45, uptime: 99.99, sslDays: 5, dns: 'Cloudflare', proto: 'HTTP/2', status: 'healthy' }
    ];

    var proposals = [
        {
            id: 1, title: 'Optimize SQL query for credential lookups',
            agent: 'perf-optimizer', risk: 'low', status: 'deployed',
            rationale: 'Identified N+1 query pattern in credential search endpoint causing avg 800ms response time. Proposed index addition and query restructure reduces to ~120ms.',
            files: ['Areas/Access/Views/Search/Index.cshtml', 'Scripts/pages/access.search.index.js'],
            rollback: 'Remove index IX_Credential_LookupOptimized and revert query changes.',
            approvals: [{ name: 'Admin A', state: 'approved' }, { name: 'Admin B', state: 'approved' }]
        },
        {
            id: 2, title: 'Update Bootstrap from 5.2 to 5.3.2',
            agent: 'dependency-updater', risk: 'medium', status: 'rejected',
            rationale: 'Bootstrap 5.3.2 includes critical XSS fix in tooltip component (CVE-2024-XXXX). Upgrade includes minor breaking changes in color utility classes.',
            files: ['Content/bootstrap.css', 'Content/bootstrap.min.css', 'Scripts/bootstrap.bundle.js', 'Scripts/bootstrap.bundle.min.js'],
            rollback: 'Restore previous Bootstrap 5.2 files from artifact storage.',
            approvals: [{ name: 'Admin A', state: 'approved' }, { name: 'Dev B', state: 'rejected' }]
        },
        {
            id: 3, title: 'Add Redis connection pooling',
            agent: 'infra-optimizer', risk: 'medium', status: 'pending',
            rationale: 'Current Redis client creates new connections per request. Connection pooling would reduce connection overhead by ~60% and improve p99 latency.',
            files: ['Web.config', 'diagnostics.config'],
            rollback: 'Revert Web.config Redis connection string to non-pooled format.',
            approvals: [{ name: 'Admin A', state: 'approved' }, { name: '', state: 'pending' }]
        },
        {
            id: 4, title: 'Enable HTTP/3 on all endpoints',
            agent: 'network-optimizer', risk: 'high', status: 'pending',
            rationale: 'HTTP/3 with QUIC would reduce connection setup latency by 30-40% for mobile users. Currently only portal.truentry.net uses HTTP/3.',
            files: ['Web.config', 'Properties/launchSettings.json'],
            rollback: 'Disable QUIC listener and revert to HTTP/2-only configuration.',
            approvals: [{ name: '', state: 'pending' }, { name: '', state: 'pending' }]
        },
        {
            id: 5, title: 'Compress static asset responses with Brotli',
            agent: 'perf-optimizer', risk: 'low', status: 'pending',
            rationale: 'Switching from gzip to Brotli for static assets would reduce transfer size by additional 15-20%. All modern browsers support Brotli.',
            files: ['Web.config'],
            rollback: 'Remove Brotli compression module and revert to gzip-only.',
            approvals: [{ name: '', state: 'pending' }, { name: '', state: 'pending' }]
        }
    ];

    var auditEntries = [
        { time: '2026-04-03 14:32:15', actor: 'ai', actorName: 'perf-optimizer', action: 'proposal_created', target: 'Brotli compression', details: 'Created proposal #5 for static asset compression' },
        { time: '2026-04-03 14:18:02', actor: 'human', actorName: 'admin@truentry.net', action: 'approved', target: 'Redis pooling (#3)', details: 'First approval vote cast' },
        { time: '2026-04-03 13:55:41', actor: 'system', actorName: 'Health Monitor', action: 'health_alert', target: 'api.truentry.net', details: 'Latency exceeded 150ms threshold' },
        { time: '2026-04-03 13:42:30', actor: 'ai', actorName: 'network-optimizer', action: 'proposal_created', target: 'HTTP/3 enablement', details: 'Created proposal #4 for HTTP/3 migration' },
        { time: '2026-04-03 12:30:18', actor: 'human', actorName: 'dev@truentry.net', action: 'rejected', target: 'Bootstrap upgrade (#2)', details: 'Breaking color utility changes affect 12 views' },
        { time: '2026-04-03 12:15:05', actor: 'human', actorName: 'admin@truentry.net', action: 'approved', target: 'Bootstrap upgrade (#2)', details: 'Security fix warranted, approved' },
        { time: '2026-04-03 11:48:33', actor: 'ai', actorName: 'dependency-updater', action: 'proposal_created', target: 'Bootstrap 5.3.2', details: 'Created proposal #2 for Bootstrap upgrade' },
        { time: '2026-04-03 10:20:11', actor: 'system', actorName: 'Deployment Engine', action: 'deployed', target: 'SQL optimization (#1)', details: 'Proposal #1 deployed successfully after 2 approvals' },
        { time: '2026-04-03 10:15:44', actor: 'human', actorName: 'dev@truentry.net', action: 'approved', target: 'SQL optimization (#1)', details: 'Second approval vote - deployment authorized' },
        { time: '2026-04-03 09:58:22', actor: 'human', actorName: 'admin@truentry.net', action: 'approved', target: 'SQL optimization (#1)', details: 'First approval vote cast' },
        { time: '2026-04-03 09:30:07', actor: 'ai', actorName: 'perf-optimizer', action: 'proposal_created', target: 'SQL query optimization', details: 'Created proposal #1 for credential lookup optimization' },
        { time: '2026-04-03 08:45:19', actor: 'system', actorName: 'Cert Monitor', action: 'health_alert', target: 'admin.truentry.net', details: 'SSL certificate expires in 5 days' },
        { time: '2026-04-03 08:00:00', actor: 'system', actorName: 'Scheduler', action: 'service_restarted', target: 'WebJob Scheduler', details: 'Scheduled weekly restart completed' },
        { time: '2026-04-02 22:15:33', actor: 'system', actorName: 'Key Vault', action: 'secret_rotated', target: 'Redis Password', details: 'Automatic 90-day rotation completed' },
        { time: '2026-04-02 20:30:45', actor: 'human', actorName: 'admin@truentry.net', action: 'rbac_changed', target: 'Developer role', details: 'Added staging deployment permission' },
        { time: '2026-04-02 18:12:08', actor: 'system', actorName: 'Health Monitor', action: 'health_alert', target: 'Blob Storage', details: 'Throttling detected on hot tier' },
        { time: '2026-04-02 16:45:22', actor: 'ai', actorName: 'infra-optimizer', action: 'proposal_created', target: 'Redis connection pooling', details: 'Created proposal #3 for connection optimization' },
        { time: '2026-04-02 14:30:11', actor: 'system', actorName: 'Deployment Engine', action: 'rolled_back', target: 'Cache config v2.1', details: 'Auto-rollback triggered by error rate spike' },
        { time: '2026-04-02 14:25:00', actor: 'system', actorName: 'Health Monitor', action: 'health_alert', target: 'Redis Cache', details: 'Error rate exceeded 5% threshold after deployment' },
        { time: '2026-04-02 12:00:33', actor: 'human', actorName: 'admin@truentry.net', action: 'approved', target: 'Cache config v2.1', details: 'Second approval vote - deployment authorized' },
        { time: '2026-04-02 11:45:18', actor: 'human', actorName: 'dev@truentry.net', action: 'approved', target: 'Cache config v2.1', details: 'First approval vote cast' },
        { time: '2026-04-02 10:30:00', actor: 'ai', actorName: 'infra-optimizer', action: 'proposal_created', target: 'Cache config v2.1', details: 'Created proposal for Redis cache optimization' },
        { time: '2026-04-02 09:15:42', actor: 'system', actorName: 'Cert Monitor', action: 'health_alert', target: 'api.truentry.net', details: 'SSL certificate expires in 18 days' },
        { time: '2026-04-02 08:00:00', actor: 'system', actorName: 'Scheduler', action: 'service_restarted', target: 'App Insights Collector', details: 'Memory threshold restart (>90% utilization)' },
        { time: '2026-04-01 23:30:15', actor: 'system', actorName: 'Key Vault', action: 'secret_rotated', target: 'App Insights Key', details: 'Automatic 90-day rotation completed' },
        { time: '2026-04-01 20:45:08', actor: 'human', actorName: 'admin@truentry.net', action: 'rbac_changed', target: 'AI Agent role', details: 'Restricted proposal scope to non-infrastructure changes' },
        { time: '2026-04-01 18:20:33', actor: 'ai', actorName: 'perf-optimizer', action: 'proposal_created', target: 'Image lazy loading', details: 'Proposed defer loading for storefront product images' },
        { time: '2026-04-01 15:10:22', actor: 'human', actorName: 'dev@truentry.net', action: 'approved', target: 'Image lazy loading', details: 'Approved - minimal risk change' },
        { time: '2026-04-01 14:00:00', actor: 'human', actorName: 'admin@truentry.net', action: 'approved', target: 'Image lazy loading', details: 'Second approval - deployment authorized' },
        { time: '2026-04-01 13:45:11', actor: 'system', actorName: 'Deployment Engine', action: 'deployed', target: 'Image lazy loading', details: 'Successfully deployed to production' }
    ];

    var rbacPermissions = [
        { perm: 'View dashboards', admin: 'yes', ai: 'yes', dev: 'yes' },
        { perm: 'Deploy to production', admin: 'yes', ai: 'no', dev: 'limited' },
        { perm: 'Approve AI proposals', admin: 'yes', ai: 'no', dev: 'yes' },
        { perm: 'Access raw secrets', admin: 'yes', ai: 'no', dev: 'no' },
        { perm: 'Modify RBAC roles', admin: 'yes', ai: 'no', dev: 'no' },
        { perm: 'Restart services', admin: 'yes', ai: 'limited', dev: 'limited' },
        { perm: 'View audit logs', admin: 'yes', ai: 'limited', dev: 'yes' },
        { perm: 'Create proposals', admin: 'yes', ai: 'yes', dev: 'yes' },
        { perm: 'Rollback deployments', admin: 'yes', ai: 'no', dev: 'limited' },
        { perm: 'Modify infrastructure', admin: 'yes', ai: 'no', dev: 'no' }
    ];

    var secrets = [
        { name: 'DB Connection String', scope: 'Production', masked: '****\u2026\u20263kF9', rotated: '2026-03-15', next: '2026-06-13' },
        { name: 'B2C Client Secret', scope: 'Authentication', masked: '****\u2026\u2026xR2m', rotated: '2026-03-01', next: '2026-05-30' },
        { name: 'Redis Password', scope: 'Cache Layer', masked: '****\u2026\u20267pLq', rotated: '2026-04-02', next: '2026-07-01' },
        { name: 'Storage Account Key', scope: 'Blob Storage', masked: '****\u2026\u2026nW4e', rotated: '2026-02-20', next: '2026-05-21' },
        { name: 'SendGrid API Key', scope: 'Email Service', masked: '****\u2026\u2026bK8j', rotated: '2026-03-10', next: '2026-06-08' },
        { name: 'App Insights Key', scope: 'Telemetry', masked: '****\u2026\u2026mT5v', rotated: '2026-04-01', next: '2026-06-30' }
    ];

    // ===== HELPER FUNCTIONS =====
    function randBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateSparkData(base, variance, count) {
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push(Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance * 2)));
        }
        return data;
    }

    function createSparkline(canvasId, data, color) {
        var ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        return new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: data.map(function (_, i) { return ''; }),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { display: false },
                    y: { display: false, min: 0, max: 100 }
                },
                animation: { duration: 500 }
            }
        });
    }

    function setGauge(selector, pct) {
        var offset = 314 - (314 * pct / 100);
        $(selector).css('stroke-dashoffset', offset);
    }

    function formatPermCell(val) {
        if (val === 'yes') return '<span class="perm-yes"><i class="fa fa-check"></i> Yes</span>';
        if (val === 'no') return '<span class="perm-no"><i class="fa fa-times"></i> No</span>';
        return '<span class="perm-limited"><i class="fa fa-minus-circle"></i> ' + val.charAt(0).toUpperCase() + val.slice(1) + '</span>';
    }

    function generateLogLines(serviceName) {
        var levels = ['INFO', 'INFO', 'INFO', 'DEBUG', 'INFO', 'WARN', 'INFO', 'INFO', 'DEBUG', 'ERROR'];
        var messages = {
            'INFO': [
                'Request processed successfully in {ms}ms',
                'Connection pool: {n} active, {m} idle',
                'Cache hit ratio: {pct}%',
                'Health check passed',
                'Tenant context resolved: eritn',
                'Session validated for user principal',
                'Static asset served from CDN cache',
                'Background task completed: membership sync'
            ],
            'WARN': [
                'Slow query detected: {ms}ms (threshold: 500ms)',
                'Connection pool nearing capacity: {pct}% utilized',
                'Retry attempt 2/3 for external service call',
                'Memory pressure detected, GC triggered'
            ],
            'ERROR': [
                'Timeout connecting to downstream service after 30s',
                'Unhandled exception in credential validation pipeline',
                'Circuit breaker opened for payment gateway'
            ],
            'DEBUG': [
                'Autofac resolving ITenantContext for request scope',
                'Entity Framework query plan cached',
                'OWIN middleware pipeline: authentication stage complete',
                'View engine searching: ~/Areas/Access/Views/Search/Index.cshtml'
            ]
        };
        var lines = [];
        var baseTime = new Date(2026, 3, 3, 14, 30, 0);
        for (var i = 0; i < 25; i++) {
            var level = levels[randBetween(0, levels.length - 1)];
            var msgs = messages[level];
            var msg = msgs[randBetween(0, msgs.length - 1)];
            msg = msg.replace('{ms}', randBetween(12, 950))
                     .replace('{n}', randBetween(3, 15))
                     .replace('{m}', randBetween(1, 8))
                     .replace('{pct}', randBetween(60, 98));
            var t = new Date(baseTime.getTime() + i * randBetween(500, 5000));
            var ts = t.toTimeString().split(' ')[0] + '.' + String(t.getMilliseconds()).padStart(3, '0');
            lines.push('<div><span class="log-time">' + ts + '</span> <span class="log-' + level.toLowerCase() + '">[' + level + ']</span> ' + serviceName + ': ' + msg + '</div>');
        }
        return lines.join('');
    }

    // ===== RENDER OVERVIEW =====
    function renderOverview() {
        var cpuVal = 42, memVal = 67, diskVal = 35, netVal = 23;

        setGauge('.gauge-cpu', cpuVal);
        setGauge('.gauge-mem', memVal);
        setGauge('.gauge-disk', diskVal);
        setGauge('.gauge-net', netVal);
        $('#gauge-cpu-val').text(cpuVal + '%');
        $('#gauge-mem-val').text(memVal + '%');
        $('#gauge-disk-val').text(diskVal + '%');
        $('#gauge-net-val').text(netVal + '%');

        // Sparklines
        createSparkline('spark-cpu', generateSparkData(cpuVal, 15, 20), 'rgb(13, 110, 253)');
        createSparkline('spark-mem', generateSparkData(memVal, 10, 20), 'rgb(111, 66, 193)');
        createSparkline('spark-disk', generateSparkData(diskVal, 12, 20), 'rgb(253, 126, 20)');
        createSparkline('spark-net', generateSparkData(netVal, 8, 20), 'rgb(32, 201, 151)');

        // Top services
        var sorted = services.slice().sort(function (a, b) { return b.cpu - a.cpu; });
        var html = '';
        for (var i = 0; i < 5; i++) {
            var s = sorted[i];
            var badge = s.status === 'running' ? 'bg-success' : s.status === 'warning' ? 'bg-warning' : 'bg-danger';
            html += '<tr><td>' + s.name.split('(')[0].trim() + '</td><td>' + s.cpu + '%</td><td><span class="badge ' + badge + '">' + s.status + '</span></td></tr>';
        }
        $('#top-services-body').html(html);

        // Pending proposals
        var pending = proposals.filter(function (p) { return p.status === 'pending'; });
        html = '';
        pending.forEach(function (p) {
            var riskBadge = p.risk === 'low' ? 'bg-success' : p.risk === 'medium' ? 'bg-warning text-dark' : 'bg-danger';
            html += '<div class="list-group-item d-flex justify-content-between align-items-center py-2">';
            html += '<div><small class="fw-bold">' + p.title + '</small><br><small class="text-muted">by ' + p.agent + '</small></div>';
            html += '<span class="badge ' + riskBadge + '">' + p.risk + '</span></div>';
        });
        $('#pending-proposals').html(html);

        // Recent activity
        html = '';
        var recentActivities = [
            { icon: 'fa-magic', text: 'AI proposal created: Brotli compression', time: '2 min ago' },
            { icon: 'fa-check-circle', text: 'admin@truentry.net approved Redis pooling', time: '16 min ago' },
            { icon: 'fa-exclamation-triangle', text: 'Latency alert on api.truentry.net', time: '37 min ago' },
            { icon: 'fa-magic', text: 'AI proposal created: HTTP/3 enablement', time: '50 min ago' },
            { icon: 'fa-times-circle', text: 'dev@truentry.net rejected Bootstrap upgrade', time: '2h ago' },
            { icon: 'fa-check-circle', text: 'admin@truentry.net approved Bootstrap upgrade', time: '2h ago' },
            { icon: 'fa-rocket', text: 'SQL optimization deployed successfully', time: '4h ago' },
            { icon: 'fa-shield', text: 'SSL cert warning: admin.truentry.net (5d)', time: '6h ago' }
        ];
        recentActivities.forEach(function (a) {
            html += '<div class="activity-item"><i class="fa ' + a.icon + ' text-muted me-2"></i>' + a.text;
            html += '<div class="activity-time">' + a.time + '</div></div>';
        });
        $('#recent-activity').html(html);
    }

    // ===== RENDER SERVICES =====
    function renderServices() {
        var html = '';
        services.forEach(function (s, idx) {
            var statusClass = s.status === 'running' ? 'status-running' : s.status === 'warning' ? 'status-warning' : 'status-stopped';
            var statusBadge = s.status === 'running' ? 'bg-success' : s.status === 'warning' ? 'bg-warning text-dark' : 'bg-danger';
            html += '<div class="col-md-3">';
            html += '<div class="card service-card" data-idx="' + idx + '">';
            html += '<div class="card-body">';
            html += '<div class="d-flex justify-content-between align-items-start mb-2">';
            html += '<h6 class="mb-0" style="font-size:0.85rem">' + s.name + '</h6>';
            html += '<span class="badge ' + statusBadge + '">' + s.status + '</span>';
            html += '</div>';
            html += '<div class="row g-1 mt-2">';
            html += '<div class="col-6 service-metric">CPU <span>' + s.cpu + '%</span></div>';
            html += '<div class="col-6 service-metric">RAM <span>' + s.ram + ' MB</span></div>';
            html += '<div class="col-6 service-metric">Port <span>' + s.port + '</span></div>';
            html += '<div class="col-6 service-metric">Ver <span>' + s.version + '</span></div>';
            html += '</div>';
            html += '<div class="mt-2 service-metric">Uptime <span>' + s.uptime + '</span></div>';
            html += '</div></div></div>';
        });
        $('#services-grid').html(html);

        // Click handler for detail modal
        $('.service-card').on('click', function () {
            var idx = $(this).data('idx');
            var s = services[idx];
            var statusBadge = s.status === 'running' ? '<span class="badge bg-success">running</span>' : '<span class="badge bg-warning">warning</span>';
            $('#serviceModalTitle').text(s.name);
            $('#modal-status').html(statusBadge);
            $('#modal-cpu').text(s.cpu + '%');
            $('#modal-ram').text(s.ram + ' MB');
            $('#modal-uptime').text(s.uptime);
            $('#modal-logs').html(generateLogLines(s.name));
            var modal = new bootstrap.Modal(document.getElementById('serviceModal'));
            modal.show();
        });
    }

    // ===== RENDER WEBSITES =====
    function renderWebsites() {
        var html = '';
        websites.forEach(function (w, idx) {
            var cardClass = w.status === 'degraded' ? 'degraded' : w.status === 'down' ? 'down' : '';
            var uptimeColor = w.uptime >= 99.9 ? '#198754' : w.uptime >= 99 ? '#ffc107' : '#dc3545';
            var sslClass, sslLabel;
            if (w.sslDays > 30) { sslClass = 'ssl-valid'; sslLabel = w.sslDays + ' days'; }
            else if (w.sslDays > 7) { sslClass = 'ssl-expiring'; sslLabel = w.sslDays + ' days - Expiring Soon'; }
            else { sslClass = 'ssl-expired'; sslLabel = w.sslDays + ' days - CRITICAL'; }

            html += '<div class="col-md-6">';
            html += '<div class="card website-card ' + cardClass + '">';
            html += '<div class="card-body">';
            html += '<div class="d-flex justify-content-between align-items-start">';
            html += '<div><h6 class="mb-0">' + w.url + '</h6>';
            html += '<small class="text-muted">' + w.proto + ' &middot; ' + w.dns + '</small></div>';
            html += '<div class="text-end">';
            html += '<div class="fw-bold">' + w.latency + ' ms</div>';
            html += '<small class="text-muted">latency</small></div></div>';

            html += '<div class="uptime-bar"><div class="uptime-bar-fill" style="width:' + w.uptime + '%;background:' + uptimeColor + '"></div></div>';
            html += '<div class="d-flex justify-content-between align-items-center">';
            html += '<small>30-day uptime: <strong>' + w.uptime + '%</strong></small>';
            html += '<span class="ssl-badge ' + sslClass + '"><i class="fa fa-lock"></i> SSL: ' + sslLabel + '</span>';
            html += '</div>';

            html += '<canvas class="sparkline mt-2" id="spark-web-' + idx + '" height="35"></canvas>';
            html += '</div></div></div>';
        });
        $('#websites-grid').html(html);

        // Create sparklines for each website
        websites.forEach(function (w, idx) {
            var color = w.status === 'degraded' ? 'rgb(255, 193, 7)' : 'rgb(25, 135, 84)';
            createSparkline('spark-web-' + idx, generateSparkData(w.latency, w.latency * 0.3, 30), color);
        });
    }

    // ===== RENDER AI DEPLOYMENTS =====
    function renderProposals() {
        var html = '';
        proposals.forEach(function (p) {
            var riskClass = 'risk-' + p.risk;
            var riskBadge = p.risk === 'low' ? 'bg-success' : p.risk === 'medium' ? 'bg-warning text-dark' : 'bg-danger';
            var statusBadge = '';
            if (p.status === 'deployed') statusBadge = '<span class="badge bg-success ms-2">Deployed</span>';
            else if (p.status === 'rejected') statusBadge = '<span class="badge bg-danger ms-2">Rejected</span>';
            else statusBadge = '<span class="badge bg-secondary ms-2">Pending Review</span>';

            html += '<div class="card proposal-card ' + riskClass + '" data-id="' + p.id + '">';
            html += '<div class="card-body">';
            html += '<div class="d-flex justify-content-between align-items-start mb-2">';
            html += '<div><h6 class="mb-0">' + p.title + statusBadge + '</h6>';
            html += '<small class="text-muted">Proposed by <strong>' + p.agent + '</strong></small></div>';
            html += '<span class="badge ' + riskBadge + '">Risk: ' + p.risk + '</span></div>';

            html += '<p class="mb-2" style="font-size:0.9rem">' + p.rationale + '</p>';

            html += '<div class="mb-2"><strong class="small">File Changes:</strong>';
            p.files.forEach(function (f) {
                html += '<div class="file-change"><i class="fa fa-file-code-o"></i> ' + f + '</div>';
            });
            html += '</div>';

            html += '<div class="mb-3"><strong class="small">Rollback Plan:</strong> <span style="font-size:0.85rem">' + p.rollback + '</span></div>';

            // Approval gate
            html += '<div class="d-flex justify-content-between align-items-center">';
            html += '<div class="approval-gate">';
            html += '<strong class="small me-2">Approval Gate (2 required):</strong>';
            p.approvals.forEach(function (a, ai) {
                var dotClass = a.state === 'approved' ? 'approved' : a.state === 'rejected' ? 'rejected' : '';
                var icon = a.state === 'approved' ? '<i class="fa fa-check"></i>' : a.state === 'rejected' ? '<i class="fa fa-times"></i>' : (ai + 1);
                var title = a.name ? a.name + ' (' + a.state + ')' : 'Awaiting vote';
                html += '<div class="approval-dot ' + dotClass + '" title="' + title + '">' + icon + '</div>';
            });
            html += '</div>';

            // Action buttons for pending proposals
            if (p.status === 'pending') {
                html += '<div>';
                html += '<button class="btn btn-sm btn-outline-success me-1 btn-approve" data-id="' + p.id + '"><i class="fa fa-check"></i> Approve</button>';
                html += '<button class="btn btn-sm btn-outline-danger btn-reject" data-id="' + p.id + '"><i class="fa fa-times"></i> Reject</button>';
                html += '</div>';
            }
            html += '</div>';
            html += '</div></div>';
        });
        $('#proposals-list').html(html);

        // Approve button handler
        $(document).on('click', '.btn-approve', function () {
            var id = $(this).data('id');
            var p = proposals.find(function (x) { return x.id === id; });
            if (!p) return;
            // Find next pending approval slot
            var slot = p.approvals.find(function (a) { return a.state === 'pending'; });
            if (slot) {
                slot.name = 'You (admin)';
                slot.state = 'approved';
                var approvedCount = p.approvals.filter(function (a) { return a.state === 'approved'; }).length;
                if (approvedCount >= 2) {
                    p.status = 'deployed';
                }
                renderProposals();
            }
        });

        // Reject button handler
        $(document).on('click', '.btn-reject', function () {
            var id = $(this).data('id');
            var p = proposals.find(function (x) { return x.id === id; });
            if (!p) return;
            var slot = p.approvals.find(function (a) { return a.state === 'pending'; });
            if (slot) {
                slot.name = 'You (admin)';
                slot.state = 'rejected';
                p.status = 'rejected';
                renderProposals();
            }
        });
    }

    // ===== RENDER AUDIT LOG =====
    function renderAuditLog(filter) {
        filter = filter || 'all';
        var html = '';
        auditEntries.forEach(function (e) {
            if (filter !== 'all' && e.actor !== filter) return;
            var badgeClass = e.actor === 'human' ? 'actor-human' : e.actor === 'ai' ? 'actor-ai' : 'actor-system';
            var actorLabel = e.actor === 'human' ? 'Human' : e.actor === 'ai' ? 'AI Agent' : 'System';
            html += '<tr>';
            html += '<td class="text-nowrap"><small>' + e.time + '</small></td>';
            html += '<td><span class="actor-badge ' + badgeClass + '">' + actorLabel + '</span><br><small class="text-muted">' + e.actorName + '</small></td>';
            html += '<td><code>' + e.action + '</code></td>';
            html += '<td>' + e.target + '</td>';
            html += '<td><small>' + e.details + '</small></td>';
            html += '</tr>';
        });
        $('#audit-log-body').html(html);
    }

    // Audit filter buttons
    $('#audit-filters .btn').on('click', function () {
        $('#audit-filters .btn').removeClass('active');
        $(this).addClass('active');
        renderAuditLog($(this).data('filter'));
    });

    // ===== RENDER ACCESS CONTROL =====
    function renderAccessControl() {
        // RBAC Table
        var html = '';
        rbacPermissions.forEach(function (r) {
            html += '<tr>';
            html += '<td>' + r.perm + '</td>';
            html += '<td class="text-center">' + formatPermCell(r.admin) + '</td>';
            html += '<td class="text-center">' + formatPermCell(r.ai) + '</td>';
            html += '<td class="text-center">' + formatPermCell(r.dev) + '</td>';
            html += '</tr>';
        });
        $('#rbac-body').html(html);

        // Secrets Vault
        html = '';
        secrets.forEach(function (s) {
            html += '<tr>';
            html += '<td><i class="fa fa-key text-muted"></i> ' + s.name + '</td>';
            html += '<td><span class="badge bg-light text-dark">' + s.scope + '</span></td>';
            html += '<td><span class="secret-masked">' + s.masked + '</span></td>';
            html += '<td>' + s.rotated + '</td>';
            html += '<td>' + s.next + '</td>';
            html += '</tr>';
        });
        $('#secrets-body').html(html);
    }

    // ===== LAST UPDATED TIMESTAMP =====
    function updateTimestamp() {
        var now = new Date();
        var ts = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');
        $('#last-updated').text('Last updated: ' + ts);
    }

    // ===== AUTO-REFRESH =====
    function refreshGauges() {
        var cpuVal = Math.min(100, Math.max(0, 42 + randBetween(-8, 8)));
        var memVal = Math.min(100, Math.max(0, 67 + randBetween(-5, 5)));
        var diskVal = Math.min(100, Math.max(0, 35 + randBetween(-4, 4)));
        var netVal = Math.min(100, Math.max(0, 23 + randBetween(-6, 6)));

        setGauge('.gauge-cpu', cpuVal);
        setGauge('.gauge-mem', memVal);
        setGauge('.gauge-disk', diskVal);
        setGauge('.gauge-net', netVal);
        $('#gauge-cpu-val').text(cpuVal + '%');
        $('#gauge-mem-val').text(memVal + '%');
        $('#gauge-disk-val').text(diskVal + '%');
        $('#gauge-net-val').text(netVal + '%');

        updateTimestamp();
    }

    // ===== INITIALIZE =====
    renderOverview();
    renderServices();
    renderWebsites();
    renderProposals();
    renderAuditLog();
    renderAccessControl();
    updateTimestamp();

    // Auto-refresh every 30 seconds
    setInterval(refreshGauges, 30000);

});
