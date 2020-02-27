import { Controller, Post, Body, ValidationPipe, UseFilters } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { NewFeedbackDTO } from '../models/feedback/new-feedback-dto';
import { CommonExceptionFilter } from '../common/filters/common-exception.filter';
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';

@Controller('feedback')
@UseFilters(new CommonExceptionFilter())
export class FeedbackController {

  constructor(
    private readonly feedbackService: FeedbackService
  ) {}

  @Post()
  @UseFilters(new ValidationExceptionFilter())
  async sendFeedback(
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
    })) feedback: NewFeedbackDTO
  ) {
    return this.feedbackService.sendMail(feedback);
  }
}
