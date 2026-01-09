
import passport from 'passport';
import  { IStrategyOptions, Strategy as LocalStrategy, VerifyFunction } from 'passport-local';

import { UserModel } from '../models';
import container from '../container';
import { UsersRepository } from '../repositories';

const repo = container.get(UsersRepository);

const verify: VerifyFunction =  async (username, password, done) => {
  
  try {
    const user = await repo.getUser(username);

    if(!user){
      return done(null, false);
    }

    if(user.password !== password){
      return done(null, false);
    }

    return done(null, { id: user.id, username: user.username });
  } catch (error) {
   return done(error) 
  }
}

const options: IStrategyOptions = {
  usernameField: "username",
  passwordField: "password"
}

passport.use('local', new  LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
  cb(null, user.id);
})

passport.deserializeUser(async (id: string, cb) => {
  try {
    const user = await repo.getUserById(id);

    return cb(null, { id: user.id, username: user.username });
  } catch (error) {
    return cb(error);
  }
})

export default passport;
