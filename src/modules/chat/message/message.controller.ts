import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageGateway } from './message.gateway';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Message')
@UseGuards(JwtAuthGuard)
@Controller('chat/message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageGateway: MessageGateway,
  ) {}

  
  @ApiOperation({
    summary: 'Send message',
    description:
      'Send a text message or prescription message. Only doctors can create prescription messages.',
  })
  @Post()
  async create(
    @Req() req: Request,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      const user_id = req.user.userId;
      const result = await this.messageService.create(
        user_id,
        createMessageDto,
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        success: false,
        message: error.message || 'Failed to send message',
      };
    }
  }
  @ApiOperation({
    summary: 'Get all messages',
    description:
      'Get all messages in a conversation. Returns messages with prescription data if applicable.',
  })
  @Get()
  async findAll(
    @Req() req: Request,
    @Query()
    query: { conversation_id: string; limit?: number; cursor?: string },
  ) {
    try {
      const user_id = req.user.userId;
      const conversation_id = query.conversation_id as string;
      const limit = Number(query.limit) || 20;
      const cursor = query.cursor as string;

      if (!conversation_id) {
        throw new HttpException('Conversation ID is required', 400);
      }

      const messages = await this.messageService.findAll({
        user_id,
        conversation_id,
        limit,
        cursor,
      });

      return messages;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch messages',
      };
    }
  }
  @ApiOperation({
    summary: 'Get a single message by ID',
    description:
      'Get a single message by its ID. Returns message with prescription data if applicable. User must be sender, receiver, or conversation participant.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    try {
      const user_id = req.user.userId;

      if (!user_id) {
        throw new HttpException(
          'User not authenticated',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await this.messageService.findOne(id, user_id);

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        success: false,
        message: error.message || 'Failed to fetch message',
      };
    }
  }
}
