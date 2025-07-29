import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth-guard';
import { CreateUrlDto } from './dto/create-url.dto';

@ApiTags('URL')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('shorten')
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiResponse({
    status: 201,
    description: 'Shortened URL successfully created',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  shorten(@Body() createUrlDto: CreateUrlDto, @Req() req) {
    const userId = req.user.id;
    return this.urlService.shorten(createUrlDto.originalUrl, userId);
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiResponse({ status: 302, description: 'Redirecting to original URL' })
  @ApiResponse({ status: 404, description: 'Short URL not found' })
  redirect(@Param('shortCode') code: string) {
    return this.urlService.redirect(code);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('stats/:shortCode')
  @ApiOperation({ summary: 'Get statistics of a short URL' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Short URL not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  stats(@Param('shortCode') code: string, @Req() req) {
    const userId = req.user.id;
    return this.urlService.getStats(code, userId);
  }
}
