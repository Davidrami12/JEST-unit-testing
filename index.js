class Room {
    constructor(name, bookings, rate, discount){
        this.name = name; // string
        this.bookings = bookings; // array bookings objs
        this.rate = rate; // in cents
        this.discount = discount; // as percentage
    }

    isOccupied(date){
        // returns false if not occupied, returns true if occupied
        if (!(date instanceof Date)) {
            throw new Error('Invalid parameter: date expected');
        }

        let occupied = false;
        
        this.bookings.forEach(booking => {
            if(date.getTime() >= booking.checkIn.getTime() && date.getTime() <= booking.checkOut.getTime()){
                occupied = true;
            }
        })

        return occupied;
    }

    occupancyPercentage(startDate, endDate) {
        // returns the percentage of days with occupancy within the range of dates provided
        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            throw new Error('Invalid parameter: startDate and endDate expected to be dates');
        }
        
        let day = (1000*3600*24);
        let daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / day) + 1;
        let occupied = [];
    
        for (let countDays = 0; startDate.getTime() + day * countDays <= endDate.getTime(); countDays++) {
            occupied.push(this.isOccupied(new Date(startDate.getTime() + countDays * day)));
        }
    
        let totalOccupied = occupied.filter((item) => item).length;
    
        return Math.floor((totalOccupied / daysDifference) * 100);
    } 

    static totalOccupancyPercentage(rooms, startDate, endDate){
        // returns the total occupancy percentage across all rooms in the array
        let occupancy = 0;
    
        rooms.forEach(room => {
            occupancy += room.occupancyPercentage(startDate, endDate);
        })
    
        const percentageTotal = occupancy / rooms.length;
        
        return percentageTotal;
    }

    static availableRooms(rooms, startDate, endDate){
        // returns an array of all rooms in the array that are not occupied for the entire duration
        const roomsAvailable = [];

        rooms.forEach(room => {
            if(room.occupancyPercentage(startDate, endDate) === 0){
                roomsAvailable.push(room)
            }
        });

        return roomsAvailable;
    }

}



class Booking{
    constructor(name, email, checkIn, checkOut, discount, room){
        this.name = name; // string
        this.email = email; // string
        this.checkIn = checkIn; // date
        this.checkOut = checkOut; // date
        this.discount = discount; // as percentage
        this.room = room; // room obj
    }

    getFee(){
        // returns the fee, including discounts on room and booking
        let totalDiscount = this.discount + this.room.discount;
        const discountedRate = this.room.rate * ((100 - totalDiscount) / 100);

        if (!Number.isInteger(discountedRate)) {
            throw new Error("Discounted rate is not an integer");
        }

        return Math.floor(discountedRate);

    }
}

module.exports = { Room, Booking } ;