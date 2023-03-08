import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: string, attr: Partial<User>) {
    const user = await this.repo.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found!');

    Object.assign(user, attr);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.repo.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found!');

    return this.repo.remove(user);
  }
}
