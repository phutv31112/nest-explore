import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async createProduct(body: CreateProductDto) {
    return await this.prisma.product.create({
      data: body,
    });
  }
  async getproductById(id: number): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return product;
  }
  async getAllProduct() {
    return await this.prisma.product.findMany();
  }
  async deleteProduct(id: number) {
    const product = await this.prisma.product.delete({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return 'Delete successfully';
  }
}
