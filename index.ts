interface RoomInterface {
    name: string;
    bookings: Array<Booking>;
    rate: number;
    discount: number;
}

class Room {

    name: string;
    bookings: Array<Booking>;
    rate: number;
    discount: number;

    constructor(room: RoomInterface){
        this.name = room.name; // string
        this.bookings = room.bookings; // array bookings objs
        this.rate = room.rate; // in cents
        this.discount = room.discount; // as percentage
    }

    isOccupied(date: Date): boolean{
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

    occupancyPercentage(startDate: Date, endDate: Date): number {
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

    static totalOccupancyPercentage(rooms: Array<Room>, startDate: Date, endDate: Date): number {
        // returns the total occupancy percentage across all rooms in the array

        if (!Array.isArray(rooms)) {
            throw new Error('Invalid parameter: rooms expected to be an array');
        }

        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            throw new Error('Invalid parameter: startDate and endDate expected to be dates');
        }
        
        let occupancy = 0;

        rooms.forEach(room => {
            occupancy += room.occupancyPercentage(startDate, endDate);
        })

        const percentageTotal = occupancy / rooms.length;
        
        return percentageTotal;
    }


    static availableRooms(rooms: Array<Room>, startDate: Date, endDate: Date): Array<Room> | string{
        // returns an array of all rooms in the array that are not occupied for the entire duration

        if (!Array.isArray(rooms)) {
            throw new Error('Invalid parameter: rooms expected to be an array');
        }

        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            throw new Error('Invalid parameter: startDate and endDate expected to be dates');
        }
        
        const roomsAvailable: Array<Room> = [];

        rooms.forEach(room => {
            if(room.occupancyPercentage(startDate, endDate) === 0){
                roomsAvailable.push(room)
            }
        });

        return roomsAvailable;
    }

}



interface BookingInterface {
    name: string;
    email: string;
    checkIn: Date;
    checkOut: Date;
    discount: number;
    room?: Room;
}

class Booking{
    name: string;
    email: string;
    checkIn: Date;
    checkOut: Date;
    discount: number;
    room?: Room;

    constructor(booking: BookingInterface){
        this.name = booking.name;
        this.email = booking.email;
        this.checkIn = booking.checkIn;
        this.checkOut = booking.checkOut;
        this.discount = booking.discount;
        this.room = booking.room;
    }

    getFee(): number {
        // Check if room is defined before trying to access its properties
        if (!this.room) {
            throw new Error("No room assigned to booking");
        }

        let totalDiscount = this.discount + this.room.discount;
        const discountedRate = this.room.rate * ((100 - totalDiscount) / 100);

        if (!Number.isInteger(discountedRate)) {
            throw new Error("Invalid parameter: discounted rate expected to be an integer");
        }

        return Math.floor(discountedRate);
    }
}

module.exports = { Room, Booking };