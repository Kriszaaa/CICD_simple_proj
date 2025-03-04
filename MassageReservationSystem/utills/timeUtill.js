
// return true if time1 is greater than time2
const isTimeGreater = (time1, time2)  => {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const date1 = new Date(2000, 0, 1, hours1, minutes1);
    const date2 = new Date(2000, 0, 1, hours2, minutes2);

    return date1 >= date2; 
}

// check Time format in "HH-MM"
const checkTimeFormat = (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
    return regex.test(time);
}



module.exports = {isTimeGreater , checkTimeFormat};