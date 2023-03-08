import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    if (!email || !password) return null;

    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: string) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    if (!email) return null;
    return this.repo.find({ where: { email } });
  }

  async update(id: string, attr: Partial<User>) {
    if (!id) return null;

    const user = await this.repo.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found!');

    Object.assign(user, attr);
    return this.repo.save(user);
  }

  async remove(id: string) {
    if (!id) return null;

    const user = await this.repo.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found!');

    return this.repo.remove(user);
  }
}
