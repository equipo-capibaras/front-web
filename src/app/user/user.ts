export class User {
  email: string;
  password: string;

  constructor(mail: string, password: string) {
    this.email = mail;
    this.password = password;
  }
}
