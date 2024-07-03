import mongoose from 'mongoose';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { format } from 'date-fns';
import User from '../models/UserModel.js';

describe('MongoDB Tests', () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a user in MongoDB', async () => {
    const user = new User({ email: 'test@example.com', password: 'password', dateOfBirth: format(Date('19-6-1989'), 'd-M-yyyy') });
    const savedUser = await user.save();
    expect(savedUser.email).to.equal('test@example.com');
  });

  it('should find a user in MongoDB', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user.email).to.equal('test@example.com');
  });
});
