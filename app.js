// Master Application Control Logic Layer Engine Matrix Ecosystem
const App = {
    init() {
        if (!localStorage.getItem('report_tasks')) localStorage.setItem('report_tasks', JSON.stringify([]));
        if (!localStorage.getItem('report_depts')) localStorage.setItem('report_depts', JSON.stringify(['IT Support', 'Customer Success', 'Logistics Operations']));
        if (!localStorage.getItem('report_exts')) localStorage.setItem('report_exts', JSON.stringify(['101', '102', '105', '201']));
        if (!localStorage.getItem('report_user')) localStorage.setItem('report_user', 'admin');
        if (!localStorage.getItem('report_pass')) localStorage.setItem('report_pass', 'admin123');
        this.syncCallback = null;
    },
    login(user, pass) {
        if(user === localStorage.getItem('report_user') && pass === localStorage.getItem('report_pass')) {
            sessionStorage.setItem('report_session', 'authenticated');
            return true;
        }
        return false;
    },
    logout() {
        sessionStorage.removeItem('report_session');
        window.location.href = 'index.html';
    },
    guard() {
        if (sessionStorage.getItem('report_session') !== 'authenticated') { window.location.href = 'index.html'; }
    },
    getTasks() { return JSON.parse(localStorage.getItem('report_tasks')); },
    getNextTaskNo() {
        const tasks = this.getTasks();
        return tasks.length > 0 ? Math.max(...tasks.map(t => t.no || 0)) + 1 : 1;
    },
    addTask(task) {
        const tasks = this.getTasks(); tasks.push(task);
        localStorage.setItem('report_tasks', JSON.stringify(tasks));
        this.triggerBroadcast();
    },
    updateTask(index, updatedTask) {
        const tasks = this.getTasks(); tasks[index] = updatedTask;
        localStorage.setItem('report_tasks', JSON.stringify(tasks));
        this.triggerBroadcast();
    },
    deleteTask(index) {
        const tasks = this.getTasks(); tasks.splice(index, 1);
        localStorage.setItem('report_tasks', JSON.stringify(tasks));
        this.triggerBroadcast();
    },
    getDepts() { return JSON.parse(localStorage.getItem('report_depts')); },
    addDept(name) {
        const depts = this.getDepts(); depts.push(name);
        localStorage.setItem('report_depts', JSON.stringify(depts));
        this.triggerBroadcast();
    },
    deleteDept(index) {
        const depts = this.getDepts(); depts.splice(index, 1);
        localStorage.setItem('report_depts', JSON.stringify(depts));
        this.triggerBroadcast();
    },
    getExtensions() { return JSON.parse(localStorage.getItem('report_exts')); },
    addExtension(ext) {
        const exts = this.getExtensions(); exts.push(ext);
        localStorage.setItem('report_exts', JSON.stringify(exts));
        this.triggerBroadcast();
    },
    deleteExtension(index) {
        const exts = this.getExtensions(); exts.splice(index, 1);
        localStorage.setItem('report_exts', JSON.stringify(exts));
        this.triggerBroadcast();
    },
    exportBackup() {
        const data = {
            tasks: this.getTasks(), depts: this.getDepts(), exts: this.getExtensions(),
            user: localStorage.getItem('report_user'), pass: localStorage.getItem('report_pass')
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = `weekly_report_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    },
    importBackup(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if(data.tasks && data.depts && data.exts) {
                localStorage.setItem('report_tasks', JSON.stringify(data.tasks));
                localStorage.setItem('report_depts', JSON.stringify(data.depts));
                localStorage.setItem('report_exts', JSON.stringify(data.exts));
                if(data.user) localStorage.setItem('report_user', data.user);
                if(data.pass) localStorage.setItem('report_pass', data.pass);
                return true;
            }
        } catch(e) { console.error(e); }
        return false;
    },
    setSyncCallback(cb) { this.syncCallback = cb; },
    triggerBroadcast() {
        if(this.syncCallback) {
            this.syncCallback({ tasks: this.getTasks(), depts: this.getDepts(), exts: this.getExtensions() });
        }
    }
};
App.init();
