import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async addStudent(name: string, allergens: string[], parentId: string) {
    const student = new Student();
    student.name = name;
    student.allergens = allergens;
    student.parentId = parentId;

    return await this.studentRepository.createStudent(student);
  }

  async getStudentCount() {
    return await this.studentRepository.countStudents();
  }

  async findOneByStudentId(studentId: string) {
    return await this.studentRepository.findOneByStudentId(studentId);
  }

  async getAllStudents() {
    return await this.studentRepository.getAllStudents();
  }
}
