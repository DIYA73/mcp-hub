import { IsString, IsUrl, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import type { McpTransport } from '../common/types';

export class CreateServerDto {
  @IsString()
  name!: string;

  @IsUrl({ require_tld: false })
  url!: string;

  @IsEnum(['sse', 'http', 'stdio'])
  @IsOptional()
  transport?: McpTransport;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}

export class UpdateServerDto {
  @IsUrl({ require_tld: false })
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  apiKey?: string;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}
