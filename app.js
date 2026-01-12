// 予定データの管理
let bookings = JSON.parse(localStorage.getItem('scheduleBookings')) || {};
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

// 利用可能な時間帯の定義
function getAvailableTimeSlots(dateKey) {
    // 1/14, 1/18, 1/20, 1/27 12:00（12時のみ）
    const availableDates = ['2026-01-14', '2026-01-18', '2026-01-20', '2026-01-27'];
    if (availableDates.includes(dateKey)) {
        return ['12時'];
    }
    // それ以外の日は利用不可
    return [];
}

// 日付ごとのデフォルト予約タイプを取得
function getDefaultBookingType(dateKey) {
    // 1/14, 1/18: 1on1
    if (dateKey === '2026-01-14' || dateKey === '2026-01-18') {
        return '1on1';
    }
    // 1/20, 1/27: グループ
    if (dateKey === '2026-01-20' || dateKey === '2026-01-27') {
        return 'group';
    }
    return null;
}

// 時間スロットが利用可能かチェック
function isTimeSlotAvailable(dateKey, time) {
    const availableSlots = getAvailableTimeSlots(dateKey);
    return availableSlots.includes(time);
}

// DOM要素
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalTime = document.getElementById('modalTime');
const bookingName = document.getElementById('bookingName');
const saveBookingBtn = document.getElementById('saveBooking');
const deleteBookingBtn = document.getElementById('deleteBooking');
const cancelBookingBtn = document.getElementById('cancelBooking');

// 時間スロットの定義
const timeSlots = ['12時', '13時', '14時', '15時', '16時', '17時', '18時'];

// カレンダーの描画
function renderCalendar() {
    calendarGrid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 月のタイトルを更新
    currentMonthElement.textContent = `${year}年 ${month + 1}月`;
    
    // 月の最初の日と最後の日を取得
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // 前月の最後の数日を表示
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const dateKey = formatDateKey(year, month - 1, day);
        createDayElement(year, month - 1, day, true, dateKey);
    }
    
    // 今月の日付を表示
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = formatDateKey(year, month, day);
        createDayElement(year, month, day, false, dateKey);
    }
    
    // 次月の最初の数日を表示（カレンダーを埋めるため）
    const remainingDays = 42 - (startingDayOfWeek + daysInMonth);
    for (let day = 1; day <= remainingDays; day++) {
        const dateKey = formatDateKey(year, month + 1, day);
        createDayElement(year, month + 1, day, true, dateKey);
    }
}

// 日付要素の作成
function createDayElement(year, month, day, isOtherMonth, dateKey) {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${isOtherMonth ? 'other-month' : ''}`;
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    
    // 日付ごとのタイプに応じてアイコンを表示
    const defaultType = getDefaultBookingType(dateKey);
    if (defaultType) {
        const typeIcon = document.createElement('span');
        typeIcon.className = 'day-type-icon';
        typeIcon.textContent = defaultType === '1on1' ? '👤' : '👥';
        typeIcon.title = defaultType === '1on1' ? '1on1枠' : 'グループ枠';
        dayNumber.appendChild(typeIcon);
        
        // タイプに応じてクラスを追加
        if (defaultType === '1on1') {
            dayElement.classList.add('day-1on1');
        } else {
            dayElement.classList.add('day-group');
        }
    }
    
    dayElement.appendChild(dayNumber);
    
    // この日の予約を取得
    const dayBookings = bookings[dateKey] || {};
    
    // 時間スロットを表示
    timeSlots.forEach(time => {
        const booking = dayBookings[time];
        const isAvailable = isTimeSlotAvailable(dateKey, time);
        
        // 利用不可で予約もない場合は表示しない（空白）
        if (!isAvailable && !booking) {
            return;
        }
        
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = time;
        
        if (booking) {
            // 予約がある場合
            timeSlot.classList.add('booked');
            timeSlot.title = `${booking.name || '予約あり'} - ${booking.type === 'group' ? '👥 グループ' : '👤 1on1'}`;
        } else if (isAvailable) {
            // 利用可能な時間帯
            timeSlot.classList.add('available');
            // デフォルトタイプに応じてクラスを追加
            const defaultType = getDefaultBookingType(dateKey);
            if (defaultType === '1on1') {
                timeSlot.classList.add('slot-1on1');
                timeSlot.textContent = `👤 ${time}`;
            } else if (defaultType === 'group') {
                timeSlot.classList.add('slot-group');
                timeSlot.textContent = `👥 ${time}`;
            }
        }
        
        timeSlot.addEventListener('click', () => {
            // 利用可能な時間帯、または予約済みの時間帯（編集・削除用）をクリック可能
            if (isAvailable || booking) {
                openBookingModal(dateKey, time, booking);
            }
        });
        
        dayElement.appendChild(timeSlot);
    });
    
    calendarGrid.appendChild(dayElement);
}

// 日付キーのフォーマット（YYYY-MM-DD）
function formatDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// 予約モーダルを開く
function openBookingModal(dateKey, time, existingBooking = null) {
    selectedDate = dateKey;
    selectedTime = time;
    
    const date = new Date(dateKey);
    const dateStr = `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;
    
    modalDate.textContent = dateStr;
    modalTime.textContent = time;
    
    if (existingBooking) {
        modalTitle.textContent = '予約を編集';
        bookingName.value = existingBooking.name || '';
        deleteBookingBtn.style.display = 'block';
    } else {
        modalTitle.textContent = '予約を設定';
        bookingName.value = '';
        deleteBookingBtn.style.display = 'none';
    }
    
    bookingModal.classList.add('show');
}

// 予約モーダルを閉じる
function closeBookingModal() {
    bookingModal.classList.remove('show');
    selectedDate = null;
    selectedTime = null;
}

// 予約を保存
function saveBooking() {
    if (!selectedDate || !selectedTime) return;
    
    const name = bookingName.value.trim();
    if (!name) {
        alert('予約名を入力してください');
        return;
    }
    
    if (!bookings[selectedDate]) {
        bookings[selectedDate] = {};
    }
    
    // デフォルトタイプを自動設定
    const defaultType = getDefaultBookingType(selectedDate) || 'group';
    
    // 予約を保存する際は自動的に予約済みにする
    bookings[selectedDate][selectedTime] = {
        name: name,
        type: defaultType,
        status: 'booked' // 埋まったら自動的に予約済み
    };
    
    localStorage.setItem('scheduleBookings', JSON.stringify(bookings));
    renderCalendar();
    closeBookingModal();
}

// 予約を削除
function deleteBooking() {
    if (!selectedDate || !selectedTime) return;
    
    if (bookings[selectedDate] && bookings[selectedDate][selectedTime]) {
        delete bookings[selectedDate][selectedTime];
        
        // その日の予約がなくなったら、日付キーも削除
        if (Object.keys(bookings[selectedDate]).length === 0) {
            delete bookings[selectedDate];
        }
        
        localStorage.setItem('scheduleBookings', JSON.stringify(bookings));
        renderCalendar();
        closeBookingModal();
    }
}

// 前の月に移動
function goToPrevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// 次の月に移動
function goToNextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// イベントリスナー
prevMonthBtn.addEventListener('click', goToPrevMonth);
nextMonthBtn.addEventListener('click', goToNextMonth);
closeModal.addEventListener('click', closeBookingModal);
cancelBookingBtn.addEventListener('click', closeBookingModal);
saveBookingBtn.addEventListener('click', saveBooking);
deleteBookingBtn.addEventListener('click', deleteBooking);

// モーダルの外側をクリックしたら閉じる
bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        closeBookingModal();
    }
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('show')) {
        closeBookingModal();
    }
});

// 初期化
renderCalendar();