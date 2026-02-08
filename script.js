class AshlessTrackerV2 {
    constructor() {
        // Core data
        this.settings = JSON.parse(localStorage.getItem('ashless_v2_settings')) || null;
        this.entries = JSON.parse(localStorage.getItem('ashless_v2_entries')) || [];
        this.currentEditingDate = null;
        this.currentEditingIndex = null;
        this.chart = null;
        
        // Initialize
        this.initializeElements();
        this.attachEventListeners();
        this.checkFirstTimeSetup();
        this.loadTimezones();
    }
    
    initializeElements() {
        // Main UI elements
        this.entriesTable = document.getElementById('entriesTable');
        this.addPreviousDayBtn = document.getElementById('addPreviousDay');
        this.addPreviousBtn = document.querySelector('.add-previous-btn');
        
        // Modals
        this.settingsModal = document.getElementById('settingsModal');
        this.createTodayModal = document.getElementById('createTodayModal');
        this.addCravingModal = document.getElementById('addCravingModal');
        this.addSmokeModal = document.getElementById('addSmokeModal');
        this.infoModal = document.getElementById('infoModal');
        this.editDayModal = document.getElementById('editDayModal');
        this.chartModal = document.getElementById('chartModal');
        this.aboutModal = document.getElementById('aboutModal');
        this.importModal = document.getElementById('importModal');
        this.sideMenu = document.getElementById('sideMenu');
        this.menuOverlay = document.getElementById('menuOverlay');
        
        // Buttons
        this.menuToggle = document.getElementById('menuToggle');
        this.closeMenu = document.getElementById('closeMenu');
        this.addPreviousBtn = document.querySelector('.add-previous-btn');
        
        // Settings elements
        this.currencyInput = document.getElementById('currency');
        this.cigarettePriceInput = document.getElementById('cigarettePrice');
        this.timezoneInput = document.getElementById('timezone');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.currencySymbolElement = document.getElementById('currencySymbol');
        
        // Create today modal
        this.createTodayTitle = document.getElementById('createTodayTitle');
        this.createTodayYes = document.getElementById('createTodayYes');
        this.createTodayNo = document.getElementById('createTodayNo');
        
        // Add craving modal
        this.cravingTitle = document.getElementById('cravingTitle');
        this.smartTimeDefaults = document.getElementById('smartTimeDefaults');
        this.cravingHH = document.getElementById('cravingHH');
        this.cravingMM = document.getElementById('cravingMM');
        this.saveCravingBtn = document.getElementById('saveCraving');
        
        // Add smoke modal
        this.smokeTitle = document.getElementById('smokeTitle');
        this.smokeTimeDefaults = document.getElementById('smokeTimeDefaults');
        this.smokeHH = document.getElementById('smokeHH');
        this.smokeMM = document.getElementById('smokeMM');
        this.cigaretteCountInput = document.getElementById('cigaretteCount');
        this.saveSmokeBtn = document.getElementById('saveSmoke');
        
        // Info modal
        this.infoTitle = document.getElementById('infoTitle');
        this.timelineContent = document.getElementById('timelineContent');
        this.dayNotes = document.getElementById('dayNotes');
        this.saveNotesBtn = document.getElementById('saveNotes');
        
        // Edit day modal
        this.editDayTitle = document.getElementById('editDayTitle');
        this.cravingsList = document.getElementById('cravingsList');
        this.smokedList = document.getElementById('smokedList');
        this.addCravingEditBtn = document.getElementById('addCravingEdit');
        this.addSmokeEditBtn = document.getElementById('addSmokeEdit');
        this.deleteSelectedCravingsBtn = document.getElementById('deleteSelectedCravings');
        this.deleteSelectedSmokedBtn = document.getElementById('deleteSelectedSmoked');
        this.saveEditDayBtn = document.getElementById('saveEditDay');
        
        // Menu buttons
        this.chartBtn = document.getElementById('chartBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.settingsMenuBtn = document.getElementById('settingsMenuBtn');
        this.aboutBtn = document.getElementById('aboutBtn');
        
        // Chart elements
        this.timeRange = document.getElementById('timeRange');
        this.toggleSmoked = document.getElementById('toggleSmoked');
        this.toggleCravings = document.getElementById('toggleCravings');
        this.toggleIntensity = document.getElementById('toggleIntensity');
        this.totalSmoked = document.getElementById('totalSmoked');
        this.totalCravings = document.getElementById('totalCravings');
        this.moneySpent = document.getElementById('moneySpent');
        
        // Import elements
        this.csvFile = document.getElementById('csvFile');
        this.confirmImportBtn = document.getElementById('confirmImport');
    }
    
    attachEventListeners() {
        // Menu
        this.menuToggle.addEventListener('click', () => this.openMenu());
        this.closeMenu.addEventListener('click', () => this.closeMenu());
        this.menuOverlay.addEventListener('click', () => this.closeMenu());
        
        // Add previous day
        this.addPreviousBtn.addEventListener('click', () => this.addPreviousDay());
        
        // Settings
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.currencyInput.addEventListener('change', () => this.updateCurrencyPreview());
        this.settingsMenuBtn.addEventListener('click', () => this.openSettings());
        
        // Create today modal
        this.createTodayYes.addEventListener('click', () => this.createTodayEntry());
        this.createTodayNo.addEventListener('click', () => this.closeCreateTodayModal());
        
        // Add craving modal
        document.querySelector('.close-craving').addEventListener('click', () => this.closeAddCravingModal());
        this.saveCravingBtn.addEventListener('click', () => this.saveCraving());
        this.cravingHH.addEventListener('input', () => this.validateTimeInput(this.cravingHH, this.cravingMM));
        this.cravingMM.addEventListener('input', () => this.validateTimeInput(this.cravingHH, this.cravingMM));
        
        // Add smoke modal
        document.querySelector('.close-smoke').addEventListener('click', () => this.closeAddSmokeModal());
        this.saveSmokeBtn.addEventListener('click', () => this.saveSmoke());
        this.smokeHH.addEventListener('input', () => this.validateTimeInput(this.smokeHH, this.smokeMM));
        this.smokeMM.addEventListener('input', () => this.validateTimeInput(this.smokeHH, this.smokeMM));
        
        // Number buttons
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.adjustNumber(e));
        });
        
        // Info modal
        document.querySelector('.close-info').addEventListener('click', () => this.closeInfoModal());
        this.saveNotesBtn.addEventListener('click', () => this.saveDayNotes());
        
        // Edit day modal
        document.querySelector('.close-edit').addEventListener('click', () => this.closeEditDayModal());
        this.addCravingEditBtn.addEventListener('click', () => this.addEmptyCravingEdit());
        this.addSmokeEditBtn.addEventListener('click', () => this.addEmptySmokeEdit());
        this.deleteSelectedCravingsBtn.addEventListener('click', () => this.deleteSelectedCravings());
        this.deleteSelectedSmokedBtn.addEventListener('click', () => this.deleteSelectedSmoked());
        this.saveEditDayBtn.addEventListener('click', () => this.saveEditDay());
        
        // Menu actions
        this.chartBtn.addEventListener('click', () => this.openChartModal());
        this.exportBtn.addEventListener('click', () => this.exportCSV());
        this.importBtn.addEventListener('click', () => this.openImportModal());
        this.aboutBtn.addEventListener('click', () => this.openAboutModal());
        
        // Chart controls
        this.timeRange.addEventListener('change', () => this.updateChart());
        this.toggleSmoked.addEventListener('click', () => this.toggleChartData('smoked'));
        this.toggleCravings.addEventListener('click', () => this.toggleChartData('cravings'));
        this.toggleIntensity.addEventListener('click', () => this.toggleChartData('intensity'));
        
        // Import
        document.querySelector('.close-import').addEventListener('click', () => this.closeImportModal());
        this.confirmImportBtn.addEventListener('click', () => this.importCSV());
        
        // About modal
        document.querySelector('.close-about').addEventListener('click', () => this.closeAboutModal());
        document.querySelector('.close-chart').addEventListener('click', () => this.closeChartModal());
        
        // Close modals on outside click
        window.addEventListener('click', (e) => this.handleOutsideClick(e));
    }
    
    checkFirstTimeSetup() {
        if (!this.settings) {
            // First time user - show settings modal
            this.settingsModal.style.display = 'block';
        } else {
            // Existing user - check for today's entry
            this.checkTodaysEntry();
            this.loadEntries();
        }
    }
    
    loadTimezones() {
        const timezones = [
            'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles',
            'Europe/London', 'Europe/Paris', 'Asia/Tokyo',
            'Australia/Sydney', 'Asia/Singapore', 'Asia/Dubai',
            'America/Chicago', 'America/Toronto', 'Europe/Berlin'
        ];
        
        timezones.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz;
            option.textContent = tz;
            this.timezoneInput.appendChild(option);
        });
        
        // Default to Indian timezone
        this.timezoneInput.value = 'Asia/Kolkata';
    }
    
    saveSettings() {
        const currency = this.currencyInput.value;
        const price = parseFloat(this.cigarettePriceInput.value);
        const timezone = this.timezoneInput.value;
        
        if (!currency || isNaN(price) || price < 0.1 || !timezone) {
            alert('Please fill all fields correctly.');
            return;
        }
        
        this.settings = {
            currency,
            cigarettePrice: price,
            timezone,
            setupDate: new Date().toISOString()
        };
        
        localStorage.setItem('ashless_v2_settings', JSON.stringify(this.settings));
        this.settingsModal.style.display = 'none';
        
        // Show create today modal
        this.showCreateTodayModal();
    }
    
    showCreateTodayModal() {
        const today = this.getTodayDate();
        this.createTodayTitle.textContent = `No entry for ${today}. Create one?`;
        this.createTodayModal.style.display = 'block';
    }
    
    closeCreateTodayModal() {
        this.createTodayModal.style.display = 'none';
        this.createTodayEntry(); // Auto-create anyway
    }
    
    createTodayEntry() {
        const today = this.getTodayDate();
        const entry = {
            date: today,
            cravings: [],
            smoked: [],
            notes: ''
        };
        
        this.entries.push(entry);
        localStorage.setItem('ashless_v2_entries', JSON.stringify(this.entries));
        
        this.createTodayModal.style.display = 'none';
        this.loadEntries();
        
        // Schedule next day's entry creation
        this.scheduleNextDayEntry();
    }
    
    scheduleNextDayEntry() {
        // This is a simplified version - in production, you'd use service workers
        // or check on each app load
        console.log('Next day entry will be checked on app load');
    }
    
    checkTodaysEntry() {
        const today = this.getTodayDate();
        const hasToday = this.entries.some(entry => entry.date === today);
        
        if (!hasToday) {
            // Create today's entry automatically
            const entry = {
                date: today,
                cravings: [],
                smoked: [],
                notes: ''
            };
            
            this.entries.push(entry);
            localStorage.setItem('ashless_v2_entries', JSON.stringify(this.entries));
        }
        
        this.loadEntries();
    }
    
    getTodayDate() {
        const now = new Date();
        const timezone = this.settings ? this.settings.timezone : 'Asia/Kolkata';
        
        // Convert to specified timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
        
        const parts = formatter.formatToParts(now);
        const day = parts.find(p => p.type === 'day').value;
        const month = parts.find(p => p.type === 'month').value;
        const year = parts.find(p => p.type === 'year').value;
        
        return `${day}-${month}-${year}`;
    }
    
    formatDateForDisplay(dateStr) {
        const [day, month, year] = dateStr.split('-');
        return {
            day,
            month,
            year,
            full: dateStr
        };
    }
    
    addPreviousDay() {
        if (this.entries.length === 0) return;
        
        // Find the most recent date
        const latestEntry = this.entries[0]; // Entries are sorted newest first
        const [day, month, year] = latestEntry.date.split('-').map(Number);
        
        // Calculate previous day
        const date = new Date(2000 + year, month - 1, day);
        date.setDate(date.getDate() - 1);
        
        const prevDay = String(date.getDate()).padStart(2, '0');
        const prevMonth = String(date.getMonth() + 1).padStart(2, '0');
        const prevYear = String(date.getFullYear() - 2000).padStart(2, '0');
        const prevDate = `${prevDay}-${prevMonth}-${prevYear}`;
        
        // Check if already exists
        if (this.entries.some(entry => entry.date === prevDate)) {
            alert('Entry for previous day already exists!');
            return;
        }
        
        const entry = {
            date: prevDate,
            cravings: [],
            smoked: [],
            notes: ''
        };
        
        this.entries.unshift(entry); // Add to beginning
        this.entries.sort((a, b) => this.compareDates(b.date, a.date)); // Sort newest first
        
        localStorage.setItem('ashless_v2_entries', JSON.stringify(this.entries));
        this.loadEntries();
    }
    
    compareDates(dateA, dateB) {
        const [dayA, monthA, yearA] = dateA.split('-').map(Number);
        const [dayB, monthB, yearB] = dateB.split('-').map(Number);
        
        const dateObjA = new Date(2000 + yearA, monthA - 1, dayA);
        const dateObjB = new Date(2000 + yearB, monthB - 1, dayB);
        
        return dateObjB - dateObjA; // For newest first
    }
    
    loadEntries() {
        this.entriesTable.innerHTML = '';
        
        if (this.entries.length === 0) {
            this.entriesTable.innerHTML = `
                <div class="empty-state">
                    <p>No entries yet. Setting up your tracker...</p>
                </div>
            `;
            this.addPreviousDayBtn.style.display = 'none';
            return;
        }
        
        // Sort entries newest first
        this.entries.sort((a, b) => this.compareDates(b.date, a.date));
        
        this.entries.forEach((entry, index) => {
            const row = document.createElement('div');
            row.className = 'entry-row';
            
            const dateParts = this.formatDateForDisplay(entry.date);
            const cravingsCount = entry.cravings.length;
            const smokedCount = entry.smoked.reduce((sum, smoke) => sum + smoke.count, 0);
            const moneySpent = smokedCount * this.settings.cigarettePrice;
            
            // Calculate intensity distribution for display
            const intensityCounts = { low: 0, medium: 0, high: 0 };
            entry.cravings.forEach(craving => {
                intensityCounts[craving.intensity]++;
            });
            
            row.innerHTML = `
                <div class="entry-cell date-cell">
                    <div class="date-day">${dateParts.day}</div>
                    <div class="date-month">${dateParts.month}</div>
                    <div class="date-year">${dateParts.year}</div>
                </div>
                <div class="entry-cell clickable-cell craving-cell" data-date="${entry.date}" data-type="craving">
                    <span class="craving-count">${cravingsCount}</span>
                    <div class="intensity-indicator">
                        ${intensityCounts.low > 0 ? '<span class="intensity-dot intensity-low"></span>' : ''}
                        ${intensityCounts.medium > 0 ? '<span class="intensity-dot intensity-medium"></span>' : ''}
                        ${intensityCounts.high > 0 ? '<span class="intensity-dot intensity-high"></span>' : ''}
                    </div>
                </div>
                <div class="entry-cell clickable-cell" data-date="${entry.date}" data-type="smoke">
                    ${smokedCount}
                </div>
                <div class="entry-cell">
                    ${this.settings.currency}${moneySpent.toFixed(2)}
                </div>
                <div class="entry-cell">
                    <button class="info-btn" data-date="${entry.date}">𝒊</button>
                </div>
                <div class="entry-cell">
                    <button class="edit-btn" data-date="${entry.date}">⋮</button>
                </div>
            `;
            
            this.entriesTable.appendChild(row);
        });
        
        // Add event listeners to the new elements
        this.attachRowEventListeners();
        this.addPreviousDayBtn.style.display = 'block';
    }
    
    attachRowEventListeners() {
        // Craving cells
        document.querySelectorAll('.craving-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const date = e.currentTarget.dataset.date;
                this.openAddCravingModal(date);
            });
        });
        
        // Smoke cells
        document.querySelectorAll('.entry-cell[data-type="smoke"]').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const date = e.currentTarget.dataset.date;
                this.openAddSmokeModal(date);
            });
        });
        
        // Info buttons
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const date = e.currentTarget.dataset.date;
                this.openInfoModal(date);
            });
        });
        
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const date = e.currentTarget.dataset.date;
                this.openEditDayModal(date);
            });
        });
    }
    
    openAddCravingModal(date) {
        this.currentEditingDate = date;
        this.cravingTitle.textContent = `Add Craving for ${date}`;
        
        // Clear previous selections
        this.clearCravingModal();
        
        // Check if it's today
        const today = this.getTodayDate();
        const isToday = date === today;
        
        // Add smart time defaults if it's today
        if (isToday) {
            this.addSmartTimeDefaults(this.smartTimeDefaults, 'craving');
        } else {
            this.smartTimeDefaults.innerHTML = '<p>Enter time manually for past dates</p>';
        }
        
        // Add intensity selector event listeners
        document.querySelectorAll('.intensity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.intensity-btn').forEach(b => b.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.checkCravingSaveButton();
            });
        });
        
        // Add time input validation
        this.cravingHH.addEventListener('input', () => {
            this.validateTimeInput(this.cravingHH, this.cravingMM);
            this.checkCravingSaveButton();
        });
        
        this.cravingMM.addEventListener('input', () => {
            this.validateTimeInput(this.cravingHH, this.cravingMM);
            this.checkCravingSaveButton();
        });
        
        this.addCravingModal.style.display = 'block';
    }
    
    clearCravingModal() {
        document.querySelectorAll('.intensity-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.cravingHH.value = '';
        this.cravingMM.value = '';
        this.saveCravingBtn.disabled = true;
    }
    
    addSmartTimeDefaults(container, type) {
        const now = new Date();
        const defaults = [
            { label: 'Just now', minutes: 0 },
            { label: '5 min ago', minutes: 5 },
            { label: '15 min ago', minutes: 15 },
            { label: '30 min ago', minutes: 30 },
            { label: '1 hr ago', minutes: 60 },
            { label: '2 hr ago', minutes: 120 }
        ];
        
        container.innerHTML = '';
        
        defaults.forEach(defaultTime => {
            const button = document.createElement('button');
            button.className = 'time-btn';
            button.textContent = defaultTime.label;
            button.dataset.minutes = defaultTime.minutes;
            
            button.addEventListener('click', () => {
                // Clear other selections
                document.querySelectorAll('.time-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');
                
                // Calculate time
                const targetTime = new Date(now.getTime() - defaultTime.minutes * 60000);
                let hours = targetTime.getHours();
                let minutes = targetTime.getMinutes();
                
                // Handle date boundary (if time goes to previous day)
                if (defaultTime.minutes > 0 && targetTime.getDate() !== now.getDate()) {
                    // For simplicity, we'll just use current time
                    hours = now.getHours();
                    minutes = now.getMinutes();
                }
                
                // Set the custom time inputs
                const hhInput = type === 'craving' ? this.cravingHH : this.smokeHH;
                const mmInput = type === 'craving' ? this.cravingMM : this.smokeMM;
                
                hhInput.value = String(hours).padStart(2, '0');
                mmInput.value = String(minutes).padStart(2, '0');
                
                // Validate
                this.validateTimeInput(hhInput, mmInput);
                
                // Check save button
                if (type === 'craving') {
                    this.checkCravingSaveButton();
                } else {
                    this.checkSmokeSaveButton();
                }
            });
            
            container.appendChild(button);
        });
    }
    
    validateTimeInput(hhInput, mmInput) {
        let hh = parseInt(hhInput.value) || 0;
        let mm = parseInt(mmInput.value) || 0;
        
        // Auto-correct invalid values
        if (hh < 0) hh = 0;
        if (hh > 23) hh = 23;
        if (mm < 0) mm = 0;
        if (mm > 59) mm = 59;
        
        // Update values
        hhInput.value = hh > 0 ? String(hh).padStart(2, '0') : '';
        mmInput.value = mm > 0 ? String(mm).padStart(2, '0') : '';
        
        // Add invalid class if empty
        if (!hhInput.value) {
            hhInput.classList.add('invalid');
        } else {
            hhInput.classList.remove('invalid');
        }
        
        if (!mmInput.value) {
            mmInput.classList.add('invalid');
        } else {
            mmInput.classList.remove('invalid');
        }
        
        return hhInput.value && mmInput.value;
    }
    
    checkCravingSaveButton() {
        const timeValid = this.cravingHH.value && this.cravingMM.value;
        const intensitySelected = document.querySelector('.intensity-btn.selected');
        this.saveCravingBtn.disabled = !(timeValid && intensitySelected);
    }
    
    checkSmokeSaveButton() {
        const timeValid = this.smokeHH.value && this.smokeMM.value;
        const countValid = parseInt(this.cigaretteCountInput.value) > 0;
        this.saveSmokeBtn.disabled = !(timeValid && countValid);
    }
    
    saveCraving() {
        const time = `${this.cravingHH.value}:${this.cravingMM.value}`;
        const intensityBtn = document.querySelector('.intensity-btn.selected');
        
        if (!time || !intensityBtn) {
            alert('Please select both time and intensity');
            return;
        }
        
        // Validate time format
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            alert('Please enter a valid time (HH:MM)');
            return;
        }
        
        const intensity = intensityBtn.dataset.intensity;
        const entryIndex = this.entries.findIndex(entry => entry.date === this.currentEditingDate);
        
        if (entryIndex === -1) {
            alert('Error: Entry not found');
            return;
        }
        
        // Add craving to entry
        this.entries[entryIndex].cravings.push({
            time,
            intensity
        });
        
        // Sort cravings by time
        this.entries[entryIndex].cravings.sort((a, b) => {
            const [hA, mA] = a.time.split(':').map(Number);
            const [hB, mB] = b.time.split(':').map(Number);
            return (hA * 60 + mA) - (hB * 60 + mB);
        });
        
        localStorage.setItem('ashless_v2_entries', JSON.stringify(this.entries));
        this.closeAddCravingModal();
        this.loadEntries();
    }
    
    closeAddCravingModal() {
        this.addCravingModal.style.display = 'none';
        this.currentEditingDate = null;
    }
    
    openAddSmokeModal(date) {
        this.currentEditingDate = date;
        this.smokeTitle.textContent = `Smoked? for ${date}`;
        
        // Clear previous selections
        this.clearSmokeModal();
        
        // Check if it's today
        const today = this.getTodayDate();
        const isToday = date === today;
        
        // Add smart time defaults if it's today
        if (isToday) {
            this.addSmartTimeDefaults(this.smokeTimeDefaults, 'smoke');
        } else {
            this.smokeTimeDefaults.innerHTML = '<p>Enter time manually for past dates</p>';
        }
        
        // Add time input validation
        this.smokeHH.addEventListener('input', () => {
            this.validateTimeInput(this.smokeHH, this.smokeMM);
            this.checkSmokeSaveButton();
        });
        
        this.smokeMM.addEventListener('input', () => {
            this.validateTimeInput(this.smokeHH, this.smokeMM);
            this.checkSmokeSaveButton();
        });
        
        // Add count input validation
        this.cigaretteCountInput.addEventListener('input', () => {
            let value = parseInt(this.cigaretteCountInput.value) || 1;
            if (value < 1) value = 1;
            this.cigaretteCountInput.value = value;
            this.checkSmokeSaveButton();
        });
        
        this.addSmokeModal.style.display = 'block';
    }
    
    clearSmokeModal() {
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.smokeHH.value = '';
        this.smokeMM.value = '';
        this.cigaretteCountInput.value = '1';
        this.saveSmokeBtn.disabled = true;
    }
    
    saveSmoke() {
        const time = `${this.smokeHH.value}:${this.smokeMM.value}`;
        const count = parseInt(this.cigaretteCountInput.value) || 1;
        
        if (!time || count < 1) {
            alert('Please enter both time and cigarette count');
            return;
        }
        
        // Validate time format
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            alert('Please enter a valid time (HH:MM)');
            return;
        }
        
        const entryIndex = this.entries.findIndex(entry => entry.date === this.currentEditingDate);
        
        if (entryIndex === -1) {
            alert('Error: Entry not found');
            return;
        }
        
        // Add smoke to entry
        this.entries[entryIndex].smoked.push({
            time,
            count
        });
        
        // Sort smoked entries by time
        this.entries[entryIndex].smoked.sort((a, b) => {
            const [hA, mA] = a.time.split(':').map(Number);
            const [hB, mB] = b.time.split(':').map(Number);
            return (hA * 60 + mA) - (hB * 60 + mB);
        });
        
        localStorage.setItem('ashless_v2_entries', JSON.stringify(this.entries));
        this.closeAddSmokeModal();
        this.loadEntries();
    }
    
    closeAddSmokeModal() {
        this.addSmokeModal.style.display = 'none';
        this.currentEditingDate = null;
    }
    
    openInfoModal(date) {
        this.currentEditingDate = date;
        this.infoTitle.textContent = `${date} Timeline`;
        
        const entry = this.entries.find(e => e.date === date);
        if (!entry) {
            alert('Entry not found');
            return;
        }
        
        // Display timeline
        this.timelineContent.innerHTML = '';
        
        // Combine and sort all events by time
        const allEvents = [];
        
        entry.cravings.forEach(craving => {
            allEvents.push({
                time: craving.time,
                type: 'craving',
                intensity: craving.intensity,
                text: `Craving (${craving.intensity})`
            });
        });
        
        entry.smoked.forEach(smoke => {
            allEvents.push({
                time: smoke.time,
                type: 'smoke',
                count: smoke.count,
                text: `Smoked (${smoke.count} cigarette${smoke.count > 1 ? 's' : ''})`
            });
        });
        
        // Sort by time
        allEvents.sort((a, b) => {
            const [hA, mA] = a.time.split(':').map(Number);
            const [hB, mB] = b.time.split(':').map(Number);
            return (hA * 60 + mA) - (hB * 60 + mB);
        });
        
        // Display events
        if (allEvents.length === 0) {
            this.timelineContent.innerHTML = '<p class="empty-timeline">No events recorded for this day.</p>';
        } else {
            allEvents.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = 'timeline-entry';
                
                let emoji = '😩';
                let intensityDot = '';
                
                if (event.type === 'craving') {
                    emoji = '😩';
                    let intensityColor = '';
                    switch (event.intensity) {
                        case 'low': intensityColor = 'var(--low-intensity)'; break;
                        case 'medium': intensityColor = 'var(--medium-intensity)'; break;
                        case 'high': intensityColor = 'var(--high-intensity)'; break;
                    }
                    intensityDot = `<span class="timeline-intensity" style="background-color: ${intensityColor}"></span>`;
                } else {
                    emoji = '🚬';
                }
                
                eventEl.innerHTML = `
                    <span class="timeline-time">${event.time}</span>
                    <span class="timeline-emoji">${emoji}</span>
                    <span class="timeline-text">${event.text}</span>
                    ${intensityDot}
                `;
                
                this.timelineContent.appendChild(eventEl);
            });
        }
        
        // Load notes
        this.dayNotes.value = entry.notes || '';
        
        this.infoModal.style.display = 'block';
    }
    
    saveDayNotes() {
        const entryIndex = this.entries.findIndex(entry => entry.date === this.currentEditingDate);
        
        if (entryIndex === -1) {
            alert('Error: Entry not found');
            return;
        }
        
        this.entries[entryIndex].notes = this.dayNotes.value;
        localStorage.setItem('ashless_v2_entries', JSON.stringify(this.entries));
        
        alert('Notes saved successfully!');
        this.closeInfoModal();
    }
    
    closeInfoModal() {
        this.infoModal.style.display = 'none';
        this.currentEditingDate = null;
    }
    
    openEditDayModal(date) {
        this.currentEditingDate = date;
        this.editDayTitle.textContent = `Edit ${date}`;
        
        const entry = this.entries.find(e => e.date === date);
        if (!entry) {
            alert('Entry not found');
            return;
        }
        
        // Display cravings for editing
        this.displayCravingsForEdit(entry.cravings);
        
        // Display smoked for editing
        this.displaySmokedForEdit(entry.smoked);
        
        // Update delete buttons state
        this.updateDeleteButtonsState();
        
        this.editDayModal.style.display = 'block';
    }
    
    displayCravingsForEdit(cravings) {
        this.cravingsList.innerHTML = '';
        
        cravings.forEach((craving, index) => {
            const cravingEl = document.createElement('div');
            cravingEl.className = 'edit-item';
            cravingEl.innerHTML = `
                <input type="checkbox" class="edit-checkbox craving-checkbox" data-index="${index}">
                <span>${index + 1}.</span>
                <div class="edit-time-input">
                    <input type="text" class="edit-hh" value="${craving.time.split(':')[0]}" maxlength="2" placeholder="HH">
                    <span>:</span>
                    <input type="text" class="edit-mm" value="${craving.time.split(':')[1]}" maxlength="2" placeholder="MM">
                </div>
                <div class="edit-intensity-selector">
                    <button class="edit-intensity-btn low ${craving.intensity === 'low' ? 'selected' : ''}" data-intensity="low">🟢</button>
                    <button class="edit-intensity-btn medium ${craving.intensity === 'medium' ? 'selected' : ''}" data-intensity="medium">🟡</button>
                    <button class="edit-intensity-btn high ${craving.intensity === 'high' ? 'selected' : ''}" data-intensity="high">🔴</button>
                </div>
            `;
            
            // Add event listeners
            const hhInput = cravingEl.querySelector('.edit-hh');
            const mmInput = cravingEl.querySelector('.edit-mm');
            const intensityBtns = cravingEl.querySelectorAll('.edit-intensity-btn');
            
            hhInput.addEventListener('input', () => this.validateTimeInput(hhInput, mmInput));
            mmInput.addEventListener('input', () => this.validateTimeInput(hhInput, mmInput));
            
            intensityBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    intensityBtns.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
            });
            
            this.cravingsList.appendChild(cravingEl);
        });
    }
    
    displaySmokedForEdit(smoked) {
        this.smokedList.innerHTML = '';
        
        smoked.forEach((smoke, index) => {
            const smokeEl = document.createElement('div');
            smokeEl.className = 'edit-item';
            smokeEl.innerHTML = `
                <input type="checkbox" class="edit-checkbox smoke-checkbox" data-index="${index}">
                <span>${index + 1}.</span>
                <div class="edit-time-input">
                    <input type="text" class="edit-hh" value="${smoke.time.split(':')[0]}" maxlength="2" placeholder="HH">
                    <span>:</span>
                    <input type="text" class="edit-mm" value="${smoke.time.split(':')[1]}" maxlength="2" placeholder="MM">
                </div>
                <div class="edit-count-input">
                    <button type="button" class="number-btn minus small">−</button>
                    <input type="number" class="edit-count" value="${smoke.count}" min="1">
                    <button type="button" class="number-btn plus small">+</button>
                </div>
            `;
            
            // Add event listeners
            const hhInput = smokeEl.querySelector('.edit-hh');
            const mmInput = smokeEl.querySelector('.edit-mm');
            const countInput = smokeEl.querySelector('.edit-count');
            const minusBtn = smokeEl.querySelector('.minus');
            const plusBtn = smokeEl.querySelector('.plus');
            
            hhInput.addEventListener('input', () => this.validateTimeInput(hhInput, mmInput));
            mmInput.addEventListener('input', () => this.validateTimeInput(hhInput, mmInput));
            
            minusBtn.addEventListener('click', () => {
                let value = parseInt(countInput.value) || 1;
                if (value > 1) value--;
                countInput.value = value;
            });
            
            plusBtn.addEventListener('click', () => {
                let value = parseInt(countInput.value) || 1;
                value++;
                countInput.value = value;
            });
            
            this.smokedList.appendChild(smokeEl);
        });
    }
    
    addEmptyCravingEdit() {
        const cravingEl = document.createElement('div');
        cravingEl.className = 'edit-item';
        cravingEl.innerHTML = `
            <input type="checkbox" class="edit-checkbox craving-checkbox" data-index="new">
            <span>New.</span>
            <div class="edit-time-input">
                <input type="text" class="edit-hh" maxlength="2" placeholder="HH">
                <span>:</span>
                <input type="text" class="edit-mm" maxlength="2" placeholder="MM">
            </div>
            <div class="edit-intensity-selector">
                <button class="edit-intensity-btn low" data-intensity="low">🟢</button>
                <button class="edit-intensity-btn medium" data-intensity="medium">🟡</button>
                <button class="edit-intensity-btn high" data-intensity="high">🔴</button>
            </div>
        `;
        
        // Add event listeners
        const hhInput = cravingEl.querySelector('.edit-hh');
        const mmInput = cravingEl.querySelector('.edit-mm');
        const intensityBtns = cravingEl.querySelectorAll('.edit-intensity-btn');
        
        hhInput.addEventListener('input', () => this.validateTimeInput(hhInput, mmInput));
        mmInput.addEventListener('input', () => this.validateTimeInput(hhInput, mmInput));
        
        intensityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                intensityBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
        
        this.cravingsList.appendChild(cravingEl);
    }
    
    addEmptySmokeEdit() {
        const smokeEl = document.createElement('div');
        smokeEl.className = 'edit-item';
        smokeEl.innerHTML = `
            <input type="checkbox" class="edit-checkbox smoke-checkbox" data-index="new">
            <span>New.</span>
            <div class="edit-time-input">
                <input type="text" class="edit-hh" maxlength="2" placeholder="HH">
                <span>:</span>
                <input type="text" class="edit-mm" maxlength="2" placeholder="MM">
            </div>
            <div class="edit-count-input">
                <button type="button" class="number-btn minus small">−</button>
                <input type="number" class="edit-count" value="1" min="1">
                <button type="button" class="number-btn plus small">+</button>
            </div>
        `;
        
        // Add event listeners
        const hhInput = smokeEl.querySelector('.edit-hh');
        const mmInput = smokeEl.querySelector('.edit-mm');
        const countInput = smokeEl.querySelector('.edit-count');
        const minusBtn = smokeEl.querySelector('.minus');
        const plusBtn = smokeEl.querySelector('.plus');
        
        hhInput.addEventListener('input', () => this.validateTimeInput(hhInput, mmInput));
        mmInput.addEventListener('input', () => this.validateTimeInput(hhInput, mmInput));
        
        minusBtn.addEventListener('click', () => {
            let value = parseInt(countInput.value) || 1;
            if (value > 1) value--;
            countInput.value = value;
        });
        
        plusBtn.addEventListener('click', () => {
            let value = parseInt(countInput.value) || 1;
            value++;
            countInput.value = value;
        });
        
        this.smokedList.appendChild(smokeEl);
    }
    
    deleteSelectedCravings() {
        const checkboxes = document.querySelectorAll('.craving-checkbox:checked');
        const indices = Array.from(checkboxes).map(cb => cb.dataset.index);
        
        if (indices.length === 0) {
            alert('Please select cravings to delete');
            return;
        }
        
        if (!confirm(`Delete ${indices.length} selected craving(s)?`)) {
            return;
        }
        
        const entryIndex = this.entries.findIndex(entry => entry.date === this.currentEditingDate);
        if (entryIndex === -1) return;
        
        // Remove selected cravings (in reverse order to maintain indices)
        const newCravings = this.entries[entryIndex].cravings.filter((_, index) => {
            return !indices.includes(index.toString()) && !indices.includes('new');
        });
        
        this.entries[entryIndex].cravings = newCravings;
        this.displayCravingsForEdit(newCravings);
        this.updateDeleteButtonsState();
    }
    
    deleteSelectedSmoked() {
        const checkboxes = document.querySelectorAll('.smoke-checkbox:checked');
        const indices = Array.from(checkboxes).map(cb => cb.dataset.index);
        
        if (indices.length === 0) {
            alert('Please select smoked entries to delete');
            return;
        }
        
        if (!confirm(`Delete ${indices.length} selected smoked entry/entries?`)) {
            return;
        }
        
        const entryIndex = this.entries.findIndex(entry => entry.date === this.currentEditingDate);
        if (entryIndex === -1) return;
        
        // Remove selected smoked entries (in reverse order to maintain indices)
        const newSmoked = this.entries[entryIndex].smoked.filter((_, index) => {
            return !indices.includes(index.toString()) && !indices.includes('new');
        });
        
        this.entries[entryIndex].smoked = newSmoked;
        this.displaySmokedForEdit(newSmoked);
        this.updateDeleteButtonsState();
    }
    
    updateDeleteButtonsState() {
        const cravingChecked = document.querySelectorAll('.craving-checkbox:checked').length > 0;
        const smokeChecked = document.querySelectorAll('.smoke-checkbox:checked').length > 0;
        
        this.deleteSelectedCravingsBtn.disabled = !cravingChecked;
        this.deleteSelectedSmokedBtn.disabled = !smokeChecked;
    }
    
    saveEditDay() {
        const entryIndex = this.entries.findIndex(entry => entry.date === this.currentEditingDate);
        if (entryIndex === -1) return;
        
        // Collect updated cravings
        const updatedCravings = [];
        const cravingItems = this.cravingsList.querySelectorAll('.edit-item');
        
        for (const item of cravingItems) {
            const hhInput = item.querySelector('.edit-hh');
            const mmInput = item.querySelector('.edit-mm');
            const selectedIntensityBtn = item.querySelector('.edit-intensity-btn.selected');
            
            if (hhInput.value && mmInput.value && selectedIntensityBtn) {
                const time = `${hhInput.value.padStart(2, '0')}:${mmInput.value.padStart(2, '0')}`;
                const intensity = selectedIntensityBtn.dataset.intensity;
                
                if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
                    updatedCravings.push({ time, intensity });
                }
            }
        }
        
        // Collect updated smoked entries
        const updatedSmoked = [];
        const smokedItems = this.smokedList.querySelectorAll('.edit-item');
        
        for (const item of smokedItems) {
            const hhInput = item.querySelector('.edit-hh');
            const mmInput = item.querySelector('.edit-mm');
            const countInput = item.querySelector('.edit-count');
            
            if (hhInput.value && mmInput.value && countInput.value) {
                const time = `${hhInput.value.padStart(2, '0')}:${mmInput.value.padStart(2, '0')}`;
                const count = parseInt(countInput.value) || 1;
                
                if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time) && count > 0) {
                    updatedSmoked.push({ time, count });
                }
            }
        }
        
        // Sort by time
        updatedCravings.sort((a, b) => {
            const [hA, mA] = a.time.split(':').map(Number);
            const [hB, mB] = b.time.split(':').map(Number);
            return (hA * 60 + mA) - (hB * 60 + mB);
        });
        
        updatedSmoked.sort((a, b) => {
            const [hA, mA] = a.time.split(':').map(Number);
            const [hB, mB] = b.time.split(':').map(Number);
            return (hA * 60 + mA) - (hB * 60 + mB);
        });
        
        // Update entry
        this.entries[entryIndex].cravings = updatedCravings;
        this.entries[entryIndex].smoked = updatedSmoked;
        
        localStorage.setItem('ashless_v2_entries', JSON.stringify(this.entries));
        
        alert('Changes saved successfully!');
        this.closeEditDayModal();
        this.loadEntries();
    }
    
    closeEditDayModal() {
        this.editDayModal.style.display = 'none';
        this.currentEditingDate = null;
    }
    
    // Menu functions
    openMenu() {
        this.sideMenu.style.right = '0';
        this.menuOverlay.style.display = 'block';
    }
    
    closeMenu() {
        this.sideMenu.style.right = '-300px';
        this.menuOverlay.style.display = 'none';
    }
    
    openSettings() {
        if (!this.settings) {
            this.settingsModal.style.display = 'block';
        } else {
            alert('Settings cannot be changed after initial setup. Clear all data to change settings.');
        }
        this.closeMenu();
    }
    
    openChartModal() {
        this.chartModal.style.display = 'block';
        this.closeMenu();
        setTimeout(() => this.updateChart(), 100);
    }
    
    openAboutModal() {
        this.aboutModal.style.display = 'block';
        this.closeMenu();
    }
    
    openImportModal() {
        this.importModal.style.display = 'block';
        this.closeMenu();
    }
    
    closeImportModal() {
        this.importModal.style.display = 'none';
        this.csvFile.value = '';
    }
    
    // Chart functions
    updateChart() {
        const days = parseInt(this.timeRange.value);
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Filter entries within date range
        const filteredEntries = this.entries.filter(entry => {
            const [day, month, year] = entry.date.split('-').map(Number);
            const entryDate = new Date(2000 + year, month - 1, day);
            return entryDate >= startDate && entryDate <= today;
        });
        
        // Sort by date ascending for chart
        filteredEntries.sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split('-').map(Number);
            const [dayB, monthB, yearB] = b.date.split('-').map(Number);
            const dateA = new Date(2000 + yearA, monthA - 1, dayA);
            const dateB = new Date(2000 + yearB, monthB - 1, dayB);
            return dateA - dateB;
        });
        
        const labels = filteredEntries.map(entry => entry.date);
        const smokedData = filteredEntries.map(entry => 
            entry.smoked.reduce((sum, smoke) => sum + smoke.count, 0)
        );
        const cravingsData = filteredEntries.map(entry => entry.cravings.length);
        
        // Calculate stats
        const totalSmoked = smokedData.reduce((sum, val) => sum + val, 0);
        const totalCravings = cravingsData.reduce((sum, val) => sum + val, 0);
        const totalMoney = totalSmoked * this.settings.cigarettePrice;
        
        this.totalSmoked.textContent = totalSmoked;
        this.totalCravings.textContent = totalCravings;
        this.moneySpent.textContent = `${this.settings.currency}${totalMoney.toFixed(2)}`;
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Create new chart
        const ctx = document.getElementById('progressChart').getContext('2d');
        
        // Prepare datasets
        const datasets = [];
        
        if (this.toggleSmoked.classList.contains('active')) {
            datasets.push({
                label: 'Cigarettes Smoked',
                data: smokedData,
                borderColor: 'var(--chart-smoked)',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                fill: false
            });
        }
        
        if (this.toggleCravings.classList.contains('active')) {
            datasets.push({
                label: 'Cravings',
                data: cravingsData,
                borderColor: 'var(--chart-cravings)',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.3,
                fill: false
            });
        }
        
        // Add intensity dots if enabled
        if (this.toggleIntensity.classList.contains('active')) {
            // Create scatter plot for intensity
            const intensityData = [];
            
            filteredEntries.forEach((entry, entryIndex) => {
                entry.cravings.forEach(craving => {
                    const [hours, minutes] = craving.time.split(':').map(Number);
                    // Convert time to decimal hours for x-position
                    const timeDecimal = hours + minutes / 60;
                    
                    intensityData.push({
                        x: entryIndex + timeDecimal / 24, // Spread within day
                        y: entry.cravings.length, // Position at cravings count level
                        intensity: craving.intensity
                    });
                });
            });
            
            if (intensityData.length > 0) {
                datasets.push({
                    label: 'Craving Intensity',
                    data: intensityData,
                    type: 'scatter',
                    pointBackgroundColor: intensityData.map(point => {
                        switch (point.intensity) {
                            case 'low': return 'var(--low-intensity)';
                            case 'medium': return 'var(--medium-intensity)';
                            case 'high': return 'var(--high-intensity)';
                            default: return '#fff';
                        }
                    }),
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointRadius: 6,
                    pointStyle: 'rect',
                    showLine: false
                });
            }
        }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'var(--text-primary)',
                            font: {
                                family: 'Consolas, Monaco, monospace'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 30, 30, 0.9)',
                        titleColor: 'var(--accent-color)',
                        bodyColor: 'var(--text-primary)',
                        borderColor: 'var(--accent-color)',
                        borderWidth: 1,
                        cornerRadius: 6
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'var(--text-secondary)',
                            maxRotation: 45,
                            font: {
                                family: 'Consolas, Monaco, monospace'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: 'var(--text-secondary)',
                            font: {
                                family: 'Consolas, Monaco, monospace'
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 750,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
    
    toggleChartData(type) {
        const button = document.getElementById(`toggle${type.charAt(0).toUpperCase() + type.slice(1)}`);
        button.classList.toggle('active');
        this.updateChart();
    }
    
    // Export/Import
    exportCSV() {
        if (this.entries.length === 0) {
            alert('No data to export!');
            return;
        }
        
        const headers = ['Date', 'Time', 'Type', 'Intensity/Count', 'Notes'];
        const csvRows = [headers.join(',')];
        
        this.entries.forEach(entry => {
            // Export cravings
            entry.cravings.forEach(craving => {
                const row = [
                    entry.date,
                    craving.time,
                    'Craving',
                    craving.intensity,
                    `"${entry.notes.replace(/"/g, '""')}"`
                ];
                csvRows.push(row.join(','));
            });
            
            // Export smoked
            entry.smoked.forEach(smoke => {
                const row = [
                    entry.date,
                    smoke.time,
                    'Smoked',
                    smoke.count,
                    `"${entry.notes.replace(/"/g, '""')}"`
                ];
                csvRows.push(row.join(','));
            });
        });
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `ashless_v2_export_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.closeMenu();
    }
    
    importCSV() {
        const file = this.csvFile.files[0];
        if (!file) {
            alert('Please select a CSV file to import.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const rows = content.split('\n').filter(row => row.trim());
                
                if (rows.length < 2) {
                    alert('CSV file is empty or invalid.');
                    return;
                }
                
                const importedEntries = [];
                const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
                
                // Group by date
                const entriesByDate = {};
                
                for (let i = 1; i < rows.length; i++) {
                    const cols = rows[i].split(',').map(col => col.trim());
                    if (cols.length < 4) continue;
                    
                    const [date, time, type, value, ...notesParts] = cols;
                    const notes = notesParts.join(',').replace(/^"|"$/g, '');
                    
                    if (!entriesByDate[date]) {
                        entriesByDate[date] = {
                            date,
                            cravings: [],
                            smoked: [],
                            notes: notes || ''
                        };
                    }
                    
                    if (type.toLowerCase() === 'craving') {
                        entriesByDate[date].cravings.push({
                            time,
                            intensity: value.toLowerCase()
                        });
                    } else if (type.toLowerCase() === 'smoked') {
                        entriesByDate[date].smoked.push({
                            time,
                            count: parseInt(value) || 1
                        });
                    }
                    
                    // Update notes if provided
                    if (notes && !entriesByDate[date].notes) {
                        entriesByDate[date].notes = notes;
                    }
                }
                
                // Convert to array and sort
                const importedEntriesArray = Object.values(entriesByDate);
                importedEntriesArray.sort((a, b) => this.compareDates(b.date, a.date));
                
                if (confirm(`Import ${importedEntriesArray.length} days of data? This will replace your current data.`)) {
                    this.entries = importedEntriesArray;
                    localStorage.setItem('ashless_v2_entries', JSON.stringify(this.entries));
                    this.loadEntries();
                    this.closeImportModal();
                    alert('Data imported successfully!');
                }
            } catch (error) {
                alert('Error reading CSV file. Please check the format.');
                console.error(error);
            }
        };
        
        reader.readAsText(file);
    }
    
    // Helper functions
    adjustNumber(event) {
        const button = event.target.closest('.number-btn');
        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);
        const isPlus = button.classList.contains('plus');
        
        let value = parseInt(input.value) || 0;
        value = isPlus ? value + 1 : Math.max(1, value - 1);
        input.value = value;
        
        // Trigger validation
        if (targetId === 'cigaretteCount') {
            this.checkSmokeSaveButton();
        }
    }
    
    updateCurrencyPreview() {
        const selectedCurrency = this.currencyInput.value;
        this.currencySymbolElement.textContent = selectedCurrency;
    }
    
    handleOutsideClick(event) {
        const modals = [
            this.settingsModal, this.createTodayModal, this.addCravingModal,
            this.addSmokeModal, this.infoModal, this.editDayModal,
            this.chartModal, this.aboutModal, this.importModal
        ];
        
        modals.forEach(modal => {
            if (event.target === modal) {
                switch(modal) {
                    case this.settingsModal:
                        // Don't allow closing settings modal without saving
                        break;
                    case this.addCravingModal:
                        this.closeAddCravingModal();
                        break;
                    case this.addSmokeModal:
                        this.closeAddSmokeModal();
                        break;
                    case this.infoModal:
                        this.closeInfoModal();
                        break;
                    case this.editDayModal:
                        this.closeEditDayModal();
                        break;
                    case this.chartModal:
                        this.closeChartModal();
                        break;
                    case this.aboutModal:
                        this.closeAboutModal();
                        break;
                    case this.importModal:
                        this.closeImportModal();
                        break;
                }
            }
        });
    }
    
    closeChartModal() {
        this.chartModal.style.display = 'none';
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
    
    closeAboutModal() {
        this.aboutModal.style.display = 'none';
    }
}

// Initialize the tracker when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new AshlessTrackerV2();
});