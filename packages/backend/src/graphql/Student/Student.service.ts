import { Injectable } from '@nestjs/common';

import type { Student } from '@/generated/types';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<Student | null> {
    const student = await this.prismaService.student.findFirstOrThrow({
      where: { id },
    });

    if (!student.classRoomId) {
      throw new Error('ClassRoom not found');
    }

    const classRoom = await this.prismaService.classRoom.findFirstOrThrow({
      where: { id: student.classRoomId },
    });

    return {
      id: student.id,
      name: student.name,
      classRoom,
      staffName: classRoom.staffName,
      studentNumber: student.studentNumber,
      selectedClassIds: student.selectedClassIds,
      hasManagerRole: student.hasManagerRole,
    };
  }
}