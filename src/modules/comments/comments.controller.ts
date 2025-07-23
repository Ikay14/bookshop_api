import { Post,Delete,Body, Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { AddCommentDTO } from './dto/add-comment.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('comments')
@Controller('book/comment')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}


  @Post()
  @ApiOperation({ summary: 'Add a comment to a book' })
  @ApiBody({ type: AddCommentDTO })
  @ApiResponse({ status: 201, description: 'Comment added' })
  async addComment(
    @Body() addCommentDto: AddCommentDTO) {
    return this.commentsService.addComment(addCommentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comments for a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book comments' })
  async getComment(@Param('id') id: string) {
    return this.commentsService.getBookComments(id);
  }
}
