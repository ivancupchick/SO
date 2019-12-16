export class UserInfo {
  constructor(
      public uid: string = '',
      public id: number = 0,
      public role: string = 'User',
      public name: string = 'Anonymous',
      public email: string = '',
      public photoUrl: string = 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      public deleted: boolean = false
    ) { }
}

export class Quastion {
  constructor(
      public approved: boolean = false,
      public id: number = 0,
      public title: string,
      public description: string,
      public author: string,
      public dateOfCreation: number,
      public answerID: number,
      public tags?: string[],
      public deleted: boolean = false
    ) { }
}

export class Comment {
  constructor(
    public id: number = 0,
    public quastionId: number,
    public description: string,
    public author: string,
    public dateOfCreation: number,
    public deleted: boolean = false
  ) { }
}
