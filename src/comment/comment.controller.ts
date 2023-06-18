import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from '../decorator/user.decorator';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { CreateCmtDto } from '../dto/create-cmt.dto';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Get('get-user-cmt')
  getComment(@User() user) {
    return this.commentService.getUserComments(user.id);
  }
  @Post('create-comment')
  createComment(@User() user, @Body() body: CreateCmtDto) {
    return this.commentService.createComment(user.id, body);
  }
  @Delete('delete-all-comment')
  deleteAllComment(@User() user) {
    return this.commentService.deleteAllComment(user.id);
  }
  @Delete('delete-user-cmt/:id')
  deleteUserCmt(@Param('id') id: number) {
    return this.commentService.deleteUserCmt(id);
  }
  @Put('update-comment/:id')
  updateComment(@Param('id') id: number, @Body('content') content: string) {
    return this.commentService.updateComment(id, content);
  }
}
