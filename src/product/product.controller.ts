import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Post('create-product')
  createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }
  @Get('get-product/:id')
  getproductById(@Param('id') id: number) {
    return this.productService.getproductById(id);
  }
  @Get('get-all-products')
  getAllProduct() {
    return this.productService.getAllProduct();
  }
  @Delete('delete-product/:id')
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
