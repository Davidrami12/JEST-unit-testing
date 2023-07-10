const { Room, Booking } = require('./index');

// Tests for Rooms (isOccupied)
describe('ROOMS - Check occupancy rooms in a date', () => {

    test('Room date invalid parameter throws error', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/18/2023"), new Date("07/20/2023"), 30, {});
        const room1 = new Room("Room1", [booking1, booking2], 1000, 10);
        const checkDate = "07/23/2023";  // this is a string, not a date

        expect(() => room1.isOccupied(checkDate)).toThrowError("Invalid parameter: date expected");
    })

    test('Room occupied - not available', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/20/2023"), new Date("07/22/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/22/2023"), new Date("07/24/2023"), 30, {});
        const room1 = new Room("Room1", [booking1, booking2], 1000, 10);
        const checkDate = new Date("07/21/2023");

        expect(room1.isOccupied(checkDate)).toBeTruthy();
    })

    test('Room not occupied - is available', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/18/2023"), new Date("07/20/2023"), 30, {});
        const room1 = new Room("Room1", [booking1, booking2], 1000, 10);
        const checkDate = new Date("07/23/2023");

        expect(room1.isOccupied(checkDate)).toBeFalsy();
    })
})

// Tests for Rooms (occupancyPercentage)
describe('ROOMS - Percentage of days with occupancy', () => {
    test('0% occupancy for this room', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/18/2023"), new Date("07/20/2023"), 30, {});
        const room1 = new Room("Room1", [booking1, booking2], 1000, 10);
        const startDate = new Date("07/23/2023");
        const endDate = new Date('07/30/2023');

        expect(room1.occupancyPercentage(startDate, endDate)).toBe(0);
    })

    test('50% occupancy for this room', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/18/2023"), new Date("07/22/2023"), 30, {});
        const room1 = new Room("Room1", [booking1, booking2], 1000, 10);
        const startDate = new Date("07/16/2023");
        const endDate = new Date('07/29/2023');

        expect(room1.occupancyPercentage(startDate, endDate)).toBe(50);
    })

    test('100% occupancy for this room', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/18/2023"), new Date("07/22/2023"), 30, {});
        const room1 = new Room("Room1", [booking1, booking2], 1000, 10);
        const startDate = new Date("07/16/2023");
        const endDate = new Date('07/22/2023');

        expect(room1.occupancyPercentage(startDate, endDate)).toBe(100);
    })
    
})

// Tests for Rooms (totalOccupancyPercentage)
describe('ROOMS - Total occupancy percentage across all rooms', () => {
    test('0% total occupancy for these rooms', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/16/2023"), new Date("07/20/2023"), 30, {});
        const room1 = new Room("Room1", [booking1], 1000, 10);
        const room2 = new Room("Room2", [booking2], 1000, 10);
        const rooms = [room1, room2];
        const startDate = new Date("07/21/2023");
        const endDate = new Date("07/22/2023");

        expect(Room.totalOccupancyPercentage(rooms, startDate, endDate)).toEqual(0);
    })

    test('50% total occupancy for these rooms', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/16/2023"), new Date("07/20/2023"), 30, {});
        const room1 = new Room("Room1", [booking1], 1000, 10);
        const room2 = new Room("Room2", [booking2], 1000, 10);
        const rooms = [room1,room2]
        const starDate = new Date("07/19/2023");
        const endDate = new Date("07/20/2023");

        expect(Room.totalOccupancyPercentage(rooms, starDate, endDate)).toEqual(50);
    })

    test('100% total occupancy for these rooms', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/16/2023"), new Date("07/20/2023"), 30, {});
        const room1 = new Room("Room1", [booking1], 1000, 10);
        const room2 = new Room("Room2", [booking2], 1000, 10);
        const rooms = [room1, room2]
        const startDate = new Date("07/16/2023");
        const endDate = new Date("07/18/2023");

        expect(Room.totalOccupancyPercentage(rooms, startDate, endDate)).toEqual(100);
    })
    
})

// Tests for Room (availableRooms)
describe('ROOMS - Array with rooms not occupied', () => {
    test('Room1 occupied in respective dates', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/18/2023"), new Date("07/20/2023"), 30, {});
        const room1 = new Room("Room1", [booking1], 1000, 10);
        const room2 = new Room("Room2", [booking2], 1000, 10);
        const rooms = [room1, room2];
        const startDate = new Date("07/19/2023");
        const endDate = new Date("07/20/2023");

        expect(Room.availableRooms(rooms, startDate, endDate)).toEqual([room1]);
    })

    test('Room2 occupied in respective dates', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/18/2023"), new Date("07/20/2023"), 30, {});
        const room1 = new Room("Room1", [booking1], 1000, 10);
        const room2 = new Room("Room2", [booking2], 1000, 10);
        const rooms = [room1, room2];
        const startDate = new Date("07/16/2023");
        const endDate = new Date("07/17/2023");

        expect(Room.availableRooms(rooms, startDate, endDate)).toEqual([room2]);
    })

    test('No room occupied in respective dates', () => {
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 30, {});
        const booking2 = new Booking("Booking2", "admin@admin.com", new Date("07/18/2023"), new Date("07/20/2023"), 30, {});
        const room1 = new Room("Room1", [booking1], 1000, 10);
        const room2 = new Room("Room2", [booking2], 1000, 10);
        const rooms = []
        const startDate = new Date("07/16/2023");
        const endDate = new Date("07/20/2023");

        expect(Room.availableRooms(rooms, startDate, endDate)).toEqual([]);
    })
})



// Tests for Bookings (getFee)
describe('BOOKINGS - Total price', () => {

    test('Booking price type is integer', () => {
        const room1 = new Room("Room1", [], 1000, 40);
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 0, room1);
        room1.bookings.push(booking1)

        expect(typeof(booking1.getFee())).toBe("number");
    })

    test('Non-integer discounted rate throws error', () => {
        const room1 = new Room("Room1", [], "asd", "w24"); // This will yield a non-integer fee
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 0, room1);
        room1.bookings.push(booking1)

        // We expect getFee() to throw an error due to non-integer fee
        expect(() => booking1.getFee()).toThrow("Discounted rate is not an integer");
    })

    test('Booking price: 0', () => {
        const room1 = new Room("Room1", [], 0, 20);
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 0, room1);
        room1.bookings.push(booking1)

        expect(booking1.getFee()).toBe(0);
    })

    test('Booking price: 600', () => {
        const room1 = new Room("Room1", [], 800, 25);
        const booking1 = new Booking("Booking1", "admin@admin.com", new Date("07/16/2023"), new Date("07/18/2023"), 0, room1);
        room1.bookings.push(booking1)

        expect(booking1.getFee()).toBe(600);
    })

})