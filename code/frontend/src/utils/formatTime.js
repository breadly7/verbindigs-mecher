const formatTime = time => {
    if (time.length !== 4) {
        throw new Error('Time must be a four-digit string');
    }

    let hours = parseInt(time.slice(0, 2), 10);
    const minutes = time.slice(2, 4);

    // Check if hours exceed 24
    if (hours >= 24) {
        hours = hours - 24;
        return `00:${minutes} next day`;
    }

    // Format hours and minutes
    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${minutes}`;
};

export default formatTime;