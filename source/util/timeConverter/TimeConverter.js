class TimeConverter {
    convertMinutesToHoursMinutes = (totalMinutes) => {
        return {
            hours: Math.floor(totalMinutes / 60),
            minutes: totalMinutes % 60
        }
    }

    getHoursMinutesDisplayText = (hours, minutes) => {
        return `${hours}h ${minutes}m`;
    }
}

module.exports = TimeConverter;