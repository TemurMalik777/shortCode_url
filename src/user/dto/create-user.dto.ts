export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    isActive: boolean;
}
