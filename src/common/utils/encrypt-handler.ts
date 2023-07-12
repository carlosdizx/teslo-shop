import * as bcrypt from "bcryptjs";

export default class EncryptUtil {
  private readonly saltRounds = 10;
  public encryptPassword = async (password: string) =>
    await bcrypt.hash(password, this.saltRounds);

  public validatePassword = async (password: string, hashedPassword: string) =>
    await bcrypt.compare(password, hashedPassword);
}
