const {Reservation} = require("../models/Reservation");
const { isTimeGreater } = require("./timeUtill");

const countUserReservationByUserEmail = async(userEmail) => {
    try {
        const count = await Reservation.countDocuments({ reserver_email: userEmail });
        return count;
    } catch (error) {
        console.error("Error counting user reservations:", error);
        throw new Error("Error counting user reservations");
    }
}

const checkReservationTime  = (startTime,endTime,massageShop) =>{
    return (isTimeGreater(startTime,massageShop.open_time) && isTimeGreater(massageShop.close_time,endTime));
}

module.exports = {countUserReservationByUserEmail , checkReservationTime};