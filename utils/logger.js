module.exports = (log) => {
    const timeOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    
    return console.log(`${new Date().toLocaleDateString(undefined, timeOptions)} - ${log}`);
}