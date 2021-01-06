export class CreateUserDto {
  name: string;
  phone: string;
  email?: string;
}

export class UpdateUserDto {
  name?: string;
  phone?: string;
  email?: string;
}
