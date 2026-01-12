// 予約データの取得
let bookings = JSON.parse(localStorage.getItem('scheduleBookings')) || {};

// DOM要素
const bookingsList = document.getElementById('bookingsList');
const noBookings = document.getElementById('noBookings');

// 日付キーを日付オブジェクトに変換してソート
function parseDateKey(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// 時間を数値に変換（ソート用）
function parseTime(time) {
    return parseInt(time.replace('時', ''));
}

// 予約一覧の表示
function renderBookingsList() {
    bookingsList.innerHTML = '';
    
    // すべての予約を配列に変換
    const allBookings = [];
    
    for (const dateKey in bookings) {
        const dateBookings = bookings[dateKey];
        for (const time in dateBookings) {
            const booking = dateBookings[time];
            allBookings.push({
                dateKey: dateKey,
                time: time,
                ...booking
            });
        }
    }
    
    // 日付と時間でソート
    allBookings.sort((a, b) => {
        const dateA = parseDateKey(a.dateKey);
        const dateB = parseDateKey(b.dateKey);
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA - dateB;
        }
        return parseTime(a.time) - parseTime(b.time);
    });
    
    if (allBookings.length === 0) {
        noBookings.style.display = 'block';
        bookingsList.style.display = 'none';
        return;
    }
    
    noBookings.style.display = 'none';
    bookingsList.style.display = 'block';
    
    // 予約を表示
    allBookings.forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.className = 'booking-item';
        
        const date = parseDateKey(booking.dateKey);
        const dateStr = `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;
        const typeIcon = booking.type === 'group' ? '👥' : '👤';
        const typeText = booking.type === 'group' ? 'グループ' : '1on1';
        
        bookingItem.innerHTML = `
            <div class="booking-date-time">
                <div class="booking-date">${dateStr}</div>
                <div class="booking-time">${booking.time}</div>
            </div>
            <div class="booking-info">
                <div class="booking-name">${booking.name || '予約名なし'}</div>
                <div class="booking-type">${typeIcon} ${typeText}</div>
                ${booking.note ? `<div class="booking-note">${booking.note}</div>` : ''}
            </div>
            <button class="btn-delete" data-date="${booking.dateKey}" data-time="${booking.time}">削除</button>
        `;
        
        // 削除ボタンのイベント
        const deleteBtn = bookingItem.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => {
            if (confirm('この予約を削除しますか？')) {
                deleteBooking(booking.dateKey, booking.time);
            }
        });
        
        bookingsList.appendChild(bookingItem);
    });
}

// 予約を削除
function deleteBooking(dateKey, time) {
    if (bookings[dateKey] && bookings[dateKey][time]) {
        delete bookings[dateKey][time];
        
        // その日の予約がなくなったら、日付キーも削除
        if (Object.keys(bookings[dateKey]).length === 0) {
            delete bookings[dateKey];
        }
        
        localStorage.setItem('scheduleBookings', JSON.stringify(bookings));
        renderBookingsList();
    }
}

// 初期化
renderBookingsList();