import { UserInfo, Quastion, Comment } from './mainClasses';

describe('UserInfo', () => {
    it('should create an instance of UserInfo', () => {
        expect(new UserInfo()).toBeTruthy();
    });
    it('should accept values', () => {
        let userInfo = new UserInfo();
        userInfo = {
            id: 1,
            uid: '121212321123',
            role: 'Admin',
            name: 'Ivan',
            email: 'qwerty@qwerty.ru',
            photoUrl: 'http://',
        };
        expect(userInfo.id).toEqual(1);
        expect(userInfo.uid).toEqual('121212321123');
        expect(userInfo.role).toEqual('Admin');
        expect(userInfo.name).toEqual('Ivan');
        expect(userInfo.email).toEqual('qwerty@qwerty.ru');
        expect(userInfo.photoUrl).toEqual('http://');

    });
});
/*
describe('Quastion', () => {
  it('should create an instance of Quastion', () => {
      expect(new Quastion()).toBeTruthy();
  });
});
describe('Comment', () => {
  it('should create an instance of Comment', () => {
      expect(new Comment()).toBeTruthy();
  });
});
*/