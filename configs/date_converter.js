var dateY = new Date().toISOString().split('T')[0].split('-')[0]
var dateM = new Date().toISOString().split('T')[0].split('-')[1]
var dateD = new Date().toISOString().split('T')[0].split('-')[2]
var dateFull = new Date().toISOString().split('T')[0]

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', { month: 'long' });
}

module.exports = `${dateY}-${getMonthName(dateM)}-${dateD}`