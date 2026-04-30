import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, TypeORMError } from 'typeorm';
import { Student } from '../entities/student.entity';
import {
  CannotCreateResourceError,
  EntityNotFoundError,
} from 'src/common/errors/errors';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(Student)
    private repository: Repository<Student>,
    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) {}

  async countStudents() {
    return this.repository.count().catch((err: TypeORMError) => {
      throw new Error(err.message);
    });
  }

  async findOneByStudentId(studentId: string) {
    return this.repository
      .findOne({
        where: {
          id: studentId,
        },
      })
      .catch(() =>
        //error
        {
          //can push error object into error constructor for detailed logs
          throw new EntityNotFoundError('student', studentId);
        },
      );
  }

  async createStudent(student: Student) {
    return this.repository.save(student).catch(() => {
      throw new CannotCreateResourceError();
    });
  }

  async getAllStudents() {
    return this.repository.findAndCount().catch((err: TypeORMError) => {
      throw new Error(err.message);
    });
  }
}
