const formatTime = time => {
    if (time.length > 4) {
        time = time.slice(-4);
    }
    if (time.length !== 4) {
        throw new Error('Invalid time');
    }

    let hours = parseInt(time.slice(0, 2), 10);
    const minutes = time.slice(2, 4);

    let addon = '';

    // Check if hours exceed 24
    if (hours >= 24) {
        hours = hours - 24;
        addon = ' (next day)';
    }

    // Format hours and minutes
    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${minutes}${addon}`;
};

export default formatTime;