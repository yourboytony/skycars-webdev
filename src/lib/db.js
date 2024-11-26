import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 10;

export class DB {
  constructor(env) {
    this.env = env;
  }

  // User Management
  async createUser({ email, password, name, role = 'user' }) {
    const hashedPassword = await hash(password, SALT_ROUNDS);
    
    const { success, error } = await this.env.DB.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `)
    .bind(email, hashedPassword, name, role)
    .run();

    if (!success) throw new Error(error || 'Failed to create user');
    return { email, name, role };
  }

  async getUserByEmail(email) {
    const user = await this.env.DB.prepare(`
      SELECT * FROM users WHERE email = ?
    `)
    .bind(email)
    .first();
    
    return user;
  }

  async validatePassword(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) return false;
    return compare(password, user.password);
  }

  async updateUser(email, updates) {
    const setFields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');

    const { success, error } = await this.env.DB.prepare(`
      UPDATE users 
      SET ${setFields}
      WHERE email = ?
    `)
    .bind(...Object.values(updates), email)
    .run();

    if (!success) throw new Error(error || 'Failed to update user');
  }

  // Car Management
  async createCar({ make, model, year, price, description, imageUrl }) {
    const { success, error } = await this.env.DB.prepare(`
      INSERT INTO cars (make, model, year, price, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind(make, model, year, price, description, imageUrl)
    .run();

    if (!success) throw new Error(error || 'Failed to create car listing');
  }

  async getCars({ limit = 10, offset = 0, search = '' }) {
    let query = `
      SELECT * FROM cars
      WHERE make LIKE ? OR model LIKE ? OR description LIKE ?
      LIMIT ? OFFSET ?
    `;

    const searchTerm = `%${search}%`;
    
    const cars = await this.env.DB.prepare(query)
      .bind(searchTerm, searchTerm, searchTerm, limit, offset)
      .all();

    return cars?.results || [];
  }

  async getCarById(id) {
    const car = await this.env.DB.prepare(`
      SELECT * FROM cars WHERE id = ?
    `)
    .bind(id)
    .first();

    return car;
  }

  async updateCar(id, updates) {
    const setFields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');

    const { success, error } = await this.env.DB.prepare(`
      UPDATE cars 
      SET ${setFields}
      WHERE id = ?
    `)
    .bind(...Object.values(updates), id)
    .run();

    if (!success) throw new Error(error || 'Failed to update car');
  }

  async deleteCar(id) {
    const { success, error } = await this.env.DB.prepare(`
      DELETE FROM cars WHERE id = ?
    `)
    .bind(id)
    .run();

    if (!success) throw new Error(error || 'Failed to delete car');
  }

  // Booking Management
  async createBooking({ carId, userId, startDate, endDate, status = 'pending' }) {
    const { success, error } = await this.env.DB.prepare(`
      INSERT INTO bookings (car_id, user_id, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?)
    `)
    .bind(carId, userId, startDate, endDate, status)
    .run();

    if (!success) throw new Error(error || 'Failed to create booking');
  }

  async getBookingsByUser(userId) {
    const bookings = await this.env.DB.prepare(`
      SELECT b.*, c.make, c.model, c.year
      FROM bookings b
      JOIN cars c ON b.car_id = c.id
      WHERE b.user_id = ?
    `)
    .bind(userId)
    .all();

    return bookings?.results || [];
  }

  async updateBookingStatus(bookingId, status) {
    const { success, error } = await this.env.DB.prepare(`
      UPDATE bookings 
      SET status = ?
      WHERE id = ?
    `)
    .bind(status, bookingId)
    .run();

    if (!success) throw new Error(error || 'Failed to update booking status');
  }
}

// Export a factory function to create DB instances
export const createDB = (env) => new DB(env); 