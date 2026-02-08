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
        
        // Settings elements
        this.currencyInput = document.getElementById('currency');
        this.cigarettePriceInput = document.getElementById('cigarettePrice');
        this.timezoneInput = document.getElementById('timezone');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.currencySymbolElement = document.getElementById('currencySymbol');
        this.settingsTitle = document.getElementById('settingsTitle');
        
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
        this.cravingHH.addEventListener('input', (e) => this.handleTimeInput(e, this.cravingHH, this.cravingMM));
        this.cravingMM.addEventListener('input', (e) => this.handleTimeInput(e, this.cravingHH, this.cravingMM));
        
        // Add smoke modal
        document.querySelector('.close-smoke').addEventListener('click', () => this.closeAddSmokeModal());
        this.saveSmokeBtn.addEventListener('click', () => this.saveSmoke());
        this.smokeHH.addEventListener('input', (e) => this.handleTimeInput(e, this.smokeHH, this.smokeMM));
        this.smokeMM.addEventListener('input', (e) => this.handleTimeInput(e, this.smokeHH, this.smokeMM));
        
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
        
        if (!this.settings) {
            // First time setup
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
        } else {
            // Update only price
            this.settings.cigarettePrice = price;
            localStorage.setItem('ashless_v2_settings', JSON.stringify(this.settings));
            
            alert('Price updated successfully! New entries will use this price.');
            this.settingsModal.style.display = 'none';
        }
    }
    
    updateCurrencyPreview() {
        const selectedCurrency = this.currencyInput.value;
        this.currencySymbolElement.textContent = selectedCurrency;
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
        
        // Find the oldest date (last in array since sorted newest first)
        const entriesCopy = [...this.entries];
        entriesCopy.sort((a, b) => this.compareDates(a.date, b.date)); // Sort oldest first
        const oldestEntry = entriesCopy[0];
        
        const [day, month, year] = oldestEntry.date.split('-').map(Number);
        
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
        
        this.entries.push(entry);
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
            return;
        }
        
        // Sort entries newest first
        this.entries.sort((a, b) => this.compareDates(b.date, a.date));
        
        this.entries.forEach((entry) => {
            const row = document.createElement('div');
            row.className = 'entry-row';
            
            const dateParts = this.formatDateForDisplay(entry.date);
            const cravingsCount = entry.cravings.length;
            const smokedCount = entry.smoked.reduce((sum, smoke) => sum + smoke.count, 0);
            
            // Calculate money spent with entry-specific prices
            const moneySpent = entry.smoked.reduce((sum, smoke) => {
                const price = smoke.pricePerCigarette || this.settings.cigarettePrice;
                return sum + (smoke.count * price);
            }, 0);
            
            row.innerHTML = `
                <div class="entry-cell date-cell">
                    <div class="date-day">${dateParts.day}</div>
                    <div class="date-month">${dateParts.month}</div>
                    <div class="date-year">${dateParts.year}</div>
                </div>
                <div class="entry-cell clickable-cell ${cravingsCount === 0 ? 'value-zero' : 'value-positive'}" 
                     data-date="${entry.date}" data-type="craving">
                    ${cravingsCount}
                </div>
                <div class="entry-cell clickable-cell ${smokedCount === 0 ? 'value-zero' : 'value-positive'}" 
                     data-date="${entry.date}" data-type="smoke">
                    ${smokedCount}
                </div>
                <div class="entry-cell ${smokedCount === 0 ? 'value-zero' : 'value-positive'}">
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
        
        // Add the "Add previous day" row
        this.addPreviousDayRow();
        
        // Attach event listeners to the new elements
        this.attachRowEventListeners();
    }
    
    addPreviousDayRow() {
        const addRow = document.createElement('div');
        addRow.className = 'add-previous-row';
        addRow.innerHTML = `
            <div class="add-previous-content">
                <button class="add-previous-btn">
                    <i class="fas fa-plus-circle"></i>
                </button>
                <span class="add-previous-text">Add entry for previous day</span>
            </div>
        `;
        
        this.entriesTable.appendChild(addRow);
        
        // Add help text row
        const helpRow = document.createElement('div');
        helpRow.className = 'help-row';
        helpRow.innerHTML = `
            <p>• Tap 😩 or 🚬 in a row to add craving/cigarette</p>
            <p>• Tap 𝒊 to view day's timeline & notes</p>
            <p>• Tap ⋮ to edit/delete entries</p>
        `;
        
        this.entriesTable.appendChild(helpRow);
        
        // Add event listener to the plus button
        addRow.querySelector('.add-previous-btn').addEventListener('click', () => this.addPreviousDay());
    }
    
    attachRowEventListeners() {
        // Craving cells
        document.querySelectorAll('.entry-cell[data-type="craving"]').forEach(cell => {
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
                const hhInput = type === 'craving' ? this.cravingHH : this.smokeHH;
                const mmInput = type === 'craving' ? this.cravingMM : this.smokeMM;
                
                if (defaultTime.minutes > 0 && targetTime.getDate() !== now.getDate()) {
                    // If crossing midnight, don't auto-fill (let user enter manually)
                    hhInput.value = '';
                    mmInput.value = '';
                } else {
                    hhInput.value = String(hours).padStart(2, '0');
                    mmInput.value = String(minutes).padStart(2, '0');
                }
                
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
    
    handleTimeInput(event, hhInput, mmInput) {
        // Get the input value
        let value = event.target.value.replace(/[^0-9]/g, '');
        
        // Limit to 2 digits
        if (value.length > 2) {
            value = value.slice(0, 2);
        }
        
        // Update the input
        event.target.value = value;
        
        // Auto-advance when 2 digits are entered
        if (value.length === 2 && event.target === hhInput) {
            mmInput.focus();
        }
        
        // Validate
        this.validateTimeInput(hhInput, mmInput);
        
        // Check save button based on which modal is open
        if (hhInput === this.cravingHH) {
            this.checkCravingSaveButton();
        } else if (hhInput === this.smokeHH) {
            this.checkSmokeSaveButton();
        }
    }
    
    validateTimeInput(hhInput, mmInput) {
        let hh = parseInt(hhInput.value) || 0;
        let mm = parseInt(mmInput.value) || 0;
        
        // Auto-correct invalid values
        if (hh < 0) hh = 0;
        if (hh > 23) hh = 23;
        if (mm < 0) mm = 0;
        if (mm > 59) mm = 59;
        
        // Update values with leading zeros
        if (hhInput.value) {
            hhInput.value = String(hh).padStart(2, '0');
        }
        if (mmInput.value) {
            mmInput.value = String(mm).padStart(2, '0');
        }
        
        // Add invalid class if empty or invalid
        if (!hhInput.value || hh < 0 || hh > 23) {
            hhInput.classList.add('invalid');
        } else {
            hhInput.classList.remove('invalid');
        }
        
        if (!mmInput.value || mm < 0 || mm > 59) {
            mmInput.classList.add('invalid');
        } else {
            mmInput.classList.remove('invalid');
        }
        
        return hhInput.value && mmInput.value && hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
    }
    
    checkCravingSaveButton() {
        const timeValid = this.validateTimeInput(this.cravingHH, this.cravingMM);
        const intensitySelected = document.querySelector('.intensity-btn.selected');
        this.saveCravingBtn.disabled = !(timeValid && intensitySelected);
    }
    
    checkSmokeSaveButton() {
        const timeValid = this.validateTimeInput(this.smokeHH, this.smokeMM);
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
        this.smokeHH.addEventListener('input', (e) => this.handleTimeInput(e, this.smokeHH, this.smokeMM));
        this.smokeMM.addEventListener('input', (e) => this.handleTimeInput(e, this.smokeHH, this.smokeMM));
        
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
        
        // Add smoke to entry with current price
        this.entries[entryIndex].smoked.push({
            time,
            count,
            pricePerCigarette: this.settings.cigarettePrice
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
            const cravingEl = this.createCravingEditItem(craving, index + 1);
            this.cravingsList.appendChild(cravingEl);
        });
    }
    
    createCravingEditItem(craving, number) {
        const cravingEl = document.createElement('div');
        cravingEl.className = 'edit-item';
        cravingEl.innerHTML = `
            <input type="checkbox" class="edit-checkbox craving-checkbox" data-index="${number - 1}">
            <span>${number}.</span>
            <div class="edit-time-input">
                <input type="number" pattern="[0-9]*" inputmode="numeric" class="edit-hh" value="${craving.time.split(':')[0]}" maxlength="2" placeholder="HH">
                <span>:</span>
                <input type="number" pattern="[0-9]*" inputmode="numeric" class="edit-mm" value="${craving.time.split(':')[1]}" maxlength="2" placeholder="MM">
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
        const checkbox = cravingEl.querySelector('.edit-checkbox');
        
        hhInput.addEventListener('input', (e) => this.handleTimeInput(e, hhInput, mmInput));
        mmInput.addEventListener('input', (e) => this.handleTimeInput(e, hhInput, mmInput));
        
        intensityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                intensityBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
        
        checkbox.addEventListener('change', () => this.updateDeleteButtonsState());
        
        return cravingEl;
    }
    
    displaySmokedForEdit(smoked) {
        this.smokedList.innerHTML = '';
        
        smoked.forEach((smoke, index) => {
            const smokeEl = this.createSmokeEditItem(smoke, index + 1);
            this.smokedList.appendChild(smokeEl);
        });
    }
    
    createSmokeEditItem(smoke, number) {
        const smokeEl = document.createElement('div');
        smokeEl.className = 'edit-item';
        smokeEl.innerHTML = `
            <input type="checkbox" class="edit-checkbox smoke-checkbox" data-index="${number - 1}">
            <span>${number}.</span>
            <div class="edit-time-input">
                <input type="number" pattern="[0-9]*" inputmode="numeric" class="edit-hh" value="${smoke.time.split(':')[0]}" maxlength="2" placeholder="HH">
                <span>:</span>
                <input type="number" pattern="[0-9]*" inputmode="numeric" class="edit-mm" value="${smoke.time.split(':')[1]}" maxlength="2" placeholder="MM">
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
        const checkbox = smokeEl.querySelector('.edit-checkbox');
        
        hhInput.addEventListener('input', (e) => this.handleTimeInput(e, hhInput, mmInput));
        mmInput.addEventListener('input', (e) => this.handleTimeInput(e, hhInput, mmInput));
        
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
        
        checkbox.addEventListener('change', () => this.updateDeleteButtonsState());
        
        return smokeEl;
    }
    
    addEmptyCravingEdit() {
        const currentCount = this.cravingsList.querySelectorAll('.edit-item').length + 1;
        const emptyCraving = { time: '', intensity: '' };
        const cravingEl = this.createCravingEditItem(emptyCraving, currentCount);
        this.cravingsList.appendChild(cravingEl);
    }
    
    addEmptySmokeEdit() {
        const currentCount = this.smokedList.querySelectorAll('.edit-item').length + 1;
        const emptySmoke = { time: '', count: 1 };
        const smokeEl = this.createSmokeEditItem(emptySmoke, currentCount);
        this.smokedList.appendChild(smokeEl);
    }
    
    deleteSelectedCravings() {
        const checkboxes = document.querySelectorAll('.craving-checkbox:checked');
        const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        
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
        indices.sort((a, b) => b - a).forEach(index => {
            if (index >= 0 && index < this.entries[entryIndex].cravings.length) {
                this.entries[entryIndex].cravings.splice(index, 1);
            }
        });
        
        // Re-display cravings
        this.displayCravingsForEdit(this.entries[entryIndex].cravings);
        this.updateDeleteButtonsState();
    }
    
    deleteSelectedSmoked() {
        const checkboxes = document.querySelectorAll('.smoke-checkbox:checked');
        const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        
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
        indices.sort((a, b) => b - a).forEach(index => {
            if (index >= 0 && index < this.entries[entryIndex].smoked.length) {
                this.entries[entryIndex].smoked.splice(index, 1);
            }
        });
        
        // Re-display smoked
        this.displaySmokedForEdit(this.entries[entryIndex].smoked);
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
                    // Keep original price for existing entries, use current for new ones
                    const originalIndex = parseInt(item.querySelector('.edit-checkbox').dataset.index);
                    let pricePerCigarette = this.settings.cigarettePrice;
                    
                    if (originalIndex >= 0 && originalIndex < this.entries[entryIndex].smoked.length) {
                        pricePerCigarette = this.entries[entryIndex].smoked[originalIndex].pricePerCigarette || this.settings.cigarettePrice;
                    }
                    
                    updatedSmoked.push({ time, count, pricePerCigarette });
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
            // Show settings with only price editable
            this.updateSettingsInputs();
            this.settingsModal.style.display = 'block';
            
            // Disable currency and timezone, enable price
            this.currencyInput.disabled = true;
            this.timezoneInput.disabled = true;
            this.cigarettePriceInput.disabled = false;
            
            // Update modal title and help text
            this.settingsTitle.textContent = 'Settings (Price only)';
            
            const helpTexts = document.querySelectorAll('#settingsModal .help-text');
            helpTexts[0].textContent = 'Currency cannot be changed';
            helpTexts[1].textContent = 'Update price for new entries';
            
            // Remove existing price note if any
            const existingNote = document.querySelector('#settingsModal .price-note');
            if (existingNote) existingNote.remove();
            
            // Add a note about existing entries
            const note = document.createElement('p');
            note.className = 'help-text price-note';
            note.textContent = 'Note: Existing entries will keep their original price';
            note.style.color = 'var(--accent-color)';
            note.style.marginTop = '10px';
            this.settingsModal.querySelector('.settings-body').appendChild(note);
        }
        this.closeMenu();
    }
    
    updateSettingsInputs() {
        if (this.settings) {
            this.currencyInput.value = this.settings.currency;
            this.cigarettePriceInput.value = this.settings.cigarettePrice;
            this.timezoneInput.value = this.settings.timezone;
            this.updateCurrencyPreview();
        }
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
        const totalMoney = filteredEntries.reduce((sum, entry) => {
            return sum + entry.smoked.reduce((entrySum, smoke) => {
                const price = smoke.pricePerCigarette || this.settings.cigarettePrice;
                return entrySum + (smoke.count * price);
            }, 0);
        }, 0);
        
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
                        x: entryIndex + timeDecimal / 24,
                        y: entry.cravings.length,
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
        
        const headers = ['Date', 'Time', 'Type', 'Intensity/Count', 'PricePerCigarette', 'Notes'];
        const csvRows = [headers.join(',')];
        
        this.entries.forEach(entry => {
            // Export cravings
            entry.cravings.forEach(craving => {
                const row = [
                    entry.date,
                    craving.time,
                    'Craving',
                    craving.intensity,
                    '',
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
                    smoke.pricePerCigarette || this.settings.cigarettePrice,
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
                    
                    const [date, time, type, value, price, ...notesParts] = cols;
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
                            count: parseInt(value) || 1,
                            pricePerCigarette: parseFloat(price) || this.settings.cigarettePrice
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