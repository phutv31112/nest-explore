import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCmtDto } from '../dto/create-cmt.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async getUserComments(userId: number) {
    const cmts = await this.prisma.comment.findMany({
      where: {
        userId,
      },
    });
    return cmts;
  }
  async createComment(userId: number, body: CreateCmtDto) {
    console.log('userId: ' + userId);
    const product = await this.prisma.product.findUnique({
      where: {
        id: Number(body.productId),
      },
    });
    if (!product) {
      throw new NotFoundException('product is not exist');
    }
    const cmt = await this.prisma.comment.create({
      data: {
        userId,
        productId: body.productId,
        content: body.content,
      },
    });
    return {
      comment: cmt,
    };
  }
  async deleteAllComment(userId: number) {
    await this.prisma.comment.deleteMany({
      where: {
        userId,
      },
    });
    return 'delete all comments!';
  }
  async deleteUserCmt(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        ordinalNumber: Number(id),
      },
    });
    console.log('comment:--dle', comment);
    // const cmt = await this.prisma.comment.delete({
    //   where: {
    //     id: Number(id),
    //   },
    // });
    // if (!cmt) {
    //   throw new NotFoundException('comment is not exist');
    // }
    return 'delete comment successfully';
  }
  async updateComment(id: number, content: string) {
    const cmt = await this.prisma.comment.update({
      where: {
        ordinalNumber: Number(id),
      },
      data: {
        content,
      },
    });
    if (!cmt) {
      throw new NotFoundException('comment is not exist');
    }
    return 'update comment successfully';
  }
}
